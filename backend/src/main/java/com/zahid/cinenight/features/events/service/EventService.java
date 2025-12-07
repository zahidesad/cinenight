package com.zahid.cinenight.features.events.service;

import com.zahid.cinenight.features.events.domain.*;
import com.zahid.cinenight.features.groups.domain.Group;
import com.zahid.cinenight.features.groups.domain.GroupMemberId;
import com.zahid.cinenight.features.groups.domain.GroupRepository;
import com.zahid.cinenight.features.groups.domain.GroupMemberRepository;
import com.zahid.cinenight.features.movies.domain.Movie;
import com.zahid.cinenight.features.movies.domain.MovieRepository;
import com.zahid.cinenight.features.movies.service.MovieService;
import com.zahid.cinenight.features.users.domain.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EventService {

    public record CreateEventReq(
            @NotNull Long groupId,
            @NotBlank String title,
            Integer tmdbId,
            @NotNull LocalDateTime startTime,
            LocalDateTime endTime,
            String timezone,
            String locationText,
            String locationUrl,
            String language
    ) {}

    public record ParticipantDto(Long userId, String displayName, String avatarUrl, String status) {}

    public record EventDto(
            Long id, Long groupId, String title,
            Integer tmdbId, String movieTitle,
            LocalDateTime startTime, LocalDateTime endTime, String timezone,
            String locationText, String locationUrl,
            String status, String icalUid,
            String myRsvp,
            List<ParticipantDto> participants
    ) {
        public static EventDto from(WatchEvent e, String myRsvp, List<ParticipantDto> participants) {
            Integer tmdbId = Optional.ofNullable(e.getMovie()).map(Movie::getTmdbId).orElse(null);
            String movieTitle = Optional.ofNullable(e.getMovie()).map(Movie::getTitle).orElse(null);
            return new EventDto(
                    e.getId(), e.getGroup().getId(), e.getTitle(),
                    tmdbId, movieTitle,
                    e.getStartTime(), e.getEndTime(), e.getTimezone(),
                    e.getLocationText(), e.getLocationUrl(),
                    e.getStatus().name(), e.getIcalUid(),
                    myRsvp,
                    participants
            );
        }
    }

    public record RsvpReq(@NotNull RsvpStatus status, Integer guests, String comment) {}

    private final WatchEventRepository events;
    private final RsvpRepository rsvps;
    private final GroupRepository groups;
    private final GroupMemberRepository members;
    private final MovieRepository movies;
    private final MovieService movieService;
    private final UserRepository users;

    public EventService(WatchEventRepository events, RsvpRepository rsvps,
                        GroupRepository groups, GroupMemberRepository members,
                        MovieRepository movies, MovieService movieService,
                        UserRepository users) {
        this.events = events;
        this.rsvps = rsvps;
        this.groups = groups;
        this.members = members;
        this.movies = movies;
        this.movieService = movieService;
        this.users = users;
    }

    /** Grup üyesi mi kontrolü */
    private void ensureMember(Long groupId, Long userId) {
        var key = new GroupMemberId(groupId, userId);
        if (members.findById(key).isEmpty())
            throw new IllegalArgumentException("Bu gruba üye değilsiniz.");
    }

    /** Event oluştur */
    @Transactional
    public EventDto create(CreateEventReq req, Long currentUserId) {
        Group g = groups.findById(req.groupId()).orElseThrow(() -> new IllegalArgumentException("Grup bulunamadı."));
        ensureMember(g.getId(), currentUserId);

        WatchEvent e = new WatchEvent();
        e.setGroup(g);
        e.setTitle(req.title());
        e.setStartTime(req.startTime());
        e.setEndTime(req.endTime());
        e.setTimezone(req.timezone() == null || req.timezone().isBlank() ? "Europe/Istanbul" : req.timezone());
        e.setLocationText(req.locationText());
        e.setLocationUrl(req.locationUrl());
        e.setStatus(EventStatus.SCHEDULED);
        e.setCreatedBy(users.findById(currentUserId).orElse(null));

        if (req.tmdbId() != null) {
            var lang = (req.language() == null || req.language().isBlank()) ? "tr-TR" : req.language();
            movieService.byId(req.tmdbId(), lang);
            Movie m = movies.findByTmdbId(req.tmdbId()).orElseThrow();
            e.setMovie(m);
        }

        e.setIcalUid(generateUidIfAbsent(e.getIcalUid()));
        events.save(e);

        // Oluşturan kişi henüz RSVP yapmadı ama mantıken 'YES' sayılabilir. Şimdilik boş liste ve null dönüyoruz.
        // İstersen otomatik RSVP ekleyebilirsin.
        return EventDto.from(e, null, List.of());
    }

    public EventDto get(Long eventId, Long currentUserId) {
        WatchEvent e = events.findById(eventId).orElseThrow(() -> new IllegalArgumentException("Etkinlik bulunamadı."));
        ensureMember(e.getGroup().getId(), currentUserId);

        // Bu etkinliğe ait tüm RSVP'ler
        var allRsvps = rsvps.findAll().stream()
                .filter(r -> r.getEvent().getId().equals(eventId))
                .toList();

        // Benim durumum
        String myStatus = allRsvps.stream()
                .filter(r -> r.getUser().getId().equals(currentUserId))
                .findFirst()
                .map(r -> r.getStatus().name())
                .orElse(null);

        // Katılımcı Listesi
        List<ParticipantDto> participants = allRsvps.stream()
                .filter(r -> r.getStatus() == RsvpStatus.YES)
                .map(r -> new ParticipantDto(
                        r.getUser().getId(),
                        r.getUser().getDisplayName(),
                        r.getUser().getAvatarUrl(),
                        r.getStatus().name()
                ))
                .limit(10)
                .toList();

        return EventDto.from(e, myStatus, participants);
    }

    /** RSVP upsert */
    @Transactional
    public void rsvp(Long eventId, Long userId, RsvpReq req) {
        WatchEvent e = events.findById(eventId).orElseThrow(() -> new IllegalArgumentException("Etkinlik bulunamadı."));
        ensureMember(e.getGroup().getId(), userId);

        var existing = rsvps.findAll().stream()
                .filter(r -> r.getEvent().getId().equals(eventId) && r.getUser().getId().equals(userId))
                .findFirst();

        Rsvp r = existing.orElseGet(Rsvp::new);
        r.setEvent(e);
        r.setUser(users.findById(userId).orElseThrow());
        r.setStatus(req.status());
        r.setGuests(req.guests() == null ? 0 : Math.max(0, req.guests()));
        r.setComment(req.comment());
        rsvps.save(r);
    }

    /** ICS üretimi */
    @Transactional
    public String ics(Long eventId) {
        WatchEvent e = events.findById(eventId).orElseThrow(() -> new IllegalArgumentException("Etkinlik bulunamadı."));
        if (e.getIcalUid() == null || e.getIcalUid().isBlank()) {
            e.setIcalUid(generateUidIfAbsent(null));
            events.save(e);
        }
        return buildIcs(e);
    }

    /** Grup Etkinlik Listesi */
    public java.util.List<EventDto> listByGroup(Long groupId, Long currentUserId) {
        ensureMember(groupId, currentUserId);

        var list = events.findAllByGroupIdOrderByStartTimeDesc(groupId);
        var allRsvps = rsvps.findAll();

        return list.stream()
                .map(e -> {
                    var eventRsvps = allRsvps.stream()
                            .filter(r -> r.getEvent().getId().equals(e.getId()))
                            .toList();

                    String myStatus = eventRsvps.stream()
                            .filter(r -> r.getUser().getId().equals(currentUserId))
                            .findFirst()
                            .map(r -> r.getStatus().name())
                            .orElse(null);

                    List<ParticipantDto> participants = eventRsvps.stream()
                            .filter(r -> r.getStatus() == RsvpStatus.YES)
                            .map(r -> new ParticipantDto(
                                    r.getUser().getId(),
                                    r.getUser().getDisplayName(),
                                    r.getUser().getAvatarUrl(),
                                    r.getStatus().name()
                            ))
                            .limit(5)
                            .toList();

                    return EventDto.from(e, myStatus, participants);
                })
                .toList();
    }

    /* ------------ helpers ------------ */

    private static String generateUidIfAbsent(String current) {
        return (current != null && !current.isBlank()) ? current : ("cinenight-" + UUID.randomUUID());
    }

    private static String esc(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace(",", "\\,").replace(";", "\\;").replace("\n", "\\n");
    }

    private static String buildIcs(WatchEvent e) {
        String uid = e.getIcalUid();
        ZoneId zone = ZoneId.of(e.getTimezone() == null || e.getTimezone().isBlank() ? "Europe/Istanbul" : e.getTimezone());

        var start = e.getStartTime().atZone(zone).withZoneSameInstant(ZoneOffset.UTC);
        var end = (e.getEndTime() == null ? e.getStartTime().plusHours(2) : e.getEndTime())
                .atZone(zone).withZoneSameInstant(ZoneOffset.UTC);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'");

        String summary = e.getTitle();
        if (e.getMovie() != null && e.getMovie().getTitle() != null) {
            summary = e.getTitle() + " – " + e.getMovie().getTitle();
        }

        StringBuilder sb = new StringBuilder();
        sb.append("BEGIN:VCALENDAR\r\n")
                .append("VERSION:2.0\r\n")
                .append("PRODID:-//CineNight//EN\r\n")
                .append("CALSCALE:GREGORIAN\r\n")
                .append("METHOD:PUBLISH\r\n")
                .append("BEGIN:VEVENT\r\n")
                .append("UID:").append(uid).append("\r\n")
                .append("DTSTAMP:").append(Instant.now().atZone(ZoneOffset.UTC).format(fmt)).append("\r\n")
                .append("DTSTART:").append(start.format(fmt)).append("\r\n")
                .append("DTEND:").append(end.format(fmt)).append("\r\n")
                .append("SUMMARY:").append(esc(summary)).append("\r\n");

        if (e.getDescription() != null) sb.append("DESCRIPTION:").append(esc(e.getDescription())).append("\r\n");
        if (e.getLocationText() != null) sb.append("LOCATION:").append(esc(e.getLocationText())).append("\r\n");
        if (e.getLocationUrl() != null) sb.append("URL:").append(esc(e.getLocationUrl())).append("\r\n");

        sb.append("STATUS:CONFIRMED\r\n")
                .append("END:VEVENT\r\n")
                .append("END:VCALENDAR\r\n");

        return sb.toString();
    }
}