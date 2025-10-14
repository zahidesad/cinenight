package com.zahid.cinenight.features.users.web;

import com.zahid.cinenight.common.api.ApiResponse;
import com.zahid.cinenight.features.users.dto.AuthDtos.*;
import com.zahid.cinenight.features.users.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService auth;

    public AuthController(AuthService auth) { this.auth = auth; }

    @PostMapping("/register")
    public ApiResponse<UserDto> register(@RequestBody @Valid RegisterRequest req) {
        return ApiResponse.ok(auth.register(req));
    }

    @PostMapping("/login")
    public ApiResponse<UserDto> login(@RequestBody @Valid LoginRequest req,
                                      HttpServletRequest request,
                                      HttpServletResponse response) {
        return ApiResponse.ok(auth.login(req, request, response));
    }

    @PostMapping("/logout")
    public ApiResponse<String> logout(HttpServletRequest request) {
        auth.logout(request);
        return ApiResponse.ok("ok");
    }

    @PostMapping("/forgot")
    public ApiResponse<String> forgot(@RequestBody @Valid ForgotPasswordRequest req) {
        auth.forgot(req);
        return ApiResponse.ok("sent");
    }

    @PostMapping("/reset")
    public ApiResponse<String> reset(@RequestBody @Valid ResetPasswordRequest req) {
        auth.reset(req);
        return ApiResponse.ok("password-updated");
    }

    @GetMapping("/me")
    public ApiResponse<UserDto> me(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) return ApiResponse.ok(null);
        return ApiResponse.ok(auth.me(principal.getUsername()));
    }
}
