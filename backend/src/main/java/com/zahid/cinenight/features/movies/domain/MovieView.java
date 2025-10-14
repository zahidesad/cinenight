package com.zahid.cinenight.features.movies.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "movie_view")
@Getter @Setter
public class MovieView {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @Column(name = "viewed_at", nullable = false)
    private Instant viewedAt;

    @Column private String ip;
    @Column(name="user_agent") private String userAgent;

    public MovieView() {}
    public MovieView(Movie movie) { this.movie = movie; }

    @PrePersist void pre() {
        if (viewedAt == null) viewedAt = Instant.now();
    }
}
