package com.recommendationengine.backend.dto;

import com.recommendationengine.backend.entity.Event;
import java.time.LocalDateTime;

public class EventResponse {

    private Long id;
    private Long userId;
    private Long productId;
    private String productName;
    private String eventType;
    private String sessionId;
    private LocalDateTime createdAt;

    public static EventResponse from(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setUserId(event.getUser().getId());
        response.setProductId(event.getProduct().getId());
        response.setProductName(event.getProduct().getName());
        response.setEventType(event.getEventType());
        response.setSessionId(event.getSessionId());
        response.setCreatedAt(event.getCreatedAt());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}