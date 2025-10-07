package com.zahid.cinenight.common.api;

public record ApiResponse<T>(boolean ok, T data, String error) {
    public static <T> ApiResponse<T> ok(T data) { return new ApiResponse<>(true, data, null); }
    public static <T> ApiResponse<T> error(String message) { return new ApiResponse<>(false, null, message); }
}
