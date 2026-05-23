package com.recommendationengine.backend.repository;

import com.recommendationengine.backend.entity.WidgetInteraction;
import com.recommendationengine.backend.entity.User;
import com.recommendationengine.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WidgetInteractionRepository extends JpaRepository<WidgetInteraction, Long> {

    List<WidgetInteraction> findByUserId(Long userId);

    List<WidgetInteraction> findByWidgetType(String widgetType);

    List<WidgetInteraction> findByInteractionType(String interactionType);

    List<WidgetInteraction> findBySessionId(String sessionId);

    List<WidgetInteraction> findByUser(User user);

    List<WidgetInteraction> findByProduct(Product product);

    @Query("""
            SELECT w FROM WidgetInteraction w
            WHERE w.user.id = :userId
            AND w.widgetType = :widgetType
            ORDER BY w.createdAt DESC
            """)
    List<WidgetInteraction> findByUserIdAndWidgetType(
            @Param("userId") Long userId,
            @Param("widgetType") String widgetType);
}