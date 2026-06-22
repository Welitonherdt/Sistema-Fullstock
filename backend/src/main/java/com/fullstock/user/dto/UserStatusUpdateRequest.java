package com.fullstock.user.dto;

import jakarta.validation.constraints.NotNull;

public record UserStatusUpdateRequest(
    @NotNull(message = "Status ativo é obrigatório")
    Boolean active
) {
}
