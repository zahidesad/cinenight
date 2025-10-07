package com.zahid.cinenight.common.api;

public record ApiResponse<T>(String status, T data) {
    public static <T> ApiResponse<T> ok(T data) { return new ApiResponse<>("ok", data); }
}
