package com.recommendationengine.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AdminOverrideRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    private String category;

    @NotBlank(message = "Override type is required")
    private String overrideType; // FEATURED, TRENDING, SPONSORED, SEASONAL

    private Integer priority = 0;
    private Boolean isActive = true;

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getOverrideType() { return overrideType; }
    public void setOverrideType(String overrideType) { this.overrideType = overrideType; }

    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}