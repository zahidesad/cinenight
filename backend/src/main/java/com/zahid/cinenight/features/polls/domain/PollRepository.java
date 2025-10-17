package com.zahid.cinenight.features.polls.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PollRepository extends JpaRepository<Poll, Long> {
    Optional<Poll> findByPublicToken(String publicToken);

}
