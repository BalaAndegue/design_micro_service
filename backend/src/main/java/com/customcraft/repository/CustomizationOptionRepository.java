package com.customcraft.repository;

import com.customcraft.model.CustomizationOption;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface CustomizationOptionRepository extends R2dbcRepository<CustomizationOption, Long> {
    
    Flux<CustomizationOption> findByProductIdAndActiveTrueOrderBySortOrderAsc(Long productId);
    
    Flux<CustomizationOption> findByProductIdAndTypeAndActiveTrueOrderBySortOrderAsc(Long productId, String type);
    
    Flux<CustomizationOption> findByActiveTrueOrderBySortOrderAsc();
}