package com.fullstock.movement.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MovementRequest(
    @NotNull(message = "Produto é obrigatório")
    Long productId,

    @NotNull(message = "Quantidade e obrigatoria")
    @DecimalMin(value = "1", message = "Quantidade deve ser maior que zero")
    BigDecimal quantity,

    @Size(max = 180, message = "Fornecedor deve ter no máximo 180 caracteres")
    String supplier,

    @Size(max = 180, message = "Destino deve ter no máximo 180 caracteres")
    String destination,

    @Size(max = 180, message = "Nome de quem pegou deve ter no máximo 180 caracteres")
    String borrowerName,

    String notes,
    LocalDateTime movementDate
) {
}
