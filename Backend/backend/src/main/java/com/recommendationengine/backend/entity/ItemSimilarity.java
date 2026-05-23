package com.recommendationengine.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "item_similarity")
public class ItemSimilarity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id_1")
    private Product product1;

    @ManyToOne
    @JoinColumn(name = "product_id_2")
    private Product product2;

    @Column(name = "similarity_score")
    private BigDecimal similarityScore;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}