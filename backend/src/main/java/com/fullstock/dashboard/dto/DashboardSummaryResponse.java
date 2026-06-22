package com.fullstock.dashboard.dto;

import com.fullstock.movement.dto.MovementResponse;

import java.util.List;

public record DashboardSummaryResponse(
    long totalProducts,
    long criticalItems,
    long entriesToday,
    long exitsToday,
    List<MovementResponse> recentMovements
) {
}
