package com.recommendationengine.backend.service;

import com.recommendationengine.backend.entity.*;
import com.recommendationengine.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.util.List;

@Service
public class WishlistService {
    @Autowired private WishlistItemRepository wishlistRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private ProductRepository productRepo;

    public List<WishlistItem> getWishlist(Long userId) {
        return wishlistRepo.findByUserId(userId);
    }

    public WishlistItem addToWishlist(Long userId, Long productId) {
        if (wishlistRepo.findByUserIdAndProductId(userId, productId).isPresent()) {
            return wishlistRepo.findByUserIdAndProductId(userId, productId).get();
        }
        User user = userRepo.findById(userId).orElseThrow();
        Product product = productRepo.findById(productId).orElseThrow();
        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);
        return wishlistRepo.save(item);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        wishlistRepo.deleteByUserIdAndProductId(userId, productId);
    }
}