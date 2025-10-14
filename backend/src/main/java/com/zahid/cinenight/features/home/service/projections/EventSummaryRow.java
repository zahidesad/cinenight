package com.zahid.cinenight.features.home.service.projections;

import java.time.LocalDateTime;

public interface EventSummaryRow {
    Long getId();
    String getTitle();
    Long getGroupId();
    String getGroupName();
    LocalDateTime getStartTime();
    String getTimezone();
}
