package com.recommendationengine.backend.repository;

import com.recommendationengine.backend.entity.Event;
import com.recommendationengine.backend.entity.User;
import com.recommendationengine.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByUserId(Long userId);

    List<Event> findByUserIdAndEventType(Long userId, String eventType);

    List<Event> findByProductId(Long productId);

    List<Event> findBySessionId(String sessionId);

    List<Event> findByEventType(String eventType);

    @Query("""
            SELECT e FROM Event e
            WHERE e.user.id = :userId
            ORDER BY e.createdAt DESC
            """)
    List<Event> findRecentEventsByUserId(@Param("userId") Long userId);
}