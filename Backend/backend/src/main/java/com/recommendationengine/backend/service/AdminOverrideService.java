package com.recommendationengine.backend.service;

import com.recommendationengine.backend.dto.AdminOverrideRequest;
import com.recommendationengine.backend.dto.ProductResponse;
import com.recommendationengine.backend.entity.AdminOverride;
import com.recommendationengine.backend.entity.Product;
import com.recommendationengine.backend.repository.AdminOverrideRepository;
import com.recommendationengine.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminOverrideService {

    private final AdminOverrideRepository adminOverrideRepository;
    private final ProductRepository productRepository;

    // ─── Create Override ─────────────────────────────────────────────────────

    public String createOverride(AdminOverrideRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        AdminOverride override = new AdminOverride();
        override.setProduct(product);
        override.setCategory(request.getCategory());
        override.setOverrideType(request.getOverrideType().toUpperCase());
        override.setPriority(request.getPriority());
        override.setIsActive(request.getIsActive());
        override.setCreatedAt(LocalDateTime.now());

        adminOverrideRepository.save(override);
        return "Override created successfully";
    }

    // ─── Get Featured Products ────────────────────────────────────────────────

    public List<ProductResponse> getFeaturedProducts() {
        return adminOverrideRepository.findAllActiveOverrides()
                .stream()
                .map(o -> ProductResponse.from(o.getProduct()))
                .distinct()
                .collect(Collectors.toList());
    }

    // ─── Get Overrides By Category ────────────────────────────────────────────

    public List<ProductResponse> getOverridesByCategory(String category) {
        return adminOverrideRepository.findActiveByCategoryOrdered(category)
                .stream()
                .map(o -> ProductResponse.from(o.getProduct()))
                .collect(Collectors.toList());
    }

    // ─── Deactivate Override ─────────────────────────────────────────────────

    public String deactivateOverride(Long overrideId) {
        AdminOverride override = adminOverrideRepository.findById(overrideId)
                .orElseThrow(() -> new RuntimeException("Override not found"));
        override.setIsActive(false);
        adminOverrideRepository.save(override);
        return "Override deactivated successfully";
    }
}