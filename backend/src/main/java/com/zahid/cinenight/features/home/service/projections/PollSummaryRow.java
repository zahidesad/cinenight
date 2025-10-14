package com.zahid.cinenight.features.home.service.projections;

import java.time.LocalDateTime;

public interface PollSummaryRow {
    Long getId();
    String getTitle();
    Long getGroupId();
    String getGroupName();
    LocalDateTime getClosesAt();
}
