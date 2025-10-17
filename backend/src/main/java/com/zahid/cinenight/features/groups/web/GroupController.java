package com.zahid.cinenight.features.groups.web;

import com.zahid.cinenight.common.api.ApiResponse;
import com.zahid.cinenight.features.groups.service.GroupService;
import com.zahid.cinenight.features.groups.service.GroupService.CreateGroupReq;
import com.zahid.cinenight.features.groups.service.GroupService.AddMemberReq;
import com.zahid.cinenight.features.groups.service.GroupService.GroupDto;
import com.zahid.cinenight.features.users.domain.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/groups")
public class GroupController {

    private final GroupService service;
    private final UserRepository users;

    public GroupController(GroupService service, UserRepository users) {
        this.service = service;
        this.users = users;
    }

    private Long uid(UserDetails p) {
        if (p == null) throw new AccessDeniedException("Giriş gerekli.");
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
}
