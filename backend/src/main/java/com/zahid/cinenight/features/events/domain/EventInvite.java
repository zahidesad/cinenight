package com.zahid.cinenight.features.events.domain;

import com.zahid.cinenight.features.users.domain.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(
        name = "event_invites",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_event_invites_token", columnNames = "token")
        },
        indexes = {
                @Index(name = "idx_event_invites_event", columnList = "event_id")
        }
)
public class EventInvite {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private WatchEvent event;

    @Column(nullable = false, length = 255)
    private String email;

    @ManyToOne
    @JoinColumn(name = "invited_by")
    private User invitedBy;

    @Column(nullable = false, length = 36)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private InviteStatus status = InviteStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "invited_user_id")
    private User invitedUser;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "responded_at")
    private Instant respondedAt;
}
