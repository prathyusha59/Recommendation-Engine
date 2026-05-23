package com.recommendationengine.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EventRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotBlank(message = "Event type is required")
    private String eventType; // VIEW, CLICK, ADD_TO_CART, PURCHASE, WISHLIST

    private String sessionId;

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
}