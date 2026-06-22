package com.fullstock.user.dto;

import com.fullstock.common.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 150, message = "Nome deve ter no máximo 150 caracteres")
    String name,

    @Email(message = "Informe um e-mail válido")
    @NotBlank(message = "E-mail é obrigatório")
    @Size(max = 180, message = "E-mail deve ter no máximo 180 caracteres")
    String email,

    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    String password,

    @NotNull(message = "Perfil é obrigatório")
    Role role,

    @NotNull(message = "Status ativo é obrigatório")
    Boolean active
) {
}
