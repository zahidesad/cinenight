package com.zahid.cinenight.features.events.domain;

import com.zahid.cinenight.features.users.domain.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(
        name = "rsvps",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_rsvps_unique", columnNames = {"event_id","user_id"})
        },
        indexes = {
                @Index(name = "idx_rsvps_user", columnList = "user_id")
        }
)
public class Rsvp {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private WatchEvent event;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 8)
    private RsvpStatus status;

    @Column(nullable = false)
    private Integer guests = 0;

    @Column(length = 255)
    private String comment;

    @CreationTimestamp
    @Column(name = "responded_at", nullable = false, updatable = false)
    private Instant respondedAt;
}
