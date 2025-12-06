package com.zahid.cinenight.features.events.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WatchEventRepository extends JpaRepository<WatchEvent, Long> {
    List<WatchEvent> findAllByGroupIdOrderByStartTimeDesc(Long groupId);
}
