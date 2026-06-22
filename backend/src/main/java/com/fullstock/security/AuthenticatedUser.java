package com.fullstock.security;

import com.fullstock.common.enums.Role;

public record AuthenticatedUser(
    Long id,
    String email,
    String name,
    Role role
) {
}
