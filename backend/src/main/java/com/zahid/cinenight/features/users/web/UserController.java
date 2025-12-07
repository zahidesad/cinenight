package com.zahid.cinenight.features.users.web;

import com.zahid.cinenight.common.api.ApiResponse;
import com.zahid.cinenight.features.users.dto.AuthDtos.UserDto;
import com.zahid.cinenight.features.users.domain.UserRepository;
import com.zahid.cinenight.features.users.service.UserService;
import com.zahid.cinenight.features.users.service.UserService.UpdateProfileReq;
import com.zahid.cinenight.features.users.service.UserService.ChangePasswordReq;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final UserRepository users;

    public UserController(UserService userService, UserRepository users) {
        this.userService = userService;
        this.users = users;
    }

    @PutMapping("/profile")
    public ApiResponse<UserDto> updateProfile(@AuthenticationPrincipal UserDetails p,
                                              @RequestBody @Valid UpdateProfileReq req) {
        Long userId = users.findByEmail(p.getUsername()).orElseThrow().getId();
        return ApiResponse.ok(userService.updateProfile(userId, req));
    }

    @PostMapping("/verify-email-change")
    public ApiResponse<String> verifyEmailChange(@RequestParam String token) {
        userService.confirmEmailChange(token);
        return ApiResponse.ok("updated");
    }

    @PostMapping("/change-password")
    public ApiResponse<String> changePassword(@AuthenticationPrincipal UserDetails p,
                                              @RequestBody @Valid ChangePasswordReq req) {
        Long userId = users.findByEmail(p.getUsername()).orElseThrow().getId();
        userService.changePassword(userId, req);
        return ApiResponse.ok("password-updated");
    }
}