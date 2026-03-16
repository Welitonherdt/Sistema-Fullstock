package com.fullstock.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> list() {
        return ResponseEntity.ok(List.of(
            Map.of("id", 1, "name", "Administrador", "email", "admin@fullstock.local", "role", "ADMIN", "active", true),
            Map.of("id", 2, "name", "Almoxarife", "email", "almox@fullstock.local", "role", "ALMOXARIFE", "active", true)
        ));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of(
            "message", "Usuário recebido com sucesso (estrutura base)",
            "payload", payload
        ));
    }
}
