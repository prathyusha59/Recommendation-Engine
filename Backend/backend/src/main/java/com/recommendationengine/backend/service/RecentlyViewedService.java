package com.recommendationengine.backend.service;

import com.recommendationengine.backend.dto.RecentlyViewedResponse;
import com.recommendationengine.backend.entity.Product;
import com.recommendationengine.backend.entity.RecentlyViewed;
import com.recommendationengine.backend.entity.User;
import com.recommendationengine.backend.repository.ProductRepository;
import com.recommendationengine.backend.repository.RecentlyViewedRepository;
import com.recommendationengine.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecentlyViewedService {

    private final RecentlyViewedRepository recentlyViewedRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;


    public void trackView(Long userId, Long productId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<RecentlyViewed> existing = recentlyViewedRepository.findByUserAndProduct(user, product);

        if (existing.isPresent()) {
            RecentlyViewed rv = existing.get();
            rv.setViewedAt(LocalDateTime.now());
            recentlyViewedRepository.save(rv);
        } else {
            RecentlyViewed rv = new RecentlyViewed();
            rv.setUser(user);
            rv.setProduct(product);
            rv.setViewedAt(LocalDateTime.now());
            recentlyViewedRepository.save(rv);
        }
    }


    public List<RecentlyViewedResponse> getRecentlyViewed(Long userId, int limit) {
        return recentlyViewedRepository
                .findTopNByUserId(userId, PageRequest.of(0, limit))
                .stream()
                .map(rv -> {
                    // DEBUG
                    System.out.println("Product: " + rv.getProduct());
                    System.out.println("Price: " + rv.getProduct().getPrice());
                    return RecentlyViewedResponse.from(rv);
                })
                .collect(Collectors.toList());
    }


    public List<RecentlyViewedResponse> getAllRecentlyViewed(Long userId) {
        return recentlyViewedRepository
                .findByUserIdOrderByViewedAtDesc(userId)
                .stream()
                .map(RecentlyViewedResponse::from)
                .collect(Collectors.toList());
    }


    public void clearRecentlyViewed(Long userId) {
        List<RecentlyViewed> list = recentlyViewedRepository.findByUserIdOrderByViewedAtDesc(userId);
        recentlyViewedRepository.deleteAll(list);
    }
}