package com.recommendationengine.backend.service;

import com.recommendationengine.backend.dto.WidgetInteractionRequest;
import com.recommendationengine.backend.entity.Product;
import com.recommendationengine.backend.entity.User;
import com.recommendationengine.backend.entity.WidgetInteraction;
import com.recommendationengine.backend.repository.ProductRepository;
import com.recommendationengine.backend.repository.UserRepository;
import com.recommendationengine.backend.repository.WidgetInteractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WidgetInteractionService {

    private final WidgetInteractionRepository widgetInteractionRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public void trackInteraction(Long userId, WidgetInteractionRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        WidgetInteraction interaction = new WidgetInteraction();
        interaction.setUser(user);
        interaction.setProduct(product);
        interaction.setWidgetType(request.getWidgetType().toUpperCase());
        interaction.setInteractionType(request.getInteractionType().toUpperCase());
        interaction.setSessionId(request.getSessionId());
        interaction.setCreatedAt(LocalDateTime.now());

        widgetInteractionRepository.save(interaction);
    }
}