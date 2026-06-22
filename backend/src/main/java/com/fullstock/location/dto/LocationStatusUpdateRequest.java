package com.fullstock.location.dto;

import jakarta.validation.constraints.NotNull;

public record LocationStatusUpdateRequest(
    @NotNull(message = "Status ativo é obrigatório")
    Boolean active
) {
}

