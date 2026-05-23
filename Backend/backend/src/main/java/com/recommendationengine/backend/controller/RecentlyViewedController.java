package com.recommendationengine.backend.controller;

import com.recommendationengine.backend.dto.RecentlyViewedResponse;
import com.recommendationengine.backend.repository.UserRepository;
import com.recommendationengine.backend.service.RecentlyViewedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recently-viewed")
@RequiredArgsConstructor
public class RecentlyViewedController {

    private final RecentlyViewedService recentlyViewedService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<RecentlyViewedResponse>> getRecentlyViewed(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "10") int limit) {

        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(recentlyViewedService.getRecentlyViewed(userId, limit));
    }

    @GetMapping("/all")
    public ResponseEntity<List<RecentlyViewedResponse>> getAllRecentlyViewed(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(recentlyViewedService.getAllRecentlyViewed(userId));
    }

    @DeleteMapping
    public ResponseEntity<String> clearRecentlyViewed(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = getUserId(userDetails);
        recentlyViewedService.clearRecentlyViewed(userId);
        return ResponseEntity.ok("Recently viewed cleared successfully");
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}