package com.zahid.cinenight.features.home.dto;

import java.time.LocalDateTime;
import java.util.List;

public class HomeDtos {
    public record HomeResponse(
            UserSummary user,
            List<GroupSummary> groups,
            List<PollSummary> activePolls,
            List<EventSummary> upcomingEvents
    ) {}

    public record UserSummary(Long id, String displayName, String email) {}
    public record GroupSummary(Long id, String name, String role, Integer memberCount) {}
    public record PollSummary(Long id, String title, Long groupId, String groupName, LocalDateTime closesAt) {}
    public record EventSummary(Long id, String title, Long groupId, String groupName,
                               LocalDateTime startTime, String timezone) {}
}
