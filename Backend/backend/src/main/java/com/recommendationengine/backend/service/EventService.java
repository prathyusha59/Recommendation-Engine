package com.recommendationengine.backend.service;

import com.recommendationengine.backend.dto.EventRequest;
import com.recommendationengine.backend.dto.EventResponse;
import com.recommendationengine.backend.entity.Event;
import com.recommendationengine.backend.entity.Product;
import com.recommendationengine.backend.entity.User;
import com.recommendationengine.backend.repository.EventRepository;
import com.recommendationengine.backend.repository.ProductRepository;
import com.recommendationengine.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final RecentlyViewedService recentlyViewedService;


    public EventResponse trackEvent(Long userId, EventRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        Event event = new Event();
        event.setUser(user);
        event.setProduct(product);
        event.setEventType(request.getEventType().toUpperCase());
        event.setSessionId(request.getSessionId());
        event.setCreatedAt(LocalDateTime.now());

        EventResponse response = EventResponse.from(eventRepository.save(event));

        if ("VIEW".equals(event.getEventType())) {
            recentlyViewedService.trackView(userId, request.getProductId());
        }

        return response;
    }


    public List<EventResponse> getEventsByUser(Long userId) {
        return eventRepository.findRecentEventsByUserId(userId)
                .stream()
                .map(EventResponse::from)
                .collect(Collectors.toList());
    }


    public List<EventResponse> getEventsByUserAndType(Long userId, String eventType) {
        return eventRepository.findByUserIdAndEventType(userId, eventType.toUpperCase())
                .stream()
                .map(EventResponse::from)
                .collect(Collectors.toList());
    }


    public List<EventResponse> getEventsByProduct(Long productId) {
        return eventRepository.findByProductId(productId)
                .stream()
                .map(EventResponse::from)
                .collect(Collectors.toList());
    }
}