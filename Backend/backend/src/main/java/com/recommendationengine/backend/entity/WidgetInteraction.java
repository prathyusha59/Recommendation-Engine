package com.recommendationengine.backend.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "widget_interactions")
public class WidgetInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "session_id")
    private String sessionId;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "widget_type")
    private String widgetType;

    @Column(name = "interaction_type")
    private String interactionType;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}