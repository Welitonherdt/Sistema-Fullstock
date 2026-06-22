package com.fullstock.product.dto;

import jakarta.validation.constraints.NotNull;

public record ProductStatusUpdateRequest(
    @NotNull(message = "Status ativo é obrigatório")
    Boolean active
) {
}
