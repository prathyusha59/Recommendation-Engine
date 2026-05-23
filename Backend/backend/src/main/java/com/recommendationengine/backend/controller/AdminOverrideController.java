package com.recommendationengine.backend.controller;

import com.recommendationengine.backend.dto.AdminOverrideRequest;
import com.recommendationengine.backend.dto.ProductResponse;
import com.recommendationengine.backend.service.AdminOverrideService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin-overrides")
@RequiredArgsConstructor
public class AdminOverrideController {

    private final AdminOverrideService adminOverrideService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> createOverride(@Valid @RequestBody AdminOverrideRequest request) {
        return ResponseEntity.ok(adminOverrideService.createOverride(request));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ProductResponse>> getFeaturedProducts() {
        return ResponseEntity.ok(adminOverrideService.getFeaturedProducts());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductResponse>> getOverridesByCategory(
            @PathVariable String category) {
        return ResponseEntity.ok(adminOverrideService.getOverridesByCategory(category));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> deactivateOverride(@PathVariable Long id) {
        return ResponseEntity.ok(adminOverrideService.deactivateOverride(id));
    }
}