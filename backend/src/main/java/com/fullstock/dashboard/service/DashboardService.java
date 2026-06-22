package com.fullstock.dashboard.service;

import com.fullstock.common.enums.MovementType;
import com.fullstock.dashboard.dto.DashboardSummaryResponse;
import com.fullstock.movement.dto.MovementResponse;
import com.fullstock.movement.entity.StockMovement;
import com.fullstock.movement.repository.StockMovementRepository;
import com.fullstock.product.repository.ProductRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DashboardService {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;

    public DashboardService(ProductRepository productRepository, StockMovementRepository stockMovementRepository) {
        this.productRepository = productRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse summary() {
        long totalProducts = productRepository.count();
        long criticalItems = productRepository.findAll().stream()
            .filter(product -> product.getCurrentQuantity().compareTo(product.getMinimumQuantity()) <= 0)
            .count();

        LocalDate today = LocalDate.now();
        LocalDateTime dayStart = today.atStartOfDay();
        LocalDateTime dayEnd = today.plusDays(1).atStartOfDay().minusNanos(1);

        long entriesToday = stockMovementRepository.countByTypeAndMovementDateBetween(MovementType.ENTRY, dayStart, dayEnd);
        long exitsToday = stockMovementRepository.countByTypeAndMovementDateBetween(MovementType.EXIT, dayStart, dayEnd);

        List<StockMovement> recent = stockMovementRepository.findRecentMovements(PageRequest.of(0, 5));
        List<MovementResponse> recentMovements = recent.stream()
            .map(MovementResponse::fromEntity)
            .toList();

        return new DashboardSummaryResponse(
            totalProducts,
            criticalItems,
            entriesToday,
            exitsToday,
            recentMovements
        );
    }
}
