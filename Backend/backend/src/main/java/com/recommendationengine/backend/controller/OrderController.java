package com.recommendationengine.backend.controller;

import com.recommendationengine.backend.dto.OrderRequest;
import com.recommendationengine.backend.dto.OrderResponse;
import com.recommendationengine.backend.repository.UserRepository;
import com.recommendationengine.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    private Long getUserId(Authentication auth) {
        return userRepository.findByEmail(auth.getName()).orElseThrow().getId();
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(
            @Valid @RequestBody OrderRequest request,
            Authentication auth) {
        return ResponseEntity.ok(orderService.checkout(getUserId(auth), request));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getMyOrders(getUserId(auth)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id,
            Authentication auth) {
        return ResponseEntity.ok(orderService.getOrderById(id, getUserId(auth)));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long id,
            Authentication auth) {
        return ResponseEntity.ok(orderService.cancelOrder(id, getUserId(auth)));
    }
}