package com.fullstock.report.dto;

import com.fullstock.inventory.dto.InventoryItemResponse;

import java.math.BigDecimal;

public record StockReportItemResponse(
    String code,
    String name,
    String category,
    String locationCode,
    String locationName,
    String unitMeasure,
    BigDecimal currentQuantity,
    BigDecimal minimumQuantity,
    Boolean critical,
    Boolean active
) {
    public static StockReportItemResponse fromInventory(InventoryItemResponse item) {
        return new StockReportItemResponse(
            item.code(),
            item.name(),
            item.category(),
            item.locationCode(),
            item.locationName(),
            item.unitMeasure(),
            item.currentQuantity(),
            item.minimumQuantity(),
            item.critical(),
            item.active()
        );
    }
}
