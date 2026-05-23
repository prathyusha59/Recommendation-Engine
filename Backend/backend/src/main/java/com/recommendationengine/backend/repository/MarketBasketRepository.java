package com.recommendationengine.backend.repository;

import com.recommendationengine.backend.entity.MarketBasketRule;
import com.recommendationengine.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketBasketRepository extends JpaRepository<MarketBasketRule, Long> {

    @Query("""
            SELECT m FROM MarketBasketRule m
            WHERE m.product.id = :productId
            ORDER BY m.confidence DESC
            """)
    List<MarketBasketRule> findRulesByAntecedent(@Param("productId") Long productId);

    @Query("""
            SELECT m FROM MarketBasketRule m
            WHERE m.confidence >= :minConfidence
            ORDER BY m.confidence DESC
            """)
    List<MarketBasketRule> findHighConfidenceRules(@Param("minConfidence") double minConfidence);

    List<MarketBasketRule> findByProductOrderByConfidenceDesc(Product product);
}