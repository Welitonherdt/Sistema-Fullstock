package com.fullstock.user.dto;

import com.fullstock.user.entity.User;

import java.time.LocalDateTime;

public record UserResponse(
    Long id,
    String name,
    String email,
    String role,
    Boolean active,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static UserResponse fromEntity(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole().name(),
            user.getActive(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}
