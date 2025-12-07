package com.zahid.cinenight.features.groups.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findTop20ByVisibilityOrderByCreatedAtDesc(GroupVisibility visibility);
    Optional<Group> findByInviteToken(String inviteToken);
}
