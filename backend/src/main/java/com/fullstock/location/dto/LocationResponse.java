package com.fullstock.location.dto;

import com.fullstock.location.entity.Location;

import java.time.LocalDateTime;

public record LocationResponse(
    Long id,
    String code,
    String name,
    String description,
    Boolean active,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static LocationResponse fromEntity(Location location) {
        return new LocationResponse(
            location.getId(),
            location.getCode(),
            location.getName(),
            location.getDescription(),
            location.getActive(),
            location.getCreatedAt(),
            location.getUpdatedAt()
        );
    }
}
