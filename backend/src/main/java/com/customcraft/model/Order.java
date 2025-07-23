package com.customcraft.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("orders")
public class Order {
    
    @Id
    private Long id;
    
    @NotBlank(message = "Le numéro de commande est obligatoire")
    @Column("order_number")
    private String orderNumber;
    
    @NotNull(message = "L'utilisateur est obligatoire")
    @Column("user_id")
    private Long userId;
    
    @NotNull(message = "Le montant total est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "Le montant total doit être positif")
    @Column("total_amount")
    private BigDecimal totalAmount;
    
    @Column("subtotal_amount")
    private BigDecimal subtotalAmount;
    
    @Column("shipping_amount")
    private BigDecimal shippingAmount;
    
    @Column("tax_amount")
    private BigDecimal taxAmount;
    
    @Column("discount_amount")
    private BigDecimal discountAmount;
    
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;
    
    @Builder.Default
    @Column("payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    @Column("payment_method")
    private String paymentMethod;
    
    @Column("payment_transaction_id")
    private String paymentTransactionId;
    
    // Shipping Information
    @Column("shipping_name")
    private String shippingName;
    
    @Column("shipping_email")
    private String shippingEmail;
    
    @Column("shipping_phone")
    private String shippingPhone;
    
    @Column("shipping_address")
    private String shippingAddress;
    
    @Column("shipping_city")
    private String shippingCity;
    
    @Column("shipping_postal_code")
    private String shippingPostalCode;
    
    @Column("shipping_country")
    private String shippingCountry;
    
    @Column("shipping_method")
    private String shippingMethod;
    
    @Column("tracking_number")
    private String trackingNumber;
    
    @Column("estimated_delivery_date")
    private LocalDateTime estimatedDeliveryDate;
    
    @Column("delivered_at")
    private LocalDateTime deliveredAt;
    
    private String notes;
    
    @CreatedDate
    @Column("created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column("updated_at")
    private LocalDateTime updatedAt;
    
    public enum OrderStatus {
        PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
    }
    
    public enum PaymentStatus {
        PENDING, PAID, FAILED, REFUNDED, PARTIALLY_REFUNDED
    }
}