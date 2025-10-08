package com.zahid.cinenight.features.users.service;

import com.zahid.cinenight.features.users.domain.PasswordResetToken;
import com.zahid.cinenight.features.users.domain.PasswordResetTokenRepository;
import com.zahid.cinenight.features.users.domain.User;
import com.zahid.cinenight.features.users.domain.UserRepository;
import com.zahid.cinenight.features.users.dto.AuthDtos.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordResetTokenRepository tokens;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    public AuthService(UserRepository users,
                       PasswordResetTokenRepository tokens,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       SecurityContextRepository securityContextRepository) {
        this.users = users;
        this.tokens = tokens;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
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

    public void forgot(ForgotPasswordRequest req) {
        User u = users.findByEmail(req.email()).orElseThrow(() -> new IllegalArgumentException("User not found"));
        String token = UUID.randomUUID().toString().replace("-", ""); // 32-char token
        PasswordResetToken prt = new PasswordResetToken();
        prt.setUser(u);
        prt.setToken(token);
        prt.setExpiresAt(LocalDateTime.now().plusHours(1));
        tokens.save(prt);
    }

    public void reset(ResetPasswordRequest req) {
        PasswordResetToken prt = tokens.findByToken(req.token())
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));
        if (prt.getUsedAt() != null || prt.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token is expired or already used");
        }
        User u = prt.getUser();
        u.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        users.save(u);
        prt.setUsedAt(LocalDateTime.now());
        tokens.save(prt);
    }

    public UserDto me(String email) {
        User u = users.findByEmail(email).orElseThrow();
        return toDto(u);
    }

    private static UserDto toDto(User u) {
        return new UserDto(u.getId(), u.getEmail(), u.getDisplayName(), "USER");
    }

}
