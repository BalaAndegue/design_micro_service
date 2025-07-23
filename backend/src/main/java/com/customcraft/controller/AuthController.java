package com.customcraft.controller;

import com.customcraft.dto.AuthRequest;
import com.customcraft.dto.AuthResponse;
import com.customcraft.dto.RegisterRequest;
import com.customcraft.security.JwtUtil;
import com.customcraft.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    @PostMapping("/register")
    public Mono<ResponseEntity<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return userService.createUser(request.getName(), request.getEmail(), request.getPassword())
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getEmail(), user.getId());
                    AuthResponse response = AuthResponse.builder()
                            .token(token)
                            .user(user)
                            .build();
                    return ResponseEntity.status(HttpStatus.CREATED).body(response);
                })
                .onErrorReturn(ResponseEntity.badRequest().build());
    }
    
    @PostMapping("/login")
    public Mono<ResponseEntity<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        return userService.findByEmail(request.getEmail())
                .filter(user -> passwordEncoder.matches(request.getPassword(), user.getPassword()))
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getEmail(), user.getId());
                    AuthResponse response = AuthResponse.builder()
                            .token(token)
                            .user(user)
                            .build();
                    return ResponseEntity.ok(response);
                })
                .switchIfEmpty(Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()));
    }
    
    @PostMapping("/forgot-password")
    public Mono<ResponseEntity<String>> forgotPassword(@RequestParam String email) {
        return userService.initiatePasswordReset(email)
                .then(Mono.just(ResponseEntity.ok("Email de réinitialisation envoyé")))
                .onErrorReturn(ResponseEntity.badRequest().body("Erreur lors de l'envoi de l'email"));
    }
    
    @PostMapping("/reset-password")
    public Mono<ResponseEntity<String>> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        return userService.resetPassword(token, newPassword)
                .then(Mono.just(ResponseEntity.ok("Mot de passe réinitialisé avec succès")))
                .onErrorReturn(ResponseEntity.badRequest().body("Token invalide ou expiré"));
    }
    
    @PostMapping("/verify-email")
    public Mono<ResponseEntity<String>> verifyEmail(@RequestParam String token) {
        return userService.verifyEmail(token)
                .then(Mono.just(ResponseEntity.ok("Email vérifié avec succès")))
                .onErrorReturn(ResponseEntity.badRequest().body("Token de vérification invalide"));
    }
}