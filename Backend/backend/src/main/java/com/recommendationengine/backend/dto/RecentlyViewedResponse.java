package com.recommendationengine.backend.dto;

import com.recommendationengine.backend.entity.RecentlyViewed;
import java.time.LocalDateTime;

public class RecentlyViewedResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String productCategory;
    private String productBrand;
    private Double productPrice;
    private String imageUrl;
    private LocalDateTime viewedAt;

    public static RecentlyViewedResponse from(RecentlyViewed rv) {
        RecentlyViewedResponse response = new RecentlyViewedResponse();
        response.setId(rv.getId());
        response.setProductId(rv.getProduct().getId());
        response.setProductName(rv.getProduct().getName());
        response.setProductCategory(rv.getProduct().getCategory());
        response.setProductBrand(rv.getProduct().getBrand());
        response.setProductPrice(rv.getProduct().getPrice().doubleValue());
        response.setImageUrl(rv.getProduct().getImageUrl());
        response.setViewedAt(rv.getViewedAt());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductCategory() { return productCategory; }
    public void setProductCategory(String productCategory) { this.productCategory = productCategory; }

    public String getProductBrand() { return productBrand; }
    public void setProductBrand(String productBrand) { this.productBrand = productBrand; }

    public Double getProductPrice() { return productPrice; }
    public void setProductPrice(Double productPrice) { this.productPrice = productPrice; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDateTime getViewedAt() { return viewedAt; }
    public void setViewedAt(LocalDateTime viewedAt) { this.viewedAt = viewedAt; }
}