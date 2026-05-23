package com.recommendationengine.backend.dto;

import java.util.List;

public class RecommendationResponse {

    private List<ProductResponse> similarProducts;
    private List<ProductResponse> marketBasketProducts;
    private List<ProductResponse> recentlyViewed;
    private List<ProductResponse> featuredProducts;

    public RecommendationResponse(
            List<ProductResponse> similarProducts,
            List<ProductResponse> marketBasketProducts,
            List<ProductResponse> recentlyViewed,
            List<ProductResponse> featuredProducts) {
        this.similarProducts = similarProducts;
        this.marketBasketProducts = marketBasketProducts;
        this.recentlyViewed = recentlyViewed;
        this.featuredProducts = featuredProducts;
    }

    public List<ProductResponse> getSimilarProducts() { return similarProducts; }
    public List<ProductResponse> getMarketBasketProducts() { return marketBasketProducts; }
    public List<ProductResponse> getRecentlyViewed() { return recentlyViewed; }
    public List<ProductResponse> getFeaturedProducts() { return featuredProducts; }
}