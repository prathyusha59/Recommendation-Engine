package com.recommendationengine.backend.repository;

import com.recommendationengine.backend.entity.ItemSimilarity;
import com.recommendationengine.backend.entity.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemSimilarityRepository extends JpaRepository<ItemSimilarity, Long> {


    @Query("""
            SELECT i FROM ItemSimilarity i
            WHERE (i.product1.id = :productId OR i.product2.id = :productId)
            ORDER BY i.similarityScore DESC
            """)
    List<ItemSimilarity> findSimilarProducts(@Param("productId") Long productId);

    @Query("""
            SELECT i FROM ItemSimilarity i
            WHERE (i.product1.id = :productId OR i.product2.id = :productId)
            ORDER BY i.similarityScore DESC
            """)
    List<ItemSimilarity> findTopNSimilarProducts(@Param("productId") Long productId,
                                                 Pageable pageable);

    Optional<ItemSimilarity> findByProduct1AndProduct2(Product product1, Product product2);
}