package com.medialog.board.controller;

import com.medialog.board.model.Category;
import com.medialog.board.payload.response.MessageResponse;
import com.medialog.board.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryRepository.findAllActiveCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/root")
    public ResponseEntity<List<Category>> getRootCategories() {
        List<Category> rootCategories = categoryRepository.findByParentIsNullOrderByDisplayOrder();
        return ResponseEntity.ok(rootCategories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(category -> ResponseEntity.ok().body(category))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/subcategories")
    public ResponseEntity<List<Category>> getSubcategories(@PathVariable Long id) {
        List<Category> subcategories = categoryRepository.findByParentIdOrderByDisplayOrder(id);
        return ResponseEntity.ok(subcategories);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        categoryRepository.save(category);
        return ResponseEntity.ok(new MessageResponse("Category created successfully!"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category categoryRequest) {
        return categoryRepository.findById(id)
                .map(category -> {
                    category.setName(categoryRequest.getName());
                    category.setDescription(categoryRequest.getDescription());
                    category.setParent(categoryRequest.getParent());
                    category.setDisplayOrder(categoryRequest.getDisplayOrder());
                    category.setActive(categoryRequest.isActive());
                    categoryRepository.save(category);
                    return ResponseEntity.ok(new MessageResponse("Category updated successfully!"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(category -> {
                    category.setActive(false);
                    categoryRepository.save(category);
                    return ResponseEntity.ok(new MessageResponse("Category deleted successfully!"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 