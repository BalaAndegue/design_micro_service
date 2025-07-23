package com.customcraft.dto;

import lombok.Data;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {
    
    @NotEmpty(message = "Les articles de commande sont obligatoires")
    private List<OrderItemRequest> items;
    
    @NotNull(message = "Le montant total est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "Le montant total doit être positif")
    private BigDecimal totalAmount;
    
    private BigDecimal subtotalAmount;
    private BigDecimal shippingAmount;
    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    
    @NotBlank(message = "La méthode de paiement est obligatoire")
    private String paymentMethod;
    
    // Shipping Information
    @NotBlank(message = "Le nom de livraison est obligatoire")
    private String shippingName;
    
    @NotBlank(message = "L'email de livraison est obligatoire")
    private String shippingEmail;
    
    private String shippingPhone;
    
    @NotBlank(message = "L'adresse de livraison est obligatoire")
    private String shippingAddress;
    
    @NotBlank(message = "La ville de livraison est obligatoire")
    private String shippingCity;
    
    @NotBlank(message = "Le code postal de livraison est obligatoire")
    private String shippingPostalCode;
    
    @NotBlank(message = "Le pays de livraison est obligatoire")
    private String shippingCountry;
    
    @NotBlank(message = "La méthode de livraison est obligatoire")
    private String shippingMethod;
    
    private String notes;
    
    @Data
    public static class OrderItemRequest {
        @NotNull(message = "L'ID du produit est obligatoire")
        private Long productId;
        
        @NotNull(message = "La quantité est obligatoire")
        private Integer quantity;
        
        @NotNull(message = "Le prix unitaire est obligatoire")
        private BigDecimal unitPrice;
        
        private String customizations; // JSON string
    }
}