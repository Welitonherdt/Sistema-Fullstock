package com.fullstock.movement.dto;

import com.fullstock.movement.entity.StockMovement;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MovementResponse(
    Long id,
    String type,
    Long productId,
    String productCode,
    String productName,
    BigDecimal quantity,
    LocalDateTime movementDate,
    String supplier,
    String destination,
    String borrowerName,
    String notes,
    Long createdById,
    String createdByName,
    LocalDateTime createdAt
) {
    public static MovementResponse fromEntity(StockMovement movement) {
        return new MovementResponse(
            movement.getId(),
            movement.getType().name(),
            movement.getProduct().getId(),
            movement.getProduct().getCode(),
            movement.getProduct().getName(),
            movement.getQuantity(),
            movement.getMovementDate(),
            movement.getSupplier(),
            movement.getDestination(),
            movement.getBorrowerName(),
            movement.getNotes(),
            movement.getCreatedBy().getId(),
            movement.getCreatedBy().getName(),
            movement.getCreatedAt()
        );
    }
}
