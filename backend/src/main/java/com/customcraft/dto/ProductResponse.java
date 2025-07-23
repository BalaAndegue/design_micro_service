package com.customcraft.dto;

import com.customcraft.model.CustomizationOption;
import com.customcraft.model.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Product product;
    private String categoryName;
    private List<CustomizationOption> customizationOptions;
}