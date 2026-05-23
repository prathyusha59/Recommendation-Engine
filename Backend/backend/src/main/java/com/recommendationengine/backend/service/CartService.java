package com.recommendationengine.backend.service;

import com.recommendationengine.backend.entity.*;
import com.recommendationengine.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    @Autowired private CartItemRepository cartRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private ProductRepository productRepo;

    public List<CartItem> getCart(Long userId) {
        return cartRepo.findByUserId(userId);
    }

    public CartItem addToCart(Long userId, Long productId, Integer quantity) {
        Optional<CartItem> existing = cartRepo.findByUserIdAndProductId(userId, productId);
        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartRepo.save(item);
        }
        User user = userRepo.findById(userId).orElseThrow();
        Product product = productRepo.findById(productId).orElseThrow();
        CartItem item = new CartItem();
        item.setUser(user);
        item.setProduct(product);
        item.setQuantity(quantity);
        return cartRepo.save(item);
    }

    @Transactional
    public void removeFromCart(Long userId, Long productId) {
        cartRepo.deleteByUserIdAndProductId(userId, productId);
    }
}