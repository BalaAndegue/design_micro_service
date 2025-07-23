package com.customcraft.service;

import com.customcraft.model.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    
    @Value("${payment.stripe.secret-key}")
    private String stripeSecretKey;
    
    public Mono<PaymentResult> processPayment(Order order, String paymentToken) {
        // Simulate payment processing
        // In a real implementation, you would integrate with Stripe, PayPal, etc.
        return Mono.fromCallable(() -> {
            try {
                // Simulate processing time
                Thread.sleep(2000);
                
                // Simulate payment success/failure (90% success rate)
                boolean success = Math.random() > 0.1;
                
                if (success) {
                    return PaymentResult.builder()
                            .success(true)
                            .transactionId(UUID.randomUUID().toString())
                            .amount(order.getTotalAmount())
                            .build();
                } else {
                    return PaymentResult.builder()
                            .success(false)
                            .errorMessage("Paiement refusé par la banque")
                            .build();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return PaymentResult.builder()
                        .success(false)
                        .errorMessage("Erreur lors du traitement du paiement")
                        .build();
            }
        });
    }
    
    public Mono<RefundResult> refundPayment(String transactionId, BigDecimal amount) {
        // Simulate refund processing
        return Mono.fromCallable(() -> {
            try {
                // Simulate processing time
                Thread.sleep(1000);
                
                // Simulate refund success (95% success rate)
                boolean success = Math.random() > 0.05;
                
                if (success) {
                    return RefundResult.builder()
                            .success(true)
                            .refundId(UUID.randomUUID().toString())
                            .amount(amount)
                            .build();
                } else {
                    return RefundResult.builder()
                            .success(false)
                            .errorMessage("Échec du remboursement")
                            .build();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return RefundResult.builder()
                        .success(false)
                        .errorMessage("Erreur lors du traitement du remboursement")
                        .build();
            }
        });
    }
    
    @lombok.Data
    @lombok.Builder
    public static class PaymentResult {
        private boolean success;
        private String transactionId;
        private BigDecimal amount;
        private String errorMessage;
    }
    
    @lombok.Data
    @lombok.Builder
    public static class RefundResult {
        private boolean success;
        private String refundId;
        private BigDecimal amount;
        private String errorMessage;
    }
}