package com.zahid.cinenight.features.polls.domain;

import com.zahid.cinenight.features.users.domain.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(
        name = "votes",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_votes_unique", columnNames = {"poll_id","user_id"})
        },
        indexes = {
                @Index(name = "idx_votes_option", columnList = "option_id"),
                @Index(name = "idx_votes_user", columnList = "user_id")
        }
)
public class Vote {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "poll_id", nullable = false)
    private Poll poll;

    @ManyToOne(optional = false)
    @JoinColumn(name = "option_id", nullable = false)
    private PollOption option;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer weight = 1;

    @CreationTimestamp
    @Column(name = "voted_at", nullable = false, updatable = false)
    private Instant votedAt;
}
