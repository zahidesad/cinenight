package com.zahid.cinenight.features.polls.domain;

import com.zahid.cinenight.features.movies.domain.Movie;
import com.zahid.cinenight.features.users.domain.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(
        name = "poll_options",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_poll_option_unique", columnNames = {"poll_id","movie_id"})
        },
        indexes = {
                @Index(name = "idx_poll_options_poll", columnList = "poll_id"),
                @Index(name = "idx_poll_options_movie", columnList = "movie_id")
        }
)
public class PollOption {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "poll_id", nullable = false)
    private Poll poll;

    @ManyToOne(optional = false)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @Column(length = 255)
    private String label;

    @ManyToOne
    @JoinColumn(name = "added_by")
    private User addedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
