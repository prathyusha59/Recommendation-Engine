package com.recommendationengine.backend.controller;

import com.recommendationengine.backend.entity.*;
import com.recommendationengine.backend.repository.UserRepository;
import com.recommendationengine.backend.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
    @Autowired private WishlistService wishlistService;
    @Autowired private UserRepository userRepo;

    private Long getUserId(Authentication auth) {
        return userRepo.findByEmail(auth.getName()).orElseThrow().getId();
    }

    @GetMapping
    public ResponseEntity<List<WishlistItem>> getWishlist(Authentication auth) {
        return ResponseEntity.ok(wishlistService.getWishlist(getUserId(auth)));
    }

    @PostMapping
    public ResponseEntity<?> addToWishlist(@RequestBody Map<String, Object> body, Authentication auth) {
        Long productId = Long.valueOf(body.get("productId").toString());
        return ResponseEntity.ok(wishlistService.addToWishlist(getUserId(auth), productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long productId, Authentication auth) {
        wishlistService.removeFromWishlist(getUserId(auth), productId);
        return ResponseEntity.ok(Map.of("message", "Removed from wishlist"));
    }
}