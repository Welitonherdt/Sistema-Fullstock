package com.fullstock.product.dto;

import com.fullstock.product.entity.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
    Long id,
    String code,
    String name,
    String description,
    String category,
    Long locationId,
    String locationCode,
    String locationName,
    String unitMeasure,
    BigDecimal currentQuantity,
    BigDecimal minimumQuantity,
    Boolean critical,
    Boolean active,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static ProductResponse fromEntity(Product product) {
        boolean critical = product.getCurrentQuantity() != null
            && product.getMinimumQuantity() != null
            && product.getCurrentQuantity().compareTo(product.getMinimumQuantity()) <= 0;

        return new ProductResponse(
            product.getId(),
            product.getCode(),
            product.getName(),
            product.getDescription(),
            product.getCategory(),
            product.getLocation().getId(),
            product.getLocation().getCode(),
            product.getLocation().getName(),
            product.getUnitMeasure(),
            product.getCurrentQuantity(),
            product.getMinimumQuantity(),
            critical,
            product.getActive(),
            product.getCreatedAt(),
            product.getUpdatedAt()
        );
    }
}
