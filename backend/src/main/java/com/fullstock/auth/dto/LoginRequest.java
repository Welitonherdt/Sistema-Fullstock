package com.fullstock.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @Email(message = "Informe um e-mail válido")
    @NotBlank(message = "E-mail é obrigatório")
    String email,

    @NotBlank(message = "Senha é obrigatória")
    String password
) {
}
