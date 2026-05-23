package com.recommendationengine.backend.controller;

import com.recommendationengine.backend.dto.EventRequest;
import com.recommendationengine.backend.dto.EventResponse;
import com.recommendationengine.backend.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.recommendationengine.backend.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<EventResponse> trackEvent(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody EventRequest request) {

        Long userId = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        return ResponseEntity.ok(eventService.trackEvent(userId, request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<EventResponse>> getMyEvents(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        return ResponseEntity.ok(eventService.getEventsByUser(userId));
    }

    @GetMapping("/my/type/{eventType}")
    public ResponseEntity<List<EventResponse>> getMyEventsByType(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String eventType) {

        Long userId = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        return ResponseEntity.ok(eventService.getEventsByUserAndType(userId, eventType));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<EventResponse>> getEventsByProduct(
            @PathVariable Long productId) {
        return ResponseEntity.ok(eventService.getEventsByProduct(productId));
    }
}