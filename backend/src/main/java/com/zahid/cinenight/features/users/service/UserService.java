package com.zahid.cinenight.features.users.service;

import com.zahid.cinenight.features.notifications.service.EmailService;
import com.zahid.cinenight.features.users.domain.*;
import com.zahid.cinenight.features.users.dto.AuthDtos.UserDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    public record UpdateProfileReq(String displayName, String email) {}
    public record ChangePasswordReq(String currentPassword, String newPassword) {}

    private final UserRepository users;
    private final VerificationTokenRepository verifyTokens;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl;

    public UserService(UserRepository users,
                       VerificationTokenRepository verifyTokens,
                       EmailService emailService,
                       PasswordEncoder passwordEncoder) {
        this.users = users;
        this.verifyTokens = verifyTokens;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserDto updateProfile(Long userId, UpdateProfileReq req) {
        User user = users.findById(userId).orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı."));

        if (req.displayName() != null && !req.displayName().isBlank()) {
            user.setDisplayName(req.displayName());
        }

        if (req.email() != null && !req.email().isBlank() && !req.email().equals(user.getEmail())) {
            if (users.existsByEmail(req.email())) {
                throw new IllegalArgumentException("Bu e-posta adresi zaten kullanımda.");
            }

            user.setPendingEmail(req.email());
            users.save(user);

            String token = UUID.randomUUID().toString();
            VerificationToken vt = new VerificationToken();
            vt.setUser(user);
            vt.setToken(token);
            vt.setExpiresAt(LocalDateTime.now().plusHours(24));
            verifyTokens.save(vt);


            String link = String.format("%s/verify-email?token=%s&type=email_change", frontendBaseUrl, token);
            emailService.sendEmailChangeVerification(req.email(), link);
        } else {
            users.save(user);
        }

        return new UserDto(user.getId(), user.getEmail(), user.getDisplayName(), "USER");
    }

    @Transactional
    public void confirmEmailChange(String token) {
        VerificationToken vt = verifyTokens.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Geçersiz token."));

        if (vt.getExpiresAt().isBefore(LocalDateTime.now())) {
            verifyTokens.delete(vt);
            throw new IllegalArgumentException("Token süresi dolmuş.");
        }

        User user = vt.getUser();
        if (user.getPendingEmail() == null) {
            verifyTokens.delete(vt);
            return;
        }

        user.setEmail(user.getPendingEmail());
        user.setPendingEmail(null);
        users.save(user);

        verifyTokens.delete(vt);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordReq req) {
        User user = users.findById(userId).orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı."));
        if (!passwordEncoder.matches(req.currentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Mevcut şifreniz yanlış.");
        }
        if (passwordEncoder.matches(req.newPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Yeni şifre eskisiyle aynı olamaz.");
        }
        user.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        users.save(user);
    }
}