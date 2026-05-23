package com.recommendationengine.backend.service;

import com.recommendationengine.backend.dto.ProductResponse;
import com.recommendationengine.backend.entity.MarketBasketRule;
import com.recommendationengine.backend.entity.Product;
import com.recommendationengine.backend.repository.EventRepository;
import com.recommendationengine.backend.repository.MarketBasketRepository;
import com.recommendationengine.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarketBasketService {

    private final MarketBasketRepository marketBasketRepository;
    private final ProductRepository productRepository;
    private final EventRepository eventRepository;


    public List<ProductResponse> getRecommendations(Long productId) {
        return marketBasketRepository.findRulesByAntecedent(productId)
                .stream()
                .map(rule -> ProductResponse.from(rule.getRecommendedProduct()))
                .collect(Collectors.toList());
    }


    @Scheduled(fixedDelay = 7200000)
    public void calculateMarketBasketRules() {
        List<Product> products = productRepository.findByIsActiveTrue();

        for (Product productA : products) {
            for (Product productB : products) {
                if (productA.getId().equals(productB.getId())) continue;

                double confidence = 0.0;
                double support = 0.0;

                // Same category → high confidence
                if (productA.getCategory() != null &&
                        productA.getCategory().equals(productB.getCategory())) {
                    confidence = 0.6;
                    support = 0.3;
                }
                // Same brand → medium confidence
                else if (productA.getBrand() != null &&
                        productA.getBrand().equals(productB.getBrand())) {
                    confidence = 0.4;
                    support = 0.2;
                }

                if (confidence >= 0.1) {
                    saveRule(productA, productB, confidence, support);
                }
            }
        }
    }


    public String recalculate() {
        calculateMarketBasketRules();
        return "Market basket rules calculation completed";
    }


    private void saveRule(Product productA, Product productB, double confidence, double support) {
        List<MarketBasketRule> existing = marketBasketRepository
                .findByProductOrderByConfidenceDesc(productA)
                .stream()
                .filter(r -> r.getRecommendedProduct().getId().equals(productB.getId()))
                .collect(Collectors.toList());

        MarketBasketRule rule;
        if (!existing.isEmpty()) {
            rule = existing.get(0);
        } else {
            rule = new MarketBasketRule();
            rule.setProduct(productA);
            rule.setRecommendedProduct(productB);
        }

        rule.setConfidence(BigDecimal.valueOf(confidence));
        rule.setSupport(BigDecimal.valueOf(support));
        rule.setUpdatedAt(LocalDateTime.now());
        marketBasketRepository.save(rule);
    }
}