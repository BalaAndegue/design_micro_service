package com.customcraft.repository;

import com.customcraft.model.OrderItem;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface OrderItemRepository extends R2dbcRepository<OrderItem, Long> {
    
    Flux<OrderItem> findByOrderId(Long orderId);
    
    Flux<OrderItem> findByProductId(Long productId);
}