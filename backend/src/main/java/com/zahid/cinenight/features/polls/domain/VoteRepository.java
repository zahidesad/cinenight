package com.zahid.cinenight.features.polls.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByPollIdAndUserId(Long pollId, Long userId);
    long countByOptionId(Long optionId);
}
