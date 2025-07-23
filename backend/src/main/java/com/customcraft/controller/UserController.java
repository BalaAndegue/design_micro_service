package com.customcraft.controller;

import com.customcraft.model.User;
import com.customcraft.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/profile")
    public Mono<ResponseEntity<User>> getUserProfile(Authentication authentication) {
        Long userId = (Long) authentication.getDetails();
        
        return userService.findById(userId)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/profile")
    public Mono<ResponseEntity<User>> updateUserProfile(
            @Valid @RequestBody User userUpdate,
            Authentication authentication) {
        Long userId = (Long) authentication.getDetails();
        
        return userService.updateUser(userId, userUpdate)
                .map(ResponseEntity::ok)
                .onErrorReturn(ResponseEntity.badRequest().build());
    }
    
    @PostMapping("/change-password")
    public Mono<ResponseEntity<String>> changePassword(
            @RequestParam String currentPassword,
            @RequestParam String newPassword,
            Authentication authentication) {
        Long userId = (Long) authentication.getDetails();
        
        return userService.changePassword(userId, currentPassword, newPassword)
                .then(Mono.just(ResponseEntity.ok("Mot de passe modifié avec succès")))
                .onErrorReturn(ResponseEntity.badRequest().body("Erreur lors de la modification du mot de passe"));
    }
}