package com.zahid.cinenight.features.polls.domain;

import com.zahid.cinenight.features.events.domain.WatchEvent;
import com.zahid.cinenight.features.groups.domain.Group;
import com.zahid.cinenight.features.users.domain.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(
        name = "polls",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_polls_public_token", columnNames = "public_token")
        },
        indexes = {
                @Index(name = "idx_polls_group", columnList = "group_id"),
                @Index(name = "idx_polls_event", columnList = "event_id")
        }
)
public class Poll {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private WatchEvent event;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "voting_strategy", nullable = false, length = 10)
    private VotingStrategy votingStrategy = VotingStrategy.SINGLE;

    @Column(name = "allow_add_options", nullable = false)
    private Boolean allowAddOptions = true;

    @Column(name = "max_votes_per_user", nullable = false)
    private Integer maxVotesPerUser = 1;

    @Column(name = "is_open", nullable = false)
    private Boolean isOpen = true;

    @Column(name = "public_token", length = 32)
    private String publicToken;

    @Column(name = "opens_at")
    private LocalDateTime opensAt;

    @Column(name = "closes_at")
    private LocalDateTime closesAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
