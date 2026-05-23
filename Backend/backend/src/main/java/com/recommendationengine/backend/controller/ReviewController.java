package com.recommendationengine.backend.controller;

import com.recommendationengine.backend.entity.Review;
import com.recommendationengine.backend.entity.User;
import com.recommendationengine.backend.entity.Product;
import com.recommendationengine.backend.repository.ReviewRepository;
import com.recommendationengine.backend.repository.UserRepository;
import com.recommendationengine.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getProductReviews(@PathVariable Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        Double avgRating = reviewRepository.findAverageRatingByProductId(productId);
        Long count = reviewRepository.countByProductId(productId);

        List<Map<String, Object>> reviewList = new ArrayList<>();
        for (Review r : reviews) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", r.getId());
            map.put("rating", r.getRating());
            map.put("comment", r.getComment());
            map.put("userName", r.getUser().getName());
            map.put("createdAt", r.getCreatedAt());
            reviewList.add(map);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("reviews", reviewList);
        response.put("averageRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0);
        response.put("totalReviews", count);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<?> addReview(
            @PathVariable Long productId,
            @RequestBody Map<String, Object> body,
            Authentication auth) {

        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (reviewRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            return ResponseEntity.badRequest().body("You already reviewed this product!");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating((Integer) body.get("rating"));
        review.setComment((String) body.get("comment"));

        reviewRepository.save(review);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Review added successfully!");
        response.put("rating", review.getRating());
        response.put("comment", review.getComment());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId, Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Not authorized!");
        }

        reviewRepository.delete(review);
        return ResponseEntity.ok("Review deleted!");
    }
}