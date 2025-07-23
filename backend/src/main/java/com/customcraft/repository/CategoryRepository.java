package com.customcraft.repository;

import com.customcraft.model.Category;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface CategoryRepository extends R2dbcRepository<Category, Long> {
    
    Flux<Category> findByActiveTrueOrderBySortOrderAsc();
    
    Flux<Category> findByActiveTrueAndParentIdIsNullOrderBySortOrderAsc();
    
    Flux<Category> findByActiveTrueAndParentIdOrderBySortOrderAsc(Long parentId);
    
    Mono<Category> findBySlug(String slug);
    
    Mono<Boolean> existsBySlug(String slug);
}