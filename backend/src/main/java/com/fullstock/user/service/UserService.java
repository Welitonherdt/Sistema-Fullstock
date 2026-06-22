package com.fullstock.user.service;

import com.fullstock.common.exception.BusinessException;
import com.fullstock.common.exception.ResourceNotFoundException;
import com.fullstock.user.dto.UserCreateRequest;
import com.fullstock.user.dto.UserResponse;
import com.fullstock.user.dto.UserStatusUpdateRequest;
import com.fullstock.user.dto.UserUpdateRequest;
import com.fullstock.user.entity.User;
import com.fullstock.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> list() {
        return userRepository.findAll()
            .stream()
            .map(UserResponse::fromEntity)
            .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        User user = findEntity(id);
        return UserResponse.fromEntity(user);
    }

    @Transactional
    public UserResponse create(UserCreateRequest request) {
        String normalizedEmail = normalizeEmail(request.email());
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new BusinessException("Já existe usuário cadastrado com este e-mail");
        }

        User user = User.builder()
            .name(request.name().trim())
            .email(normalizedEmail)
            .passwordHash(passwordEncoder.encode(request.password()))
            .role(request.role())
            .active(request.active() == null || request.active())
            .build();

        return UserResponse.fromEntity(userRepository.save(user));
    }

    @Transactional
    public UserResponse update(Long id, UserUpdateRequest request) {
        User user = findEntity(id);
        String normalizedEmail = normalizeEmail(request.email());

        if (userRepository.existsByEmailIgnoreCaseAndIdNot(normalizedEmail, id)) {
            throw new BusinessException("Já existe outro usuário com este e-mail");
        }

        user.setName(request.name().trim());
        user.setEmail(normalizedEmail);
        user.setRole(request.role());
        user.setActive(request.active());

        if (request.password() != null && !request.password().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
        }

        return UserResponse.fromEntity(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateStatus(Long id, UserStatusUpdateRequest request) {
        User user = findEntity(id);
        user.setActive(request.active());
        return UserResponse.fromEntity(userRepository.save(user));
    }

    private User findEntity(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
