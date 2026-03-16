package com.fullstock.auth.controller;

import com.fullstock.auth.dto.LoginRequest;
import com.fullstock.auth.dto.LoginResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        // TODO: substituir por autenticação real com JWT
        LoginResponse response = new LoginResponse(
            "mock-jwt-token",
            "Administrador",
            "ADMIN"
        );
        return ResponseEntity.ok(response);
    }
}
