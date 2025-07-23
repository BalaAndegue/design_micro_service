package com.customcraft.repository;

import com.customcraft.model.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface ProductRepository extends R2dbcRepository<Product, Long> {
    
    Flux<Product> findByActiveTrue();
    
    Flux<Product> findByActiveTrueAndCategoryId(Long categoryId);
    
    @Query("SELECT * FROM products WHERE active = true AND (name ILIKE :search OR description ILIKE :search)")
    Flux<Product> findByActiveTrueAndNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String search);
    
    @Query("SELECT * FROM products WHERE active = true AND category_id = :categoryId AND (name ILIKE :search OR description ILIKE :search)")
    Flux<Product> findByActiveTrueAndCategoryIdAndNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            Long categoryId, String search);
    
    @Query("SELECT * FROM products WHERE active = true ORDER BY average_rating DESC, review_count DESC")
    Flux<Product> findByActiveTrueOrderByAverageRatingDescReviewCountDesc();
    
    @Query("SELECT * FROM products WHERE active = true ORDER BY base_price ASC")
    Flux<Product> findByActiveTrueOrderByBasePriceAsc();
    
    @Query("SELECT * FROM products WHERE active = true ORDER BY base_price DESC")
    Flux<Product> findByActiveTrueOrderByBasePriceDesc();
    
    @Query("SELECT * FROM products WHERE active = true ORDER BY created_at DESC")
    Flux<Product> findByActiveTrueOrderByCreatedAtDesc();
    
    Mono<Long> countByActiveTrueAndCategoryId(Long categoryId);
    
    Mono<Long> countByActiveTrue();
}