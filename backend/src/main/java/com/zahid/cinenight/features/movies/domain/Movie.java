package com.zahid.cinenight.features.movies.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(
        name = "movies",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_movies_tmdb", columnNames = "tmdb_id"),
                @UniqueConstraint(name = "uk_movies_imdb", columnNames = "imdb_id")
        }
)
public class Movie {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tmdb_id", nullable = false)
    private Integer tmdbId;

    @Column(name = "imdb_id", length = 20)
    private String imdbId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "original_title", length = 255)
    private String originalTitle;

    @Column(name = "release_year")
    private Short releaseYear;

    @Column(name = "runtime_minutes")
    private Short runtimeMinutes;

    @Column(name = "poster_path", length = 255)
    private String posterPath;

    @Column(name = "backdrop_path", length = 255)
    private String backdropPath;

    @Column(length = 2, nullable = false)
    private String language;

    @Column(length = 255)
    private String genres;

    @CreationTimestamp
    @Column(name = "fetched_at", nullable = false, updatable = false)
    private Instant fetchedAt;
}
