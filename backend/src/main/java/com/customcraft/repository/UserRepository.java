package com.customcraft.repository;

import com.customcraft.model.User;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface UserRepository extends R2dbcRepository<User, Long> {
    
    Mono<User> findByEmail(String email);
    
    Mono<Boolean> existsByEmail(String email);
    
    Mono<User> findByVerificationToken(String token);
    
    Mono<User> findByResetToken(String token);
    
    @Query("SELECT u.* FROM users u JOIN user_roles ur ON u.id = ur.user_id WHERE u.id = :userId")
    Mono<User> findByIdWithRoles(Long userId);
}