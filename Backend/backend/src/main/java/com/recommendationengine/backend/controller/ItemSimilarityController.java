package com.recommendationengine.backend.controller;

import com.recommendationengine.backend.dto.ProductResponse;
import com.recommendationengine.backend.service.ItemSimilarityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/similarity")
@RequiredArgsConstructor
public class ItemSimilarityController {

    private final ItemSimilarityService itemSimilarityService;

    @GetMapping("/{productId}")
    public ResponseEntity<List<ProductResponse>> getSimilarProducts(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(itemSimilarityService.getSimilarProducts(productId, limit));
    }

    @PostMapping("/recalculate")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> recalculate() {
        return ResponseEntity.ok(itemSimilarityService.recalculate());
    }
}