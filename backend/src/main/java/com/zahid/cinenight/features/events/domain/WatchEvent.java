package com.zahid.cinenight.features.events.domain;

import com.zahid.cinenight.features.groups.domain.Group;
import com.zahid.cinenight.features.movies.domain.Movie;
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
        name = "watch_events",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_events_ical", columnNames = "ical_uid")
        },
        indexes = {
                @Index(name = "idx_events_group", columnList = "group_id"),
                @Index(name = "idx_events_movie", columnList = "movie_id")
        }
)
public class WatchEvent {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @Column(nullable = false, length = 255)
    private String title;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(nullable = false, length = 64)
    private String timezone = "UTC";

    @Column(name = "location_text", length = 255)
    private String locationText;

    @Column(name = "location_url", length = 255)
    private String locationUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private EventStatus status = EventStatus.SCHEDULED;

    @Column(name = "ical_uid", length = 64)
    private String icalUid;

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
