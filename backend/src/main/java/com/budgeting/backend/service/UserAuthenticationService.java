package com.budgeting.backend.service;

import com.budgeting.backend.model.entity.UserEntity;
import com.budgeting.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserAuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserAuthenticationService(UserRepository userRepository,
                                     PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String registerUser(UserEntity userEntity) {
        if (userEntity == null || userEntity.getUsername() == null || userEntity.getPassword() == null) {
            throw new IllegalArgumentException("User entity and its username/password must not be null");
        }

        try {
            userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
            userRepository.save(userEntity);
            return userRepository.findByUsername(userEntity.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found after registration"))
                    .getId();
        } catch (Exception e) {
            throw new RuntimeException("Error registering user: " + e.getMessage());
        }
    }

    public UserEntity getUserByUsername(String username) {
        if (username == null || username.isEmpty()) {
            throw new IllegalArgumentException("Username must not be null or empty");
        }

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }
}
