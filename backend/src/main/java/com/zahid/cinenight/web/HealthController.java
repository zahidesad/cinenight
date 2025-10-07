package com.zahid.cinenight.web;

import org.springframework.web.bind.annotation.*;
import com.zahid.cinenight.common.api.ApiResponse;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {
    @GetMapping("/ping")
    public ApiResponse<String> ping() {
        return ApiResponse.ok("pong");
    }
}