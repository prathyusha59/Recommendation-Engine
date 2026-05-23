package com.recommendationengine.backend.controller;

import com.recommendationengine.backend.entity.*;
import com.recommendationengine.backend.repository.UserRepository;
import com.recommendationengine.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired private CartService cartService;
    @Autowired private UserRepository userRepo;

    private Long getUserId(Authentication auth) {
        return userRepo.findByEmail(auth.getName()).orElseThrow().getId();
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(Authentication auth) {
        return ResponseEntity.ok(cartService.getCart(getUserId(auth)));
    }

    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> body, Authentication auth) {
        Long productId = Long.valueOf(body.get("productId").toString());
        Integer quantity = body.containsKey("quantity") ? Integer.valueOf(body.get("quantity").toString()) : 1;
        return ResponseEntity.ok(cartService.addToCart(getUserId(auth), productId, quantity));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long productId, Authentication auth) {
        cartService.removeFromCart(getUserId(auth), productId);
        return ResponseEntity.ok(Map.of("message", "Removed from cart"));
    }
}