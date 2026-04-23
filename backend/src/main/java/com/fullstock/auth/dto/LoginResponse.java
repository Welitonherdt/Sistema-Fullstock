package com.fullstock.auth.dto;

public record LoginResponse(
    String token,
    Long userId,
    String name,
    String email,
    String role
) {
}
