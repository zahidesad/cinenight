package com.zahid.cinenight.features.groups.service;

import com.zahid.cinenight.features.groups.domain.*;
import com.zahid.cinenight.features.users.domain.User;
import com.zahid.cinenight.features.users.domain.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupService {

    public record CreateGroupReq(@NotBlank String name, String description) {}
    public record GroupDto(Long id, String name, String description, String visibility, String role) {
        public static GroupDto of(Group g, String role) {
            return new GroupDto(g.getId(), g.getName(), g.getDescription(),
                    g.getVisibility().name(), role);
        }
    }
    public record AddMemberReq(@NotNull Long groupId, @NotBlank String email, @NotNull GroupRole role) {}

    private final GroupRepository groups;
    private final GroupMemberRepository members;
    private final UserRepository users;

    public GroupService(GroupRepository groups, GroupMemberRepository members, UserRepository users) {
        this.groups = groups;
        this.members = members;
        this.users = users;
    }

    @Transactional
    public GroupDto create(CreateGroupReq req, Long ownerUserId) {
        Group g = new Group();
        g.setName(req.name());
        g.setDescription(req.description());
        g.setCreatedBy(users.findById(ownerUserId).orElse(null));
        groups.save(g);

        GroupMember m = new GroupMember();
        m.setId(new GroupMemberId(g.getId(), ownerUserId));
        m.setGroup(g);
        m.setUser(users.findById(ownerUserId).orElseThrow());
        m.setRole(GroupRole.OWNER);
        members.save(m);

        return GroupDto.of(g, "OWNER");
    }

    @Transactional
    public void addMember(AddMemberReq req, Long byUserId) {
        Group g = groups.findById(req.groupId()).orElseThrow(() -> new IllegalArgumentException("Grup bulunamadı."));
        GroupMember me = members.findById(new GroupMemberId(g.getId(), byUserId))
                .orElseThrow(() -> new IllegalArgumentException("Bu gruba üye değilsiniz."));
        if (me.getRole() == GroupRole.MEMBER) throw new IllegalArgumentException("Üye eklemek için ADMIN veya OWNER olmalısınız.");

        User u = users.findByEmail(req.email()).orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı."));
        GroupMemberId id = new GroupMemberId(g.getId(), u.getId());
        if (members.findById(id).isPresent()) return; // zaten üye

        GroupMember m = new GroupMember();
        m.setId(id);
        m.setGroup(g);
        m.setUser(u);
        m.setRole(req.role());
        members.save(m);
    }

    /** Kullanıcının tüm grupları (role ile) */
    public List<GroupDto> myGroups(Long userId) {
        return members.findAll().stream()
                .filter(m -> m.getUser().getId().equals(userId))
                .map(m -> GroupDto.of(m.getGroup(), m.getRole().name()))
                .toList();
    }
}
