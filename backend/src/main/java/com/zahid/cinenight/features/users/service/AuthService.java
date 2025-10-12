package com.zahid.cinenight.features.users.service;

import com.zahid.cinenight.features.notifications.service.EmailService;
import com.zahid.cinenight.features.users.domain.PasswordResetToken;
import com.zahid.cinenight.features.users.domain.PasswordResetTokenRepository;
import com.zahid.cinenight.features.users.domain.User;
import com.zahid.cinenight.features.users.domain.UserRepository;
import com.zahid.cinenight.features.users.dto.AuthDtos.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository users;
    private final EmailService emailService;
    private final PasswordResetTokenRepository tokens;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl;

    public AuthService(UserRepository users,
                       PasswordResetTokenRepository tokens,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       SecurityContextRepository securityContextRepository,
                       EmailService emailService) {
        this.users = users;
        this.tokens = tokens;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.emailService = emailService;
    }

    public UserDto register(RegisterRequest req) {
        if (users.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email already in use");
        }
        User u = new User();
        u.setEmail(req.email());
        u.setDisplayName(req.displayName());
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        users.save(u);
        return toDto(u);
    }

    public UserDto login(LoginRequest req, HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password()));

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        request.getSession(true); // session oluştur
        securityContextRepository.saveContext(context, request, response);

        User u = users.findByEmail(req.email()).orElseThrow();
        return toDto(u);
    }

    public void logout(HttpServletRequest request) {
        var session = request.getSession(false);
        if (session != null) session.invalidate();
        SecurityContextHolder.clearContext();
    }

    @Transactional
    public void forgot(ForgotPasswordRequest req) {
        var u = users.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String token = UUID.randomUUID().toString().replace("-", ""); // 32 char
        var prt = new PasswordResetToken();
        prt.setUser(u);
        prt.setToken(token);
        prt.setExpiresAt(LocalDateTime.now().plusHours(1));
        tokens.save(prt);

        String link = String.format("%s/reset-password?token=%s", frontendBaseUrl, token);
        emailService.sendPasswordReset(u.getEmail(), link);
    }

    @Transactional
    public void reset(ResetPasswordRequest req) {
        PasswordResetToken prt = tokens.findActiveByToken(req.token())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired token"));

        User u = prt.getUser();
        u.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        users.save(u);

        tokens.markUsed(prt.getId(), LocalDateTime.now());
        tokens.deleteOtherActiveForUser(u.getId(), prt.getId());
    }


    public UserDto me(String email) {
        User u = users.findByEmail(email).orElseThrow();
        return toDto(u);
    }

    private static UserDto toDto(User u) {
        return new UserDto(u.getId(), u.getEmail(), u.getDisplayName(), "USER");
    }
}
