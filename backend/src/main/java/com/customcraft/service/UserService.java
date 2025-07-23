package com.customcraft.service;

import com.customcraft.model.User;
import com.customcraft.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    public Mono<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Mono<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public Mono<Boolean> existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public Mono<User> createUser(String name, String email, String password) {
        return existsByEmail(email)
                .flatMap(exists -> {
                    if (exists) {
                        return Mono.error(new RuntimeException("Un utilisateur avec cet email existe déjà"));
                    }
                    
                    User user = User.builder()
                            .name(name)
                            .email(email)
                            .password(passwordEncoder.encode(password))
                            .enabled(true)
                            .verified(false)
                            .verificationToken(UUID.randomUUID().toString())
                            .build();
                    
                    return userRepository.save(user)
                            .doOnSuccess(savedUser -> {
                                // Send verification email asynchronously
                                emailService.sendVerificationEmail(savedUser.getEmail(), savedUser.getVerificationToken())
                                        .subscribe(
                                                result -> log.info("Verification email sent to {}", savedUser.getEmail()),
                                                error -> log.error("Failed to send verification email to {}", savedUser.getEmail(), error)
                                        );
                            });
                });
    }
    
    public Mono<User> updateUser(Long userId, User userUpdate) {
        return userRepository.findById(userId)
                .flatMap(existingUser -> {
                    existingUser.setName(userUpdate.getName());
                    existingUser.setPhone(userUpdate.getPhone());
                    existingUser.setAddress(userUpdate.getAddress());
                    existingUser.setCity(userUpdate.getCity());
                    existingUser.setPostalCode(userUpdate.getPostalCode());
                    existingUser.setCountry(userUpdate.getCountry());
                    
                    return userRepository.save(existingUser);
                })
                .switchIfEmpty(Mono.error(new RuntimeException("Utilisateur non trouvé")));
    }
    
    public Mono<Void> changePassword(Long userId, String currentPassword, String newPassword) {
        return userRepository.findById(userId)
                .flatMap(user -> {
                    if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                        return Mono.error(new RuntimeException("Mot de passe actuel incorrect"));
                    }
                    
                    user.setPassword(passwordEncoder.encode(newPassword));
                    return userRepository.save(user);
                })
                .switchIfEmpty(Mono.error(new RuntimeException("Utilisateur non trouvé")))
                .then();
    }
    
    public Mono<Void> initiatePasswordReset(String email) {
        return userRepository.findByEmail(email)
                .flatMap(user -> {
                    String resetToken = UUID.randomUUID().toString();
                    user.setResetToken(resetToken);
                    user.setResetTokenExpiry(LocalDateTime.now().plusHours(1)); // 1 hour expiry
                    
                    return userRepository.save(user)
                            .then(emailService.sendPasswordResetEmail(email, resetToken));
                })
                .switchIfEmpty(Mono.error(new RuntimeException("Aucun utilisateur trouvé avec cet email")))
                .then();
    }
    
    public Mono<Void> resetPassword(String token, String newPassword) {
        return userRepository.findByResetToken(token)
                .flatMap(user -> {
                    if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
                        return Mono.error(new RuntimeException("Le token de réinitialisation a expiré"));
                    }
                    
                    user.setPassword(passwordEncoder.encode(newPassword));
                    user.setResetToken(null);
                    user.setResetTokenExpiry(null);
                    
                    return userRepository.save(user);
                })
                .switchIfEmpty(Mono.error(new RuntimeException("Token de réinitialisation invalide")))
                .then();
    }
    
    public Mono<Void> verifyEmail(String token) {
        return userRepository.findByVerificationToken(token)
                .flatMap(user -> {
                    user.setVerified(true);
                    user.setVerificationToken(null);
                    return userRepository.save(user);
                })
                .switchIfEmpty(Mono.error(new RuntimeException("Token de vérification invalide")))
                .then();
    }
}