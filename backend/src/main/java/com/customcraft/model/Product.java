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
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("products")
public class Product {
    
    @Id
    private Long id;
    
    @NotBlank(message = "Le nom du produit est obligatoire")
    @Size(min = 2, max = 200, message = "Le nom doit contenir entre 2 et 200 caractères")
    private String name;
    
    @Size(max = 1000, message = "La description ne peut pas dépasser 1000 caractères")
    private String description;
    
    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "Le prix doit être positif")
    @Column("base_price")
    private BigDecimal basePrice;
    
    @NotNull(message = "La catégorie est obligatoire")
    @Column("category_id")
    private Long categoryId;
    
    @Column("image_url")
    private String imageUrl;
    
    @Column("model_3d_url")
    private String model3dUrl;
    
    @Builder.Default
    private Boolean active = true;
    
    @Builder.Default
    private Boolean customizable = true;
    
    @Column("stock_quantity")
    @Builder.Default
    private Integer stockQuantity = 0;
    
    @Column("min_order_quantity")
    @Builder.Default
    private Integer minOrderQuantity = 1;
    
    @Column("max_order_quantity")
    @Builder.Default
    private Integer maxOrderQuantity = 100;
    
    private String sku;
    private String tags;
    
    @Column("average_rating")
    @Builder.Default
    private Double averageRating = 0.0;
    
    @Column("review_count")
    @Builder.Default
    private Integer reviewCount = 0;
    
    @CreatedDate
    @Column("created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column("updated_at")
    private LocalDateTime updatedAt;
}