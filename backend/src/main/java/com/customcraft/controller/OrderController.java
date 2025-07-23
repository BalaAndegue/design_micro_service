package com.customcraft.controller;

import com.customcraft.dto.OrderRequest;
import com.customcraft.dto.OrderResponse;
import com.customcraft.model.Order;
import com.customcraft.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping
    public Mono<ResponseEntity<OrderResponse>> createOrder(
            @Valid @RequestBody OrderRequest orderRequest,
            Authentication authentication) {
        Long userId = (Long) authentication.getDetails();
        
        return orderService.createOrder(userId, orderRequest)
                .map(orderResponse -> ResponseEntity.status(HttpStatus.CREATED).body(orderResponse))
                .onErrorReturn(ResponseEntity.badRequest().build());
    }
    
    @PostMapping("/{orderId}/payment")
    public Mono<ResponseEntity<OrderResponse>> processPayment(
            @PathVariable Long orderId,
            @RequestParam String paymentToken,
            Authentication authentication) {
        
        return orderService.processPayment(orderId, paymentToken)
                .map(ResponseEntity::ok)
                .onErrorReturn(ResponseEntity.badRequest().build());
    }
    
    @GetMapping
    public Flux<Order> getUserOrders(Authentication authentication) {
        Long userId = (Long) authentication.getDetails();
        return orderService.getUserOrders(userId);
    }
    
    @GetMapping("/status/{status}")
    public Flux<Order> getUserOrdersByStatus(
            @PathVariable String status,
            Authentication authentication) {
        Long userId = (Long) authentication.getDetails();
        Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
        return orderService.getUserOrdersByStatus(userId, orderStatus);
    }
    
    @GetMapping("/{orderId}")
    public Mono<ResponseEntity<OrderResponse>> getOrderById(
            @PathVariable Long orderId,
            Authentication authentication) {
        Long userId = (Long) authentication.getDetails();
        
        return orderService.getOrderById(orderId, userId)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/number/{orderNumber}")
    public Mono<ResponseEntity<OrderResponse>> getOrderByNumber(
            @PathVariable String orderNumber,
            Authentication authentication) {
        Long userId = (Long) authentication.getDetails();
        
        return orderService.getOrderByNumber(orderNumber, userId)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{orderId}/cancel")
    public Mono<ResponseEntity<Order>> cancelOrder(
            @PathVariable Long orderId,
            Authentication authentication) {
        Long userId = (Long) authentication.getDetails();
        
        return orderService.cancelOrder(orderId, userId)
                .map(ResponseEntity::ok)
                .onErrorReturn(ResponseEntity.badRequest().build());
    }
}