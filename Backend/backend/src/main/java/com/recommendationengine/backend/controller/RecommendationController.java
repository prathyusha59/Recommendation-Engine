package com.recommendationengine.backend.controller;

import com.recommendationengine.backend.dto.RecommendationResponse;
import com.recommendationengine.backend.repository.UserRepository;
import com.recommendationengine.backend.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final UserRepository userRepository;

    @GetMapping("/product/{productId}")
    public ResponseEntity<RecommendationResponse> getProductRecommendations(
            @PathVariable Long productId,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(recommendationService.getRecommendations(productId, userId));
    }

    @GetMapping("/homepage")
    public ResponseEntity<RecommendationResponse> getHomepageRecommendations(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = getUserId(userDetails);
        System.out.println("Homepage hit - userDetails: " + userDetails);
        System.out.println("Homepage hit - userId: " + userId);
        return ResponseEntity.ok(recommendationService.getHomepageRecommendations(userId));
    }

    private Long getUserId(UserDetails userDetails) {
        if (userDetails == null) return null;
        return userRepository.findByEmail(userDetails.getUsername())
                .map(u -> u.getId())
                .orElse(null);
    }
}