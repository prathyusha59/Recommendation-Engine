package com.recommendationengine.backend.controller;

import com.recommendationengine.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final WishlistItemRepository wishlistItemRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProducts", productRepository.count());
        stats.put("totalCartItems", cartItemRepository.count());
        stats.put("totalWishlistItems", wishlistItemRepository.count());
        stats.put("totalOrders", 0);
        stats.put("totalRevenue", 0);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/charts/orders-per-day")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getOrdersPerDay() {
        List<Map<String, Object>> data = new ArrayList<>();
        LocalDate today = LocalDate.now();
        int[] orders = {4, 7, 5, 9, 6, 11, 8};
        for (int i = 6; i >= 0; i--) {
            Map<String, Object> point = new HashMap<>();
            point.put("day", today.minusDays(i).getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            point.put("orders", orders[6 - i]);
            data.add(point);
        }
        return ResponseEntity.ok(data);
    }

    @GetMapping("/charts/revenue-per-day")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getRevenuePerDay() {
        List<Map<String, Object>> data = new ArrayList<>();
        LocalDate today = LocalDate.now();
        int[] revenue = {12000, 18500, 9800, 24000, 15600, 31000, 22400};
        for (int i = 6; i >= 0; i--) {
            Map<String, Object> point = new HashMap<>();
            point.put("day", today.minusDays(i).getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            point.put("revenue", revenue[6 - i]);
            data.add(point);
        }
        return ResponseEntity.ok(data);
    }

    @GetMapping("/charts/products-by-category")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getProductsByCategory() {
        List<Map<String, Object>> data = new ArrayList<>();
        productRepository.findAll().forEach(p -> {
            String cat = p.getCategory();
            Optional<Map<String, Object>> existing = data.stream()
                    .filter(d -> d.get("name").equals(cat)).findFirst();
            if (existing.isPresent()) {
                existing.get().put("value", (int) existing.get().get("value") + 1);
            } else {
                Map<String, Object> point = new HashMap<>();
                point.put("name", cat);
                point.put("value", 1);
                data.add(point);
            }
        });
        return ResponseEntity.ok(data);
    }

    @GetMapping("/charts/events-by-type")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getEventsByType() {
        List<Map<String, Object>> data = new ArrayList<>();
        String[] events = {"VIEW", "CLICK", "ADD_TO_CART", "WISHLIST", "PURCHASE"};
        int[] counts = {320, 185, 97, 64, 42};
        for (int i = 0; i < events.length; i++) {
            Map<String, Object> point = new HashMap<>();
            point.put("name", events[i]);
            point.put("count", counts[i]);
            data.add(point);
        }
        return ResponseEntity.ok(data);
    }

    @GetMapping("/charts/order-status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getOrderStatus() {
        List<Map<String, Object>> data = new ArrayList<>();
        String[] statuses = {"DELIVERED", "PROCESSING", "SHIPPED", "CANCELLED"};
        int[] counts = {45, 20, 15, 8};
        for (int i = 0; i < statuses.length; i++) {
            Map<String, Object> point = new HashMap<>();
            point.put("name", statuses[i]);
            point.put("value", counts[i]);
            data.add(point);
        }
        return ResponseEntity.ok(data);
    }
}