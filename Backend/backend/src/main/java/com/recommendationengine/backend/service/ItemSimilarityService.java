package com.recommendationengine.backend.service;

import com.recommendationengine.backend.dto.ProductResponse;
import com.recommendationengine.backend.entity.ItemSimilarity;
import com.recommendationengine.backend.entity.Product;
import com.recommendationengine.backend.repository.EventRepository;
import com.recommendationengine.backend.repository.ItemSimilarityRepository;
import com.recommendationengine.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemSimilarityService {

    private final ItemSimilarityRepository itemSimilarityRepository;
    private final ProductRepository productRepository;
    private final EventRepository eventRepository;


    public List<ProductResponse> getSimilarProducts(Long productId, int limit) {
        List<ItemSimilarity> similarities = itemSimilarityRepository
                .findTopNSimilarProducts(productId, PageRequest.of(0, limit));

        return similarities.stream()
                .map(sim -> {
                    Product recommended = sim.getProduct1().getId().equals(productId)
                            ? sim.getProduct2()
                            : sim.getProduct1();
                    return ProductResponse.from(recommended);
                })
                .collect(Collectors.toList());
    }


    @Scheduled(fixedDelay = 3600000)
    public void calculateSimilarities() {
        List<Product> products = productRepository.findByIsActiveTrue();

        for (int i = 0; i < products.size(); i++) {
            for (int j = i + 1; j < products.size(); j++) {
                Product p1 = products.get(i);
                Product p2 = products.get(j);

                double score = calculateCoOccurrenceScore(p1.getId(), p2.getId());

                if (score > 0) {
                    saveSimilarity(p1, p2, score);
                }
            }
        }
    }

    public String recalculate() {
        calculateSimilarities();
        return "Similarity calculation completed";
    }


    private double calculateCoOccurrenceScore(Long productId1, Long productId2) {
        Product p1 = productRepository.findById(productId1).orElse(null);
        Product p2 = productRepository.findById(productId2).orElse(null);

        if (p1 == null || p2 == null) return 0;

        double score = 0.0;

        // Same category → 0.6
        if (p1.getCategory() != null && p1.getCategory().equals(p2.getCategory())) {
            score += 0.6;
        }

        // Same brand → 0.4
        if (p1.getBrand() != null && p1.getBrand().equals(p2.getBrand())) {
            score += 0.4;
        }

        return score;
    }


    private void saveSimilarity(Product p1, Product p2, double score) {
        Optional<ItemSimilarity> existing = itemSimilarityRepository
                .findByProduct1AndProduct2(p1, p2);

        ItemSimilarity similarity;
        if (existing.isPresent()) {
            similarity = existing.get();
        } else {
            similarity = new ItemSimilarity();
            similarity.setProduct1(p1);
            similarity.setProduct2(p2);
        }

        similarity.setSimilarityScore(BigDecimal.valueOf(score));
        similarity.setUpdatedAt(LocalDateTime.now());
        itemSimilarityRepository.save(similarity);
    }
}