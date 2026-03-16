package com.fullstock.product.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> list() {
        return ResponseEntity.ok(List.of(
            Map.of("id", 1, "code", "ROL-001", "name", "Rolamento 6205", "category", "Mecânica", "currentQuantity", 12, "minimumQuantity", 5),
            Map.of("id", 2, "code", "PAR-002", "name", "Parafuso 10mm", "category", "Fixação", "currentQuantity", 120, "minimumQuantity", 50),
            Map.of("id", 3, "code", "LUV-003", "name", "Luva de proteção", "category", "EPI", "currentQuantity", 8, "minimumQuantity", 10)
        ));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of(
            "message", "Produto recebido com sucesso (estrutura base)",
            "payload", payload
        ));
    }
}
