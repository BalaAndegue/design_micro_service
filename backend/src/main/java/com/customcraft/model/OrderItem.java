package com.customcraft.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("order_items")
public class OrderItem {
    
    @Id
    private Long id;
    
    @NotNull(message = "La commande est obligatoire")
    @Column("order_id")
    private Long orderId;
    
    @NotNull(message = "Le produit est obligatoire")
    @Column("product_id")
    private Long productId;
    
    @NotNull(message = "La quantité est obligatoire")
    @Min(value = 1, message = "La quantité doit être au moins 1")
    private Integer quantity;
    
    @NotNull(message = "Le prix unitaire est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "Le prix unitaire doit être positif")
    @Column("unit_price")
    private BigDecimal unitPrice;
    
    @NotNull(message = "Le prix total est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "Le prix total doit être positif")
    @Column("total_price")
    private BigDecimal totalPrice;
    
    @Column("product_name")
    private String productName;
    
    @Column("product_sku")
    private String productSku;
    
    @Column("product_image_url")
    private String productImageUrl;
    
    // Customization details stored as JSON
    @Column("customizations")
    private String customizations;
    
    // Preview image URL for customized product
    @Column("preview_image_url")
    private String previewImageUrl;
}