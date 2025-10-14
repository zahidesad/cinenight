package com.zahid.cinenight.features.movies.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "movie_vote")
@Getter
@Setter
public class MovieVote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @Column(nullable = false, columnDefinition = "TINYINT")
    private byte rating;
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public MovieVote() {
    }

    public MovieVote(Movie movie, byte rating) {
        this.movie = movie;
        this.rating = rating;
    }

    @PrePersist
    void pre() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
