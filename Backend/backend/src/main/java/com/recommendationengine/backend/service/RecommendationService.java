package com.recommendationengine.backend.service;

import com.recommendationengine.backend.dto.ProductResponse;
import com.recommendationengine.backend.dto.RecommendationResponse;
import com.recommendationengine.backend.dto.RecentlyViewedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final ItemSimilarityService itemSimilarityService;
    private final MarketBasketService marketBasketService;
    private final RecentlyViewedService recentlyViewedService;
    private final AdminOverrideService adminOverrideService;


    public RecommendationResponse getRecommendations(Long productId, Long userId) {

        List<ProductResponse> similarProducts = itemSimilarityService
                .getSimilarProducts(productId, 5);

        List<ProductResponse> marketBasketProducts = marketBasketService
                .getRecommendations(productId);

        List<ProductResponse> recentlyViewed = userId != null
                ? convertToProductResponse(recentlyViewedService.getRecentlyViewed(userId, 5))
                : List.of();

        List<ProductResponse> featuredProducts = adminOverrideService.getFeaturedProducts();

        return new RecommendationResponse(similarProducts, marketBasketProducts, recentlyViewed, featuredProducts);
    }


    public RecommendationResponse getHomepageRecommendations(Long userId) {

        List<ProductResponse> recentlyViewed = userId != null
                ? convertToProductResponse(recentlyViewedService.getRecentlyViewed(userId, 5))
                : List.of();

        List<ProductResponse> similarProducts = List.of();
        List<ProductResponse> marketBasketProducts = List.of();

        if (!recentlyViewed.isEmpty()) {
            Long lastViewedProductId = recentlyViewed.get(0).getId();
            similarProducts = itemSimilarityService.getSimilarProducts(lastViewedProductId, 5);
            marketBasketProducts = marketBasketService.getRecommendations(lastViewedProductId);
        }

        List<ProductResponse> featuredProducts = adminOverrideService.getFeaturedProducts();

        return new RecommendationResponse(similarProducts, marketBasketProducts, recentlyViewed, featuredProducts);
    }


    private List<ProductResponse> convertToProductResponse(List<RecentlyViewedResponse> recentlyViewed) {
        return recentlyViewed.stream()
                .map(rv -> {
                    ProductResponse p = new ProductResponse();
                    p.setId(rv.getProductId());
                    p.setName(rv.getProductName());
                    p.setCategory(rv.getProductCategory());
                    p.setBrand(rv.getProductBrand());
                    p.setImageUrl(rv.getImageUrl());
                    p.setPrice(rv.getProductPrice() != null
                            ? java.math.BigDecimal.valueOf(rv.getProductPrice())
                            : java.math.BigDecimal.ZERO);
                    return p;
                })
                .collect(Collectors.toList());
    }
}