package com.fullstock.movement.repository;

import com.fullstock.common.enums.MovementType;
import com.fullstock.movement.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long>, JpaSpecificationExecutor<StockMovement> {
    @EntityGraph(attributePaths = {"product", "createdBy"})
    List<StockMovement> findAll(Specification<StockMovement> spec, Sort sort);

    @Query("""
        select m from StockMovement m
        join fetch m.product p
        join fetch m.createdBy u
        where (:productId is null or p.id = :productId)
          and (:type is null or m.type = :type)
          and (:startDate is null or m.movementDate >= :startDate)
          and (:endDate is null or m.movementDate <= :endDate)
        order by m.movementDate desc, m.id desc
        """)
    List<StockMovement> findAllFiltered(
        @Param("productId") Long productId,
        @Param("type") MovementType type,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("""
        select m from StockMovement m
        join fetch m.product p
        join fetch m.createdBy u
        order by m.movementDate desc, m.id desc
        """)
    List<StockMovement> findRecentMovements(Pageable pageable);

    long countByTypeAndMovementDateBetween(MovementType type, LocalDateTime start, LocalDateTime end);
}
