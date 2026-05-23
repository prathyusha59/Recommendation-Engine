package com.recommendationengine.backend.repository;

import com.recommendationengine.backend.entity.RecentlyViewed;
import com.recommendationengine.backend.entity.User;
import com.recommendationengine.backend.entity.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecentlyViewedRepository extends JpaRepository<RecentlyViewed, Long> {

    @Query("SELECT rv FROM RecentlyViewed rv JOIN FETCH rv.product WHERE rv.user.id = :userId ORDER BY rv.viewedAt DESC")
    List<RecentlyViewed> findByUserIdOrderByViewedAtDesc(@Param("userId") Long userId);

    List<RecentlyViewed> findByUserOrderByViewedAtDesc(User user);

    Optional<RecentlyViewed> findByUserAndProduct(User user, Product product);

    boolean existsByUserAndProduct(User user, Product product);

    @Query("""
            SELECT rv FROM RecentlyViewed rv
            JOIN FETCH rv.product
            WHERE rv.user.id = :userId
            ORDER BY rv.viewedAt DESC
            """)
    List<RecentlyViewed> findTopNByUserId(@Param("userId") Long userId,
                                          Pageable pageable);
}