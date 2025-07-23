package com.customcraft.service;

import com.customcraft.dto.OrderRequest;
import com.customcraft.dto.OrderResponse;
import com.customcraft.model.Order;
import com.customcraft.model.OrderItem;
import com.customcraft.model.Product;
import com.customcraft.repository.OrderItemRepository;
import com.customcraft.repository.OrderRepository;
import com.customcraft.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;
    private final PaymentService paymentService;
    
    @Transactional
    public Mono<OrderResponse> createOrder(Long userId, OrderRequest orderRequest) {
        String orderNumber = generateOrderNumber();
        
        Order order = Order.builder()
                .orderNumber(orderNumber)
                .userId(userId)
                .totalAmount(orderRequest.getTotalAmount())
                .subtotalAmount(orderRequest.getSubtotalAmount())
                .shippingAmount(orderRequest.getShippingAmount())
                .taxAmount(orderRequest.getTaxAmount())
                .discountAmount(orderRequest.getDiscountAmount())
                .status(Order.OrderStatus.PENDING)
                .paymentStatus(Order.PaymentStatus.PENDING)
                .paymentMethod(orderRequest.getPaymentMethod())
                .shippingName(orderRequest.getShippingName())
                .shippingEmail(orderRequest.getShippingEmail())
                .shippingPhone(orderRequest.getShippingPhone())
                .shippingAddress(orderRequest.getShippingAddress())
                .shippingCity(orderRequest.getShippingCity())
                .shippingPostalCode(orderRequest.getShippingPostalCode())
                .shippingCountry(orderRequest.getShippingCountry())
                .shippingMethod(orderRequest.getShippingMethod())
                .estimatedDeliveryDate(calculateEstimatedDeliveryDate(orderRequest.getShippingMethod()))
                .notes(orderRequest.getNotes())
                .build();
        
        return orderRepository.save(order)
                .flatMap(savedOrder -> {
                    // Create order items
                    Flux<OrderItem> orderItems = Flux.fromIterable(orderRequest.getItems())
                            .flatMap(itemRequest -> 
                                productRepository.findById(itemRequest.getProductId())
                                    .map(product -> OrderItem.builder()
                                            .orderId(savedOrder.getId())
                                            .productId(itemRequest.getProductId())
                                            .quantity(itemRequest.getQuantity())
                                            .unitPrice(itemRequest.getUnitPrice())
                                            .totalPrice(itemRequest.getUnitPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())))
                                            .productName(product.getName())
                                            .productSku(product.getSku())
                                            .productImageUrl(product.getImageUrl())
                                            .customizations(itemRequest.getCustomizations())
                                            .build())
                            )
                            .flatMap(orderItemRepository::save);
                    
                    return orderItems.collectList()
                            .map(items -> OrderResponse.builder()
                                    .order(savedOrder)
                                    .items(items)
                                    .build());
                })
                .doOnSuccess(orderResponse -> {
                    // Send order confirmation email asynchronously
                    emailService.sendOrderConfirmationEmail(
                            orderResponse.getOrder().getShippingEmail(),
                            orderResponse.getOrder(),
                            orderResponse.getItems()
                    ).subscribe(
                            result -> log.info("Order confirmation email sent for order {}", orderNumber),
                            error -> log.error("Failed to send order confirmation email for order {}", orderNumber, error)
                    );
                });
    }
    
    public Mono<OrderResponse> processPayment(Long orderId, String paymentToken) {
        return orderRepository.findById(orderId)
                .switchIfEmpty(Mono.error(new RuntimeException("Commande non trouvée")))
                .flatMap(order -> {
                    if (order.getPaymentStatus() != Order.PaymentStatus.PENDING) {
                        return Mono.error(new RuntimeException("Cette commande a déjà été traitée"));
                    }
                    
                    return paymentService.processPayment(order, paymentToken)
                            .flatMap(paymentResult -> {
                                if (paymentResult.isSuccess()) {
                                    order.setPaymentStatus(Order.PaymentStatus.PAID);
                                    order.setStatus(Order.OrderStatus.CONFIRMED);
                                    order.setPaymentTransactionId(paymentResult.getTransactionId());
                                } else {
                                    order.setPaymentStatus(Order.PaymentStatus.FAILED);
                                    return Mono.error(new RuntimeException("Échec du paiement: " + paymentResult.getErrorMessage()));
                                }
                                
                                return orderRepository.save(order);
                            })
                            .flatMap(savedOrder -> 
                                orderItemRepository.findByOrderId(savedOrder.getId())
                                        .collectList()
                                        .map(items -> OrderResponse.builder()
                                                .order(savedOrder)
                                                .items(items)
                                                .build())
                            );
                });
    }
    
    public Flux<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public Flux<Order> getUserOrdersByStatus(Long userId, Order.OrderStatus status) {
        return orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status);
    }
    
    public Mono<OrderResponse> getOrderById(Long orderId, Long userId) {
        return orderRepository.findByIdAndUserId(orderId, userId)
                .switchIfEmpty(Mono.error(new RuntimeException("Commande non trouvée")))
                .flatMap(order -> 
                    orderItemRepository.findByOrderId(order.getId())
                            .collectList()
                            .map(items -> OrderResponse.builder()
                                    .order(order)
                                    .items(items)
                                    .build())
                );
    }
    
    public Mono<OrderResponse> getOrderByNumber(String orderNumber, Long userId) {
        return orderRepository.findByOrderNumberAndUserId(orderNumber, userId)
                .switchIfEmpty(Mono.error(new RuntimeException("Commande non trouvée")))
                .flatMap(order -> 
                    orderItemRepository.findByOrderId(order.getId())
                            .collectList()
                            .map(items -> OrderResponse.builder()
                                    .order(order)
                                    .items(items)
                                    .build())
                );
    }
    
    public Mono<Order> updateOrderStatus(Long orderId, Order.OrderStatus status) {
        return orderRepository.findById(orderId)
                .switchIfEmpty(Mono.error(new RuntimeException("Commande non trouvée")))
                .flatMap(order -> {
                    order.setStatus(status);
                    
                    if (status == Order.OrderStatus.SHIPPED) {
                        order.setTrackingNumber(generateTrackingNumber());
                    } else if (status == Order.OrderStatus.DELIVERED) {
                        order.setDeliveredAt(LocalDateTime.now());
                    }
                    
                    return orderRepository.save(order);
                })
                .doOnSuccess(order -> {
                    // Send status update email asynchronously
                    emailService.sendOrderStatusUpdateEmail(
                            order.getShippingEmail(),
                            order
                    ).subscribe(
                            result -> log.info("Order status update email sent for order {}", order.getOrderNumber()),
                            error -> log.error("Failed to send order status update email for order {}", order.getOrderNumber(), error)
                    );
                });
    }
    
    public Mono<Order> cancelOrder(Long orderId, Long userId) {
        return orderRepository.findByIdAndUserId(orderId, userId)
                .switchIfEmpty(Mono.error(new RuntimeException("Commande non trouvée")))
                .flatMap(order -> {
                    if (order.getStatus() == Order.OrderStatus.SHIPPED || 
                        order.getStatus() == Order.OrderStatus.DELIVERED) {
                        return Mono.error(new RuntimeException("Impossible d'annuler une commande expédiée ou livrée"));
                    }
                    
                    order.setStatus(Order.OrderStatus.CANCELLED);
                    
                    // If payment was made, initiate refund
                    if (order.getPaymentStatus() == Order.PaymentStatus.PAID) {
                        return paymentService.refundPayment(order.getPaymentTransactionId(), order.getTotalAmount())
                                .flatMap(refundResult -> {
                                    if (refundResult.isSuccess()) {
                                        order.setPaymentStatus(Order.PaymentStatus.REFUNDED);
                                    }
                                    return orderRepository.save(order);
                                });
                    }
                    
                    return orderRepository.save(order);
                });
    }
    
    private String generateOrderNumber() {
        return "CMD-" + System.currentTimeMillis();
    }
    
    private String generateTrackingNumber() {
        return "TRK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private LocalDateTime calculateEstimatedDeliveryDate(String shippingMethod) {
        LocalDateTime now = LocalDateTime.now();
        
        return switch (shippingMethod.toLowerCase()) {
            case "express" -> now.plusDays(2);
            case "premium" -> now.plusDays(1);
            default -> now.plusDays(5); // standard
        };
    }
}