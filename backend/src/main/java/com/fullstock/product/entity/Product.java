package com.fullstock.product.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    private String description;

    private String category;

    @Column(name = "unit_measure", nullable = false)
    private String unitMeasure;

    @Column(name = "current_quantity", nullable = false, precision = 15, scale = 2)
    private BigDecimal currentQuantity;

    @Column(name = "minimum_quantity", nullable = false, precision = 15, scale = 2)
    private BigDecimal minimumQuantity;

    @Column(nullable = false)
    private Boolean active;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (active == null) {
            active = Boolean.TRUE;
        }
        if (currentQuantity == null) {
            currentQuantity = BigDecimal.ZERO;
        }
        if (minimumQuantity == null) {
            minimumQuantity = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
