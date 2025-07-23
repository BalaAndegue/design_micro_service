package com.customcraft.controller;

import com.customcraft.dto.ProductResponse;
import com.customcraft.model.CustomizationOption;
import com.customcraft.model.Product;
import com.customcraft.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    
    @GetMapping
    public Flux<Product> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String sortBy) {
        return productService.searchProducts(search, categoryId, sortBy);
    }
    
    @GetMapping("/{id}")
    public Mono<ResponseEntity<ProductResponse>> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/featured")
    public Flux<Product> getFeaturedProducts() {
        return productService.getFeaturedProducts();
    }
    
    @GetMapping("/popular")
    public Flux<Product> getPopularProducts() {
        return productService.getPopularProducts();
    }
    
    @GetMapping("/newest")
    public Flux<Product> getNewestProducts() {
        return productService.getNewestProducts();
    }
    
    @GetMapping("/category/{categoryId}")
    public Flux<Product> getProductsByCategory(@PathVariable Long categoryId) {
        return productService.getProductsByCategory(categoryId);
    }
    
    @GetMapping("/{id}/customization-options")
    public Flux<CustomizationOption> getCustomizationOptions(@PathVariable Long id) {
        return productService.getCustomizationOptions(id);
    }
    
    @GetMapping("/{id}/customization-options/{type}")
    public Flux<CustomizationOption> getCustomizationOptionsByType(
            @PathVariable Long id, 
            @PathVariable String type) {
        return productService.getCustomizationOptionsByType(id, type);
    }
}