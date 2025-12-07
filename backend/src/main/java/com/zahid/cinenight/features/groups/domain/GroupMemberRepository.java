package com.zahid.cinenight.features.groups.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GroupMemberRepository extends JpaRepository<GroupMember, GroupMemberId> {
    int countByGroupId(Long groupId);
    @Modifying
    @Query(value = "INSERT IGNORE INTO group_members (group_id, user_id, role, joined_at) VALUES (:groupId, :userId, :role, NOW())", nativeQuery = true)
    void joinGroupNative(@Param("groupId") Long groupId, @Param("userId") Long userId, @Param("role") String role);
}
