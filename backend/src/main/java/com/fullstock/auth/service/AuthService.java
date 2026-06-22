package com.fullstock.auth.service;

import com.fullstock.auth.dto.LoginRequest;
import com.fullstock.auth.dto.LoginResponse;
import com.fullstock.common.exception.BusinessException;
import com.fullstock.security.JwtService;
import com.fullstock.user.entity.User;
import com.fullstock.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new BusinessException("Credenciais inválidas"));

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new BusinessException("Usuário está inativo");
        }

        if (!passwordMatches(request.password(), user.getPasswordHash())) {
            throw new BusinessException("Credenciais inválidas");
        }

        // Migração suave para bcrypt caso existam senhas antigas em texto
        if (!user.getPasswordHash().startsWith("$2")) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
            userRepository.save(user);
        }

        String token = jwtService.generateToken(user);
        return new LoginResponse(
            token,
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole().name()
        );
    }

    private boolean passwordMatches(String rawPassword, String storedHash) {
        if (storedHash == null || storedHash.isBlank()) {
            return false;
        }
        if (storedHash.startsWith("$2")) {
            return passwordEncoder.matches(rawPassword, storedHash);
        }
        return rawPassword.equals(storedHash);
    }
}
