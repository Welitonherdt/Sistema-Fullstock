package com.fullstock.location.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LocationRequest(
    @NotBlank(message = "Código é obrigatório")
    @Size(max = 60, message = "Código deve ter no máximo 60 caracteres")
    String code,

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 160, message = "Nome deve ter no máximo 160 caracteres")
    String name,

    String description,
    Boolean active
) {
}

