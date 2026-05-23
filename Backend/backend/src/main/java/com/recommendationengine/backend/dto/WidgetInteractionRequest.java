package com.recommendationengine.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class WidgetInteractionRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotBlank(message = "Widget type is required")
    private String widgetType; // RECOMMENDATION, RECENTLY_VIEWED, SIMILAR_PRODUCTS, MARKET_BASKET

    @NotBlank(message = "Interaction type is required")
    private String interactionType; // CLICK, VIEW, ADD_TO_CART, DISMISS

    private String sessionId;

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getWidgetType() { return widgetType; }
    public void setWidgetType(String widgetType) { this.widgetType = widgetType; }

    public String getInteractionType() { return interactionType; }
    public void setInteractionType(String interactionType) { this.interactionType = interactionType; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
}