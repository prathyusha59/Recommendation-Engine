package com.recommendationengine.backend.repository;

import com.recommendationengine.backend.entity.AdminOverride;
import com.recommendationengine.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminOverrideRepository extends JpaRepository<AdminOverride, Long> {

    @Query("""
            SELECT a FROM AdminOverride a
            WHERE a.isActive = true
            ORDER BY a.priority DESC
            """)
    List<AdminOverride> findAllActiveOverrides();

    List<AdminOverride> findByProductId(Long productId);

    List<AdminOverride> findByCategory(String category);

    List<AdminOverride> findByOverrideType(String overrideType);

    List<AdminOverride> findByCategoryAndIsActiveTrue(String category);

    List<AdminOverride> findByIsActiveTrueOrderByPriorityAsc();

    @Query("""
            SELECT a FROM AdminOverride a
            WHERE a.category = :category
            AND a.isActive = true
            ORDER BY a.priority ASC
            """)
    List<AdminOverride> findActiveByCategoryOrdered(@Param("category") String category);
}