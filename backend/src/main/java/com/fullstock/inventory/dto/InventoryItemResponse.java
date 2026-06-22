package com.fullstock.inventory.dto;

import com.fullstock.product.entity.Product;

import java.math.BigDecimal;

public record InventoryItemResponse(
    Long productId,
    String code,
    String name,
    String category,
    Long locationId,
    String locationCode,
    String locationName,
    String unitMeasure,
    BigDecimal currentQuantity,
    BigDecimal minimumQuantity,
    Boolean critical,
    Boolean active
) {
    public static InventoryItemResponse fromEntity(Product product) {
        boolean critical = product.getCurrentQuantity().compareTo(product.getMinimumQuantity()) <= 0;
        return new InventoryItemResponse(
            product.getId(),
            product.getCode(),
            product.getName(),
            product.getCategory(),
            product.getLocation().getId(),
            product.getLocation().getCode(),
            product.getLocation().getName(),
            product.getUnitMeasure(),
            product.getCurrentQuantity(),
            product.getMinimumQuantity(),
            critical,
            product.getActive()
        );
    }
}
