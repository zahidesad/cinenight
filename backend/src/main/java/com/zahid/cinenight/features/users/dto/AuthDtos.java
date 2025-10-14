package com.zahid.cinenight.features.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {
    public record RegisterRequest(
            @Email @NotBlank String email,
            @NotBlank @Size(min=6,max=64) String password,
            @NotBlank @Size(min=2,max=100) String displayName) {}
    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}
    public record ForgotPasswordRequest(@Email @NotBlank String email) {}
    public record ResetPasswordRequest(@NotBlank String token, @NotBlank @Size(min=6,max=64) String newPassword) {}
    public record UserDto(Long id, String email, String displayName, String role) {}
}
