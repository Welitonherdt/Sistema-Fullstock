package com.fullstock.inventory.controller;

import com.fullstock.inventory.dto.InventoryItemResponse;
import com.fullstock.inventory.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryItemResponse>> inventory(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Boolean criticalOnly,
        @RequestParam(required = false) Boolean includeInactive
    ) {
        return ResponseEntity.ok(inventoryService.list(search, criticalOnly, includeInactive));
    }

    @GetMapping("/critical")
    public ResponseEntity<List<InventoryItemResponse>> critical() {
        return ResponseEntity.ok(inventoryService.critical());
    }
}
