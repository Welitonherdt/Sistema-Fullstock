package com.fullstock.product.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductRequest(
    @NotBlank(message = "Código é obrigatório")
    @Size(max = 50, message = "Código deve ter no máximo 50 caracteres")
    String code,

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 180, message = "Nome deve ter no máximo 180 caracteres")
    String name,

    String description,
    String category,

    @NotNull(message = "Localização é obrigatória")
    Long locationId,

    @NotBlank(message = "Unidade de medida é obrigatória")
    @Size(max = 30, message = "Unidade de medida deve ter no máximo 30 caracteres")
    String unitMeasure,

    @NotNull(message = "Quantidade atual é obrigatória")
    @DecimalMin(value = "0", message = "Quantidade atual não pode ser negativa")
    @Digits(integer = 15, fraction = 0, message = "Quantidade atual deve ser inteira")
    BigDecimal currentQuantity,

    @NotNull(message = "Quantidade mínima é obrigatória")
    @DecimalMin(value = "0", message = "Quantidade mínima não pode ser negativa")
    @Digits(integer = 15, fraction = 0, message = "Quantidade mínima deve ser inteira")
    BigDecimal minimumQuantity,

    Boolean active
) {
}
