package com.zahid.cinenight.features.polls.web;

import com.zahid.cinenight.common.api.ApiResponse;
import com.zahid.cinenight.features.polls.service.PollService;
import com.zahid.cinenight.features.polls.service.PollService.*;
import com.zahid.cinenight.features.users.domain.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/polls")
public class PollController {

    private final PollService service;
    private final UserRepository users;

    public PollController(PollService service, UserRepository users) {
        this.service = service;
        this.users = users;
    }

    private Long uid(UserDetails p) {
        if (p == null) throw new AccessDeniedException("Giriş gerekli.");
        return users.findByEmail(p.getUsername()).orElseThrow().getId();
    }

    @PostMapping
    public ApiResponse<PollDto> create(@AuthenticationPrincipal UserDetails p,
                                       @RequestBody @Valid CreatePollReq req) {
        return ApiResponse.ok(service.create(req, uid(p)));
    }

    @PostMapping("/add-option")
    public ApiResponse<String> addOption(@AuthenticationPrincipal UserDetails p,
                                         @RequestBody @Valid AddOptionReq req) {
        service.addOption(req, uid(p));
        return ApiResponse.ok("ok");
    }

    @PostMapping("/{pollId}/vote")
    public ApiResponse<String> vote(@AuthenticationPrincipal UserDetails p,
                                    @PathVariable Long pollId,
                                    @RequestBody @Valid VoteReq req) {
        service.vote(pollId, req, uid(p));
        return ApiResponse.ok("ok");
    }

    @GetMapping("/{pollId}/results")
    public ApiResponse<List<OptionResult>> results(@PathVariable Long pollId) {
        return ApiResponse.ok(service.results(pollId));
    }

    @PostMapping("/{pollId}/close")
    public ApiResponse<String> close(@AuthenticationPrincipal UserDetails p, @PathVariable Long pollId) {
        service.close(pollId, uid(p));
        return ApiResponse.ok("closed");
    }

    @GetMapping("/public/{token}")
    public ApiResponse<PollDto> byToken(@PathVariable String token) {
        return ApiResponse.ok(service.getByPublicToken(token));
    }
}
