package com.zahid.cinenight.features.home.service;

import com.zahid.cinenight.features.movies.domain.MovieRepository;
import com.zahid.cinenight.features.movies.service.TmdbClient;
import com.zahid.cinenight.features.movies.dto.TmdbMoviePage;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HomeService {
    private final TmdbClient tmdb;
    private final MovieRepository movies;

    public HomeService(TmdbClient tmdb, MovieRepository movies) {
        this.tmdb = tmdb;
        this.movies = movies;
    }

    public TmdbMoviePage trending(String lang, int page) { return tmdb.trending(lang, page); }
    public TmdbMoviePage topRated(String lang, int page) { return tmdb.topRated(lang, page); }

    public record TopMovie(
            Long id, Integer tmdbId, String title, String posterPath,
            String backdropPath, String language, Short releaseYear,
            int voteCount, double avgRating, int viewCount, double score) {}

    public List<TopMovie> topMovies(int limit) {
        return movies.findTopMovies(limit).stream().map(r ->
                new TopMovie(
                        r.getId(), r.getTmdbId(), r.getTitle(), r.getPosterPath(), r.getBackdropPath(),
                        r.getLanguage(), r.getReleaseYear(),
                        r.getVoteCount() == null ? 0 : r.getVoteCount(),
                        r.getAvgRating() == null ? 0d : r.getAvgRating(),
                        r.getViewCount() == null ? 0 : r.getViewCount(),
                        r.getScore() == null ? 0d : r.getScore()
                )
        ).toList();
    }
}
