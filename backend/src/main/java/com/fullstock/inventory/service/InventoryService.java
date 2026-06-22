package com.fullstock.inventory.service;

import com.fullstock.inventory.dto.InventoryItemResponse;
import com.fullstock.product.entity.Product;
import com.fullstock.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class InventoryService {

    private final ProductRepository productRepository;

    public InventoryService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<InventoryItemResponse> list(String search, Boolean criticalOnly, Boolean includeInactive) {
        String normalizedSearch = search == null ? null : search.trim().toLowerCase(Locale.ROOT);
        boolean includeAll = includeInactive != null && includeInactive;

        return productRepository.findAll().stream()
            .filter(product -> includeAll || Boolean.TRUE.equals(product.getActive()))
            .filter(product -> matchesSearch(product, normalizedSearch))
            .filter(product -> criticalOnly == null || !criticalOnly || isCritical(product))
            .sorted(Comparator.comparing(Product::getName, String.CASE_INSENSITIVE_ORDER))
            .map(InventoryItemResponse::fromEntity)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<InventoryItemResponse> critical() {
        return list(null, true, false);
    }

    private boolean isCritical(Product product) {
        return product.getCurrentQuantity().compareTo(product.getMinimumQuantity()) <= 0;
    }

    private boolean matchesSearch(Product product, String search) {
        if (search == null || search.isBlank()) {
            return true;
        }

        return safeLower(product.getCode()).contains(search)
            || safeLower(product.getName()).contains(search)
            || safeLower(product.getCategory()).contains(search)
            || safeLower(product.getLocation().getCode()).contains(search)
            || safeLower(product.getLocation().getName()).contains(search);
    }

    private String safeLower(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT);
    }
}
