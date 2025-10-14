package com.zahid.cinenight.features.movies.service;

import com.zahid.cinenight.features.movies.domain.Movie;
import com.zahid.cinenight.features.movies.domain.MovieRepository;
import com.zahid.cinenight.features.movies.dto.TmdbMovie;
import com.zahid.cinenight.features.movies.dto.TmdbMoviePage;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;

@Service
public class MovieService {

    public record MovieDto(Long id, Integer tmdbId, String title, String posterPath,
                           String backdropPath, String language, Short releaseYear) {
        public static MovieDto from(Movie m) {
            return new MovieDto(
                    m.getId(),
                    m.getTmdbId(),
                    m.getTitle(),
                    m.getPosterPath(),
                    m.getBackdropPath(),
                    m.getLanguage(),
                    m.getReleaseYear()
            );
        }
    }

    public record PagedMovies(int page, int totalPages, List<MovieDto> results) {}

    private final TmdbClient tmdb;
    private final MovieRepository movies;

    public MovieService(TmdbClient tmdb, MovieRepository movies) {
        this.tmdb = tmdb;
        this.movies = movies;
    }

    @Cacheable(value = "movieById", key = "#tmdbId")
    public MovieDto byId(int tmdbId, String lang) {
        var existing = movies.findByTmdbId(tmdbId);
        if (existing.isPresent()) return MovieDto.from(existing.get());

        // FIX: fetchById yerine movieDetail
        TmdbMovie tm = tmdb.movieDetail(tmdbId, lang);
        return MovieDto.from(upsertFromTmdb(tm));
    }

    @Cacheable(value = "movieSearch", key = "#q+'|'+#lang+'|'+#page")
    @Transactional
    public PagedMovies search(String q, String lang, int page) {
        // FIX: generic yok -> TmdbMoviePage
        TmdbMoviePage res = tmdb.search(q, lang, page);
        var saved = res.results().stream().map(this::upsertFromTmdb).toList();
        return new PagedMovies(
                res.page(),
                res.total_pages(),
                saved.stream().map(MovieDto::from).toList()
        );
    }

    @Cacheable(value = "movieTrending", key = "#lang+'|'+#page")
    @Transactional
    public PagedMovies trending(String lang, int page) {
        TmdbMoviePage res = tmdb.trending(lang, page);
        var saved = res.results().stream().map(this::upsertFromTmdb).toList();
        return new PagedMovies(
                res.page(),
                res.total_pages(),
                saved.stream().map(MovieDto::from).toList()
        );
    }

    @Transactional
    protected Movie upsertFromTmdb(TmdbMovie t) {
        var m = movies.findByTmdbId(t.id()).orElseGet(Movie::new);
        if (m.getId() == null) m.setTmdbId(t.id());

        m.setTitle(t.title());
        m.setOriginalTitle(t.original_title());

        if (nonNull(t.release_date()) && t.release_date().length() >= 4) {
            try {
                m.setReleaseYear(Short.parseShort(t.release_date().substring(0, 4)));
            } catch (Exception ignored) {}
        }

        if (nonNull(t.runtime())) m.setRuntimeMinutes(t.runtime().shortValue());
        m.setPosterPath(t.poster_path());
        m.setBackdropPath(t.backdrop_path());
        m.setLanguage(t.original_language() != null ? t.original_language() : "en");

        if (t.genres() != null) {
            m.setGenres(
                    t.genres().stream()
                            .map(g -> g.name())
                            .collect(Collectors.joining(","))
            );
        }

        m.setFetchedAt(Instant.now());
        return movies.save(m);
    }
}
