package com.zahid.cinenight.common.error;

import com.zahid.cinenight.common.api.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    public record ApiError(String code, String message, String errId) {}

    /* ----------------------- AUTH ERRORS ----------------------- */

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError> handleAuth(AuthenticationException ex, HttpServletRequest req) {
        String errId = logAndGetErrId(ex, req);

        String code = "INVALID_CREDENTIALS";
        String message = "E-posta veya şifre yanlış.";

        if (ex instanceof DisabledException) {
            code = "ACCOUNT_DISABLED";
            message = "Hesabın devre dışı.";
        } else if (ex instanceof LockedException) {
            code = "ACCOUNT_LOCKED";
            message = "Hesabın kilitli.";
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiError(code, message, errId));
    }

    /* --------------------- CLIENT (400/403) -------------------- */

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgument(IllegalArgumentException ex,
                                                                     HttpServletRequest req) {
        logWarn(req, ex);
        return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex,
                                                                HttpServletRequest req) {
        logWarn(req, ex);
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining(", "));
        if (msg.isBlank()) msg = "Geçersiz istek.";
        return ResponseEntity.badRequest().body(ApiResponse.error(msg));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleConstraint(ConstraintViolationException ex,
                                                                HttpServletRequest req) {
        logWarn(req, ex);
        String msg = ex.getConstraintViolations().stream()
                .findFirst().map(ConstraintViolation::getMessage).orElse("Geçersiz istek.");
        return ResponseEntity.badRequest().body(ApiResponse.error(msg));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDenied(AccessDeniedException ex,
                                                                  HttpServletRequest req) {
        logWarn(req, ex);
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("Bu işlem için yetkin yok."));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleDataIntegrity(DataIntegrityViolationException ex,
                                                                   HttpServletRequest req) {
        logWarn(req, ex);
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error("İşlem gerçekleştirilemedi. Lütfen bilgileri kontrol edin."));
    }

    /* ----------------------- FALLBACK (500) -------------------- */

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleAny(Exception ex, HttpServletRequest req) {
        String id = logAndGetErrId(ex, req);
        // Kullanıcıya teknik mesaj göstermiyoruz
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin. (errId=" + id + ")"));
    }

    /* --------------------------- UTIL -------------------------- */

    private String logAndGetErrId(Exception ex, HttpServletRequest req) {
        String id = UUID.randomUUID().toString().substring(0, 8);
        log.error("[{}] {} {} failed: {}", id, req.getMethod(), req.getRequestURI(), ex.getMessage(), ex);
        return id;
    }

    private void logWarn(HttpServletRequest req, Exception ex) {
        log.warn("{} {} -> {}", req.getMethod(), req.getRequestURI(), ex.getMessage());
    }
}
