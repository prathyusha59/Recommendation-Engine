package com.recommendationengine.backend.controller;

import com.recommendationengine.backend.dto.WidgetInteractionRequest;
import com.recommendationengine.backend.repository.UserRepository;
import com.recommendationengine.backend.service.WidgetInteractionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/widget-interactions")
@RequiredArgsConstructor
public class WidgetInteractionController {

    private final WidgetInteractionService widgetInteractionService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<String> trackInteraction(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody WidgetInteractionRequest request) {

        Long userId = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        widgetInteractionService.trackInteraction(userId, request);
        return ResponseEntity.ok("Interaction tracked successfully");
    }
}