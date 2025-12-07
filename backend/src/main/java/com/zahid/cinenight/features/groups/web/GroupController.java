package com.zahid.cinenight.features.groups.web;

import com.zahid.cinenight.common.api.ApiResponse;
import com.zahid.cinenight.features.events.service.EventService;
import com.zahid.cinenight.features.groups.service.GroupService;
import com.zahid.cinenight.features.groups.service.GroupService.CreateGroupReq;
import com.zahid.cinenight.features.groups.service.GroupService.AddMemberReq;
import com.zahid.cinenight.features.groups.service.GroupService.GroupDto;
import com.zahid.cinenight.features.users.domain.UserRepository;
import jakarta.validation.Valid;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/groups")
public class GroupController {

    private final GroupService service;
    private final EventService eventService;
    private final UserRepository users;
    private final MessageSource messageSource;

    public GroupController(GroupService service, EventService eventService, UserRepository users, MessageSource messageSource) {
        this.service = service;
        this.eventService = eventService;
        this.users = users;
        this.messageSource = messageSource;
    }

    private Long uid(UserDetails p) {
        if (p == null) throw new AccessDeniedException(messageSource.getMessage("auth.login.required", null, LocaleContextHolder.getLocale()));
        return users.findByEmail(p.getUsername()).orElseThrow().getId();
    }

    @PostMapping
    public ApiResponse<GroupDto> create(@AuthenticationPrincipal UserDetails p,
                                        @RequestBody @Valid CreateGroupReq req) {
        return ApiResponse.ok(service.create(req, uid(p)));
    }

    @GetMapping("/my")
    public ApiResponse<List<GroupDto>> my(@AuthenticationPrincipal UserDetails p) {
        return ApiResponse.ok(service.myGroups(uid(p)));
    }

    @PostMapping("/add-member")
    public ApiResponse<String> add(@AuthenticationPrincipal UserDetails p,
                                   @RequestBody @Valid AddMemberReq req) {
        service.addMember(req, uid(p));
        return ApiResponse.ok("ok");
    }

    @GetMapping("/explore")
    public ApiResponse<List<GroupDto>> explore() {
        return ApiResponse.ok(service.explore());
    }

    @PostMapping("/join-token/{token}")
    public ApiResponse<Long> joinByToken(@AuthenticationPrincipal UserDetails p,
                                         @PathVariable String token) {
        Long groupId = service.joinByToken(token, uid(p));
        return ApiResponse.ok(groupId);
    }

    @PostMapping("/{groupId}/join")
    public ApiResponse<String> join(@AuthenticationPrincipal UserDetails p,
                                    @PathVariable Long groupId) {
        service.join(groupId, uid(p));
        return ApiResponse.ok("joined");
    }

    @GetMapping("/{groupId}/events")
    public ApiResponse<List<EventService.EventDto>> getGroupEvents(@AuthenticationPrincipal UserDetails p,
                                                                   @PathVariable Long groupId) {
        return ApiResponse.ok(eventService.listByGroup(groupId, uid(p)));
    }

    @GetMapping("/{groupId}/members")
    public ApiResponse<List<GroupService.GroupMemberDto>> getMembers(@AuthenticationPrincipal UserDetails p,
                                                                     @PathVariable Long groupId) {
        return ApiResponse.ok(service.getMembers(groupId, uid(p)));
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    public ApiResponse<String> removeMember(@AuthenticationPrincipal UserDetails p,
                                            @PathVariable Long groupId,
                                            @PathVariable Long userId) {
        service.removeMember(groupId, userId, uid(p));
        return ApiResponse.ok("removed");
    }

    @DeleteMapping("/{groupId}")
    public ApiResponse<String> deleteGroup(@AuthenticationPrincipal UserDetails p,
                                           @PathVariable Long groupId) {
        service.deleteGroup(groupId, uid(p));
        return ApiResponse.ok("deleted");
    }

    @PostMapping("/{groupId}/leave")
    public ApiResponse<String> leave(@AuthenticationPrincipal UserDetails p,
                                     @PathVariable Long groupId) {
        service.leaveGroup(groupId, uid(p));
        return ApiResponse.ok("left");
    }
}