package com.recommendationengine.backend.service;

import com.recommendationengine.backend.dto.ProductRequest;
import com.recommendationengine.backend.dto.ProductResponse;
import com.recommendationengine.backend.entity.Product;
import com.recommendationengine.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> getAllActiveProducts() {
        return productRepository.findAllActiveProducts()
                .stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
    }

    public Page<ProductResponse> getActiveProductsPaginated(int page, int size) {
        return productRepository.findByIsActiveTrue(PageRequest.of(page, size))
                .map(ProductResponse::from);
    }

    public Page<ProductResponse> searchProducts(
            String search, String category, String brand,
            BigDecimal minPrice, BigDecimal maxPrice,
            String sortBy, int page, int size) {

        Sort sort = switch (sortBy) {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "name_asc" -> Sort.by("name").ascending();
            default -> Sort.by("created_at").descending(); // ✅ fixed
        };

        return productRepository.searchProducts(
                search, category, brand, minPrice, maxPrice,
                PageRequest.of(page, size, sort)
        ).map(ProductResponse::from);
    }

    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }

    public List<String> getAllBrands() {
        return productRepository.findAllBrands();
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return ProductResponse.from(product);
    }

    public List<ProductResponse> getProductsByCategory(String category) {
        return productRepository.findByCategoryAndIsActiveTrue(category)
                .stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsByBrand(String brand) {
        return productRepository.findByBrand(brand)
                .stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
    }

    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setBrand(request.getBrand());
        product.setImageUrl(request.getImageUrl());
        product.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        product.setCreatedAt(LocalDateTime.now());
        return ProductResponse.from(productRepository.save(product));
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setBrand(request.getBrand());
        product.setImageUrl(request.getImageUrl());
        if (request.getIsActive() != null) product.setIsActive(request.getIsActive());
        return ProductResponse.from(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    public ProductResponse deactivateProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        product.setIsActive(false);
        return ProductResponse.from(productRepository.save(product));
    }
}