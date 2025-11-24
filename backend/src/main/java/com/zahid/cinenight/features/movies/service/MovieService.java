package com.zahid.cinenight.features.movies.service;

import com.zahid.cinenight.features.movies.domain.*;
import com.zahid.cinenight.features.movies.dto.TmdbGenre;
import com.zahid.cinenight.features.movies.dto.TmdbMovie;
import com.zahid.cinenight.features.movies.dto.TmdbMoviePage;
import org.springframework.context.annotation.Lazy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;

@Service
public class MovieService {

    public record MovieDto(Long id, Integer tmdbId, String title, String posterPath,
                           String backdropPath, String language, Short releaseYear,
                           String description
    ) {
        public static MovieDto from(Movie m) {
            return new MovieDto(
                    m.getId(),
                    m.getTmdbId(),
                    m.getTitle(),
                    m.getPosterPath(),
                    m.getBackdropPath(),
                    m.getLanguage(),
                    m.getReleaseYear(),
                    m.getDescription()
            );
        }
    }

    public record PagedMovies(int page, int totalPages, List<MovieDto> results) {
    }

    private final TmdbClient tmdb;
    private final MovieRepository movies;
    private final GenreService genreService;
    private final MovieViewRepository views;
    private final MovieVoteRepository votes;

    @Autowired
    @Lazy
    private MovieService self;

    public MovieService(TmdbClient tmdb,
                        MovieRepository movies,
                        GenreService genreService,
                        MovieViewRepository views,
                        MovieVoteRepository votes) {
        this.tmdb = tmdb;
        this.movies = movies;
        this.genreService = genreService;
        this.views = views;
        this.votes = votes;
    }


    @Cacheable(value = "movieById", key = "#tmdbId")
    public MovieDto byId(int tmdbId, String lang) {
        // Cache hit olsa bile DB'den emin olmak için basit kontrol (Cache config hallediyor ama)
        // Burada DB kontrolünü transactional olmayan bir akışta yapıyoruz.
        var existing = movies.findByTmdbId(tmdbId);
        if (existing.isPresent() && existing.get().getDescription() != null) {
            return MovieDto.from(existing.get());
        }

        TmdbMovie tm = tmdb.movieDetail(tmdbId, lang);
        return MovieDto.from(self.upsertFromTmdb(tm, lang));
    }

    @Cacheable(value = "movieSearch", key = "#q+'|'+#lang+'|'+#page")
    public PagedMovies search(String q, String lang, int page) {
        TmdbMoviePage res = tmdb.search(q, lang, page);
        var saved = res.results().stream().map(t -> self.upsertFromTmdb(t, lang)).toList();
        return new PagedMovies(
                res.page(),
                res.total_pages(),
                saved.stream().map(MovieDto::from).toList()
        );
    }

    @Cacheable(value = "movieTrending", key = "#lang+'|'+#page")
    public PagedMovies trending(String lang, int page) {
        TmdbMoviePage res = tmdb.trending(lang, page);
        var saved = res.results().stream().map(t -> self.upsertFromTmdb(t, lang)).toList();
        return new PagedMovies(
                res.page(),
                res.total_pages(),
                saved.stream().map(MovieDto::from).toList()
        );
    }

    /**
     * DÜZELTME: Bu metodun üzerindeki @Transactional kaldırıldı.
     * Neden? Çünkü bu metod bir "Orchestrator" (Yönetici).
     * İçinde createMovieSafely çağırıyor. Eğer o metod hata verirse (Duplicate),
     * o metodun kendi transaction'ı rollback oluyor.
     * Eğer bu metodun da transaction'ı olsaydı, içteki hata bunu da "rollback-only" yapardı
     * ve catch bloğunda kurtarsak bile "UnexpectedRollbackException" alırdık.
     *
     * Artık transaction yönetimi sadece uç metodlarda (create, update, get).
     */
    public Movie upsertFromTmdb(TmdbMovie t, String lang) {
        try {
            // Önce okumayı dene (Transaction yok, salt okuma)
            var existing = movies.findByTmdbId(t.id());

            if (existing.isPresent()) {
                return self.updateAndSave(existing.get(), t, lang);
            } else {
                return self.createMovieSafely(t, lang);
            }
        } catch (DataIntegrityViolationException e) {
            // 1. INSERT ÇAKIŞMASI: Başkası ekledi.
            // Sorun yok, createMovieSafely transaction'ı kapandı bitti.
            // Şimdi tertemiz bir sayfa açıp var olanı çekiyoruz.
            Movie m = self.getMovieSafely(t.id());
            try {
                return self.updateAndSave(m, t, lang);
            } catch (ObjectOptimisticLockingFailureException ex) {
                // 2. UPDATE ÇAKIŞMASI
                return self.getMovieSafely(t.id());
            }
        } catch (ObjectOptimisticLockingFailureException e) {
            // 3. UPDATE ÇAKIŞMASI
            return self.getMovieSafely(t.id());
        }
    }

    /**
     * Taze veri okumak için izole transaction.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
    public Movie getMovieSafely(Integer tmdbId) {
        return movies.findByTmdbId(tmdbId)
                .orElseThrow(() -> new IllegalStateException("Film veritabanında var ama okunamadı: " + tmdbId));
    }

    /**
     * İzole insert işlemi. Hata verirse sadece bu scope rollback olur.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Movie createMovieSafely(TmdbMovie t, String lang) {
        if (movies.findByTmdbId(t.id()).isPresent()) {
            throw new DataIntegrityViolationException("Movie already exists");
        }
        Movie m = new Movie();
        m.setTmdbId(t.id());
        mapFields(m, t, lang);
        return movies.saveAndFlush(m);
    }

    /**
     * Update işlemi için transaction (Ana akışta transaction yoksa burada başlasın diye).
     */
    @Transactional
    public Movie updateAndSave(Movie m, TmdbMovie t, String lang) {
        mapFields(m, t, lang);
        return movies.save(m);
    }

    private void mapFields(Movie m, TmdbMovie t, String lang) {
        String newTitle = t.title();
        if (newTitle == null) {
            newTitle = t.name();
        }
        if (newTitle == null) {
            newTitle = "Başlık Bilinmiyor";
        }

        m.setTitle(newTitle);
        m.setOriginalTitle(t.original_title());
        m.setDescription(t.overview());

        if (nonNull(t.release_date()) && t.release_date().length() >= 4) {
            try {
                m.setReleaseYear(Short.parseShort(t.release_date().substring(0, 4)));
            } catch (Exception ignored) {
            }
        }

        if (nonNull(t.runtime())) m.setRuntimeMinutes(t.runtime().shortValue());
        m.setPosterPath(t.poster_path());
        m.setBackdropPath(t.backdrop_path());
        m.setLanguage(t.original_language() != null ? t.original_language() : "en");

        if (t.genres() != null && !t.genres().isEmpty()) {
            m.setGenres(t.genres().stream()
                    .map(TmdbGenre::name)
                    .collect(Collectors.joining(",")));
        } else if (t.genre_ids() != null && !t.genre_ids().isEmpty()) {
            var map = genreService.genreMap(lang);
            m.setGenres(t.genre_ids().stream()
                    .map(id -> map.getOrDefault(id, String.valueOf(id)))
                    .collect(Collectors.joining(",")));
        }

        m.setFetchedAt(Instant.now());
    }

    private Movie ensureMovieEntity(int tmdbId, String lang) {
        return movies.findByTmdbId(tmdbId).orElseGet(() -> {
            var tm = tmdb.movieDetail(tmdbId, lang);
            return self.upsertFromTmdb(tm, lang);
        });
    }

    @Transactional
    public void recordView(int tmdbId, String lang, String ip, String ua) {
        var m = ensureMovieEntity(tmdbId, lang);
        var v = new MovieView(m);
        v.setIp(ip);
        v.setUserAgent(ua);
        views.save(v);
    }

    @Transactional
    public void rate(int tmdbId, String lang, byte rating) {
        if (rating < 1 || rating > 10) throw new IllegalArgumentException("rating must be 1..10");
        var m = ensureMovieEntity(tmdbId, lang);
        var vote = new MovieVote(m, rating);
        votes.save(vote);
    }
}