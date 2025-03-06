package com.medialog.board.repository;

import com.medialog.board.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByParentIsNullOrderByDisplayOrder();
    
    List<Category> findByParentIdOrderByDisplayOrder(Long parentId);
    
    @Query("SELECT c FROM Category c WHERE c.active = true ORDER BY c.displayOrder")
    List<Category> findAllActiveCategories();
    
    Optional<Category> findByName(String name);
} 