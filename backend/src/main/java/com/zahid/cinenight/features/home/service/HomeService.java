package com.zahid.cinenight.features.home.service;

import com.zahid.cinenight.features.movies.domain.MovieRepository;
import com.zahid.cinenight.features.movies.dto.TmdbGenre;
import com.zahid.cinenight.features.movies.dto.TmdbMovie;
import com.zahid.cinenight.features.movies.dto.TmdbMoviePage;
import com.zahid.cinenight.features.movies.service.GenreService;
import com.zahid.cinenight.features.movies.service.TmdbClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class HomeService {

    private final TmdbClient tmdb;
    private final MovieRepository movies;
    private final GenreService genres;

    public HomeService(TmdbClient tmdb, MovieRepository movies, GenreService genres) {
        this.tmdb = tmdb;
        this.movies = movies;
        this.genres = genres;
    }

    /**
     * TMDB trending: genre_ids -> genres enrich edilerek döner
     */
    public TmdbMoviePage trending(String lang, int page) {
        TmdbMoviePage res = tmdb.trending(lang, page);
        Map<Integer, String> map = genres.genreMap(lang);

        List<TmdbMovie> enriched = res.results().stream()
                .map(m -> enrichGenres(m, map))
                .toList();

        return new TmdbMoviePage(res.page(), enriched, res.total_pages(), res.total_results());
    }

    /**
     * TMDB top_rated: genre_ids -> genres enrich edilerek döner
     */
    public TmdbMoviePage topRated(String lang, int page) {
        TmdbMoviePage res = tmdb.topRated(lang, page);
        Map<Integer, String> map = genres.genreMap(lang);

        List<TmdbMovie> enriched = res.results().stream()
                .map(m -> enrichGenres(m, map))
                .toList();

        return new TmdbMoviePage(res.page(), enriched, res.total_pages(), res.total_results());
    }

    /**
     * Platform içi en popüler filmler (oy+izlenme skoru)
     */
    public record TopMovie(
            Long id, Integer tmdbId, String title, String posterPath,
            String backdropPath, String language, Short releaseYear,
            int voteCount, double avgRating, int viewCount, double score) {
    }

    public List<TopMovie> topMovies(int limit) {
        return movies.findTopMovies(limit).stream().map(r ->
                new TopMovie(
                        r.getId(),
                        r.getTmdbId(),
                        r.getTitle(),
                        r.getPosterPath(),
                        r.getBackdropPath(),
                        r.getLanguage(),
                        r.getReleaseYear(),
                        r.getVoteCount() == null ? 0 : r.getVoteCount(),
                        r.getAvgRating() == null ? 0d : r.getAvgRating(),
                        r.getViewCount() == null ? 0 : r.getViewCount(),
                        r.getScore() == null ? 0d : r.getScore()
                )
        ).toList();
    }

    private static TmdbMovie enrichGenres(TmdbMovie m, Map<Integer, String> map) {
        if (m.genres() != null && !m.genres().isEmpty()) return m;

        List<TmdbGenre> list = (m.genre_ids() == null) ? List.of()
                : m.genre_ids().stream()
                .map(id -> new TmdbGenre(id, map.getOrDefault(id, String.valueOf(id))))
                .toList();

        return new TmdbMovie(
                m.id(),
                m.title(),
                m.original_title(),
                m.original_language(),
                m.release_date(),
                m.runtime(),
                m.poster_path(),
                m.backdrop_path(),
                list,
                m.genre_ids(),
                m.overview()
        );
    }
}
