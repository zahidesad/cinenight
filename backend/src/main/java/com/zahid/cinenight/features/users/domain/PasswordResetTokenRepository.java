package com.zahid.cinenight.features.users.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    @Query("""
     select t from PasswordResetToken t
     join fetch t.user u
     where t.token = :token
       and t.usedAt is null
       and t.expiresAt > CURRENT_TIMESTAMP
  """)
    Optional<PasswordResetToken> findActiveByToken(@Param("token") String token);

    @Modifying
    @Query("update PasswordResetToken t set t.usedAt = :usedAt where t.id = :id")
    void markUsed(@Param("id") Long id, @Param("usedAt") LocalDateTime usedAt);

    @Modifying
    @Query("delete from PasswordResetToken t where t.user.id = :userId and t.usedAt is null and t.id <> :keepId")
    void deleteOtherActiveForUser(@Param("userId") Long userId, @Param("keepId") Long keepId);
}

