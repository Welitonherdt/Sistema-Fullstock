package com.fullstock.config;

import com.fullstock.user.entity.User;
import com.fullstock.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@Order(2)
public class ProductionCredentialInitializer implements CommandLineRunner {

    private static final String DEFAULT_PASSWORD = "123456";
    private static final List<String> DEMO_EMAILS = List.of(
        "almox@fullstock.local",
        "usuario@fullstock.local"
    );

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String productionAdminPassword;

    public ProductionCredentialInitializer(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        @Value("${FULLSTOCK_ADMIN_PASSWORD:}") String productionAdminPassword
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.productionAdminPassword = productionAdminPassword;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (productionAdminPassword == null || productionAdminPassword.isBlank()) {
            return;
        }

        User admin = userRepository.findByEmailIgnoreCase("admin@fullstock.local")
            .orElseThrow(() -> new IllegalStateException("Usuário administrador inicial não encontrado"));

        if (usesDefaultPassword(admin)) {
            admin.setPasswordHash(passwordEncoder.encode(productionAdminPassword));
            userRepository.save(admin);
        }

        DEMO_EMAILS.forEach(email -> userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
            if (usesDefaultPassword(user)) {
                user.setActive(false);
                userRepository.save(user);
            }
        }));
    }

    private boolean usesDefaultPassword(User user) {
        String passwordHash = user.getPasswordHash();
        if (passwordHash == null || passwordHash.isBlank()) {
            return false;
        }
        return passwordHash.startsWith("$2")
            ? passwordEncoder.matches(DEFAULT_PASSWORD, passwordHash)
            : DEFAULT_PASSWORD.equals(passwordHash);
    }
}

