package com.fullstock.report.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @GetMapping("/movements")
    public ResponseEntity<List<Map<String, Object>>> movementsReport() {
        return ResponseEntity.ok(List.of(
            Map.of("product", "Rolamento 6205", "entries", 20, "exits", 8),
            Map.of("product", "Luva de proteção", "entries", 10, "exits", 6)
        ));
    }

    @GetMapping("/critical-stock")
    public ResponseEntity<List<Map<String, Object>>> criticalStockReport() {
        return ResponseEntity.ok(List.of(
            Map.of("product", "Luva de proteção", "currentQuantity", 8, "minimumQuantity", 10)
        ));
    }
}
