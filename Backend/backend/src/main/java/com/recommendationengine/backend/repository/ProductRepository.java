package com.recommendationengine.backend.repository;

import com.recommendationengine.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(String category);

    @Query("""
            SELECT p FROM Product p
            WHERE p.isActive = true
            ORDER BY p.createdAt DESC
            """)
    List<Product> findAllActiveProducts();

    List<Product> findByCategoryAndIsActiveTrue(String category);

    List<Product> findByBrand(String brand);

    List<Product> findByIsActiveTrue();

    Page<Product> findByIsActiveTrue(Pageable pageable);

    boolean existsByName(String name);

    @Query(value = """
            SELECT * FROM products p
            WHERE p.is_active = true
            AND (:search IS NULL OR
                p.name ILIKE CONCAT('%', :search, '%') OR
                p.brand ILIKE CONCAT('%', :search, '%') OR
                p.category ILIKE CONCAT('%', :search, '%'))
            AND (:category IS NULL OR p.category = :category)
            AND (:brand IS NULL OR p.brand = :brand)
            AND (:minPrice IS NULL OR p.price >= CAST(:minPrice AS numeric))
            AND (:maxPrice IS NULL OR p.price <= CAST(:maxPrice AS numeric))
            ORDER BY p.created_at DESC
            """,
            countQuery = """
            SELECT COUNT(*) FROM products p
            WHERE p.is_active = true
            AND (:search IS NULL OR
                p.name ILIKE CONCAT('%', :search, '%') OR
                p.brand ILIKE CONCAT('%', :search, '%') OR
                p.category ILIKE CONCAT('%', :search, '%'))
            AND (:category IS NULL OR p.category = :category)
            AND (:brand IS NULL OR p.brand = :brand)
            AND (:minPrice IS NULL OR p.price >= CAST(:minPrice AS numeric))
            AND (:maxPrice IS NULL OR p.price <= CAST(:maxPrice AS numeric))
            """,
            nativeQuery = true)
    Page<Product> searchProducts(
            @Param("search") String search,
            @Param("category") String category,
            @Param("brand") String brand,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.isActive = true ORDER BY p.category")
    List<String> findAllCategories();

    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.isActive = true ORDER BY p.brand")
    List<String> findAllBrands();
}