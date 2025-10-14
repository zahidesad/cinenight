package com.zahid.cinenight.features.movies.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findByTmdbId(Integer tmdbId);

    interface TopMovieRow {
        Long getId();
        Integer getTmdbId();
        String getTitle();
        String getPosterPath();
        String getBackdropPath();
        String getLanguage();
        Short getReleaseYear();
        Integer getVoteCount();
        Double getAvgRating();
        Integer getViewCount();
        Double getScore();
    }

    @Query(value = """
        SELECT
          m.id                                         AS id,
          m.tmdb_id                                    AS tmdbId,
          m.title                                      AS title,
          m.poster_path                                AS posterPath,
          m.backdrop_path                              AS backdropPath,
          m.language                                   AS language,
          m.release_year                               AS releaseYear,
          COALESCE(v.cnt, 0)                           AS voteCount,
          COALESCE(v.avg_rating, 0)                    AS avgRating,
          COALESCE(w.cnt, 0)                           AS viewCount,
          (COALESCE(v.cnt,0)*0.6 + COALESCE(w.cnt,0)*0.4) AS score
        FROM movies m
        LEFT JOIN (
          SELECT movie_id, COUNT(*) AS cnt, AVG(rating) AS avg_rating
          FROM movie_vote GROUP BY movie_id
        ) v ON v.movie_id = m.id
        LEFT JOIN (
          SELECT movie_id, COUNT(*) AS cnt
          FROM movie_view GROUP BY movie_id
        ) w ON w.movie_id = m.id
        WHERE COALESCE(v.cnt,0) + COALESCE(w.cnt,0) > 0
        ORDER BY score DESC, voteCount DESC, viewCount DESC, m.id DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<TopMovieRow> findTopMovies(@Param("limit") int limit);
}
