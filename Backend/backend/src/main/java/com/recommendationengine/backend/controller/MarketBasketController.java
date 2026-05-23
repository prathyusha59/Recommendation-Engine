package com.recommendationengine.backend.controller;

import com.recommendationengine.backend.dto.ProductResponse;
import com.recommendationengine.backend.service.MarketBasketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market-basket")
@RequiredArgsConstructor
public class MarketBasketController {

    private final MarketBasketService marketBasketService;

    @GetMapping("/{productId}")
    public ResponseEntity<List<ProductResponse>> getRecommendations(
            @PathVariable Long productId) {
        return ResponseEntity.ok(marketBasketService.getRecommendations(productId));
    }

    @PostMapping("/recalculate")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> recalculate() {
        return ResponseEntity.ok(marketBasketService.recalculate());
    }
}