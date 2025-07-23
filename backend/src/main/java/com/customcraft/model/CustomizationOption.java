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
@Table("customization_options")
public class CustomizationOption {
    
    @Id
    private Long id;
    
    @NotNull(message = "Le produit est obligatoire")
    @Column("product_id")
    private Long productId;
    
    @NotBlank(message = "Le nom de l'option est obligatoire")
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    private String name;
    
    @NotBlank(message = "Le type d'option est obligatoire")
    private String type; // COLOR, PATTERN, TEXT, SIZE, MATERIAL
    
    @Size(max = 500, message = "La description ne peut pas dépasser 500 caractères")
    private String description;
    
    @NotBlank(message = "La valeur est obligatoire")
    private String value;
    
    @Column("display_value")
    private String displayValue;
    
    @Column("hex_color")
    private String hexColor;
    
    @Column("image_url")
    private String imageUrl;
    
    @Column("additional_price")
    @DecimalMin(value = "0.0", message = "Le prix additionnel ne peut pas être négatif")
    @Builder.Default
    private BigDecimal additionalPrice = BigDecimal.ZERO;
    
    @Builder.Default
    private Boolean active = true;
    
    @Builder.Default
    private Boolean premium = false;
    
    @Column("sort_order")
    @Builder.Default
    private Integer sortOrder = 0;
    
    @Column("max_length")
    private Integer maxLength; // For text customizations
    
    @Column("min_length")
    private Integer minLength; // For text customizations
    
    @CreatedDate
    @Column("created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column("updated_at")
    private LocalDateTime updatedAt;
}