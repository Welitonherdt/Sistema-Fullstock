package com.fullstock.inventory.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> inventory() {
        return ResponseEntity.ok(List.of(
            Map.of("code", "ROL-001", "name", "Rolamento 6205", "currentQuantity", 12, "minimumQuantity", 5, "critical", false),
            Map.of("code", "LUV-003", "name", "Luva de proteção", "currentQuantity", 8, "minimumQuantity", 10, "critical", true)
        ));
    }

    @GetMapping("/critical")
    public ResponseEntity<List<Map<String, Object>>> critical() {
        return ResponseEntity.ok(List.of(
            Map.of("code", "LUV-003", "name", "Luva de proteção", "currentQuantity", 8, "minimumQuantity", 10, "critical", true)
        ));
    }
}
