package com.zahid.cinenight.features.users.dto;

public class AuthDtos {
    public record RegisterRequest(String email, String password, String displayName) {}
    public record LoginRequest(String email, String password) {}
    public record ForgotPasswordRequest(String email) {}
    public record ResetPasswordRequest(String token, String newPassword) {}
    public record UserDto(Long id, String email, String displayName, String role) {}
}
