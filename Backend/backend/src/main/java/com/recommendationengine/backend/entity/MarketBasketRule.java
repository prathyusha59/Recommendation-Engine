package com.recommendationengine.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "market_basket_rules")
public class MarketBasketRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "recommended_product_id")
    private Product recommendedProduct;

    @Column
    private BigDecimal confidence;

    @Column
    private BigDecimal support;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}