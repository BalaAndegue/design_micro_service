package com.customcraft.repository;

import com.customcraft.model.Order;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface OrderRepository extends R2dbcRepository<Order, Long> {
    
    Flux<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Flux<Order> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, Order.OrderStatus status);
    
    Mono<Order> findByOrderNumber(String orderNumber);
    
    Mono<Order> findByIdAndUserId(Long id, Long userId);
    
    Mono<Order> findByOrderNumberAndUserId(String orderNumber, Long userId);
    
    @Query("SELECT * FROM orders WHERE status = :status ORDER BY created_at ASC")
    Flux<Order> findByStatusOrderByCreatedAtAsc(Order.OrderStatus status);
    
    @Query("SELECT COUNT(*) FROM orders WHERE user_id = :userId")
    Mono<Long> countByUserId(Long userId);
    
    @Query("SELECT COUNT(*) FROM orders WHERE status = :status")
    Mono<Long> countByStatus(Order.OrderStatus status);
    
    @Query("SELECT SUM(total_amount) FROM orders WHERE payment_status = 'PAID'")
    Mono<Double> getTotalRevenue();
}