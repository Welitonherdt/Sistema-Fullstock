package com.fullstock.auth.dto;

public record LoginResponse(
    String token,
    String name,
    String role
) {
}
