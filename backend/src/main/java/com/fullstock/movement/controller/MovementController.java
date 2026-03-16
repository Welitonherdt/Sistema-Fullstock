package com.fullstock.movement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movements")
@CrossOrigin(origins = "*")
public class MovementController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> list() {
        return ResponseEntity.ok(List.of(
            Map.of("id", 1, "type", "ENTRY", "product", "Rolamento 6205", "quantity", 20, "movementDate", "2026-03-15T08:00:00"),
            Map.of("id", 2, "type", "EXIT", "product", "Luva de proteção", "quantity", 4, "movementDate", "2026-03-15T10:15:00")
        ));
    }

    @PostMapping("/entry")
    public ResponseEntity<Map<String, Object>> entry(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of(
            "message", "Entrada recebida com sucesso (estrutura base)",
            "payload", payload
        ));
    }

    @PostMapping("/exit")
    public ResponseEntity<Map<String, Object>> exit(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of(
            "message", "Saída recebida com sucesso (estrutura base)",
            "payload", payload
        ));
    }
}
