package com.fullstock.config;

import com.fullstock.user.entity.User;
import com.fullstock.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@Order(1)
public class PasswordHashMigrationRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PasswordHashMigrationRunner(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        List<User> users = userRepository.findAll();
        boolean changed = false;
        for (User user : users) {
            String currentPassword = user.getPasswordHash();
            if (currentPassword != null && !currentPassword.startsWith("$2")) {
                user.setPasswordHash(passwordEncoder.encode(currentPassword));
                changed = true;
            }
        }
        if (changed) {
            userRepository.saveAll(users);
        }
    }
}
