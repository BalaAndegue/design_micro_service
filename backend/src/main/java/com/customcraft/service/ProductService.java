package com.customcraft.service;

import com.customcraft.dto.ProductResponse;
import com.customcraft.model.CustomizationOption;
import com.customcraft.model.Product;
import com.customcraft.repository.CategoryRepository;
import com.customcraft.repository.CustomizationOptionRepository;
import com.customcraft.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CustomizationOptionRepository customizationOptionRepository;
    
    public Flux<Product> getAllActiveProducts() {
        return productRepository.findByActiveTrue();
    }
    
    public Flux<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByActiveTrueAndCategoryId(categoryId);
    }
    
    public Mono<ProductResponse> getProductById(Long id) {
        return productRepository.findById(id)
                .switchIfEmpty(Mono.error(new RuntimeException("Produit non trouvé")))
                .flatMap(product -> {
                    Mono<String> categoryName = categoryRepository.findById(product.getCategoryId())
                            .map(category -> category.getName())
                            .defaultIfEmpty("Catégorie inconnue");
                    
                    Flux<CustomizationOption> customizationOptions = 
                            customizationOptionRepository.findByProductIdAndActiveTrueOrderBySortOrderAsc(id);
                    
                    return Mono.zip(
                            Mono.just(product),
                            categoryName,
                            customizationOptions.collectList()
                    ).map(tuple -> ProductResponse.builder()
                            .product(tuple.getT1())
                            .categoryName(tuple.getT2())
                            .customizationOptions(tuple.getT3())
                            .build());
                });
    }
    
    public Flux<Product> searchProducts(String search, Long categoryId, String sortBy) {
        Flux<Product> products;
        
        if (search != null && !search.trim().isEmpty()) {
            String searchPattern = "%" + search.trim() + "%";
            if (categoryId != null) {
                products = productRepository.findByActiveTrueAndCategoryIdAndNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                        categoryId, searchPattern);
            } else {
                products = productRepository.findByActiveTrueAndNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(searchPattern);
            }
        } else if (categoryId != null) {
            products = productRepository.findByActiveTrueAndCategoryId(categoryId);
        } else {
            products = productRepository.findByActiveTrue();
        }
        
        // Apply sorting
        if (sortBy != null) {
            switch (sortBy) {
                case "price-low":
                    return products.sort((p1, p2) -> p1.getBasePrice().compareTo(p2.getBasePrice()));
                case "price-high":
                    return products.sort((p1, p2) -> p2.getBasePrice().compareTo(p1.getBasePrice()));
                case "rating":
                    return products.sort((p1, p2) -> Double.compare(p2.getAverageRating(), p1.getAverageRating()));
                case "newest":
                    return products.sort((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()));
                default:
                    return products.sort((p1, p2) -> Integer.compare(p2.getReviewCount(), p1.getReviewCount()));
            }
        }
        
        return products;
    }
    
    public Flux<Product> getFeaturedProducts() {
        return productRepository.findByActiveTrueOrderByAverageRatingDescReviewCountDesc()
                .take(8);
    }
    
    public Flux<Product> getPopularProducts() {
        return productRepository.findByActiveTrueOrderByAverageRatingDescReviewCountDesc()
                .take(12);
    }
    
    public Flux<Product> getNewestProducts() {
        return productRepository.findByActiveTrueOrderByCreatedAtDesc()
                .take(12);
    }
    
    public Flux<CustomizationOption> getCustomizationOptions(Long productId) {
        return customizationOptionRepository.findByProductIdAndActiveTrueOrderBySortOrderAsc(productId);
    }
    
    public Flux<CustomizationOption> getCustomizationOptionsByType(Long productId, String type) {
        return customizationOptionRepository.findByProductIdAndTypeAndActiveTrueOrderBySortOrderAsc(productId, type);
    }
    
    public Mono<Product> createProduct(Product product) {
        return productRepository.save(product);
    }
    
    public Mono<Product> updateProduct(Long id, Product productUpdate) {
        return productRepository.findById(id)
                .flatMap(existingProduct -> {
                    existingProduct.setName(productUpdate.getName());
                    existingProduct.setDescription(productUpdate.getDescription());
                    existingProduct.setBasePrice(productUpdate.getBasePrice());
                    existingProduct.setCategoryId(productUpdate.getCategoryId());
                    existingProduct.setImageUrl(productUpdate.getImageUrl());
                    existingProduct.setModel3dUrl(productUpdate.getModel3dUrl());
                    existingProduct.setActive(productUpdate.getActive());
                    existingProduct.setCustomizable(productUpdate.getCustomizable());
                    existingProduct.setStockQuantity(productUpdate.getStockQuantity());
                    existingProduct.setSku(productUpdate.getSku());
                    existingProduct.setTags(productUpdate.getTags());
                    
                    return productRepository.save(existingProduct);
                })
                .switchIfEmpty(Mono.error(new RuntimeException("Produit non trouvé")));
    }
    
    public Mono<Void> deleteProduct(Long id) {
        return productRepository.findById(id)
                .flatMap(product -> {
                    product.setActive(false);
                    return productRepository.save(product);
                })
                .switchIfEmpty(Mono.error(new RuntimeException("Produit non trouvé")))
                .then();
    }
}