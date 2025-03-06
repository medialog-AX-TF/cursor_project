package com.medialog.board.repository;

import com.medialog.board.model.Category;
import com.medialog.board.model.Post;
import com.medialog.board.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByCategoryOrderByCreatedAtDesc(Category category, Pageable pageable);
    
    Page<Post> findByAuthorOrderByCreatedAtDesc(User author, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.title LIKE %:keyword% OR p.content LIKE %:keyword%")
    Page<Post> searchByTitleOrContent(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT p FROM Post p JOIN p.tags t WHERE t = :tag")
    Page<Post> findByTag(@Param("tag") String tag, Pageable pageable);
    
    @Modifying
    @Query("UPDATE Post p SET p.viewCount = p.viewCount + 1 WHERE p.id = :id")
    void incrementViewCount(@Param("id") Long id);
    
    @Modifying
    @Query("UPDATE Post p SET p.likeCount = p.likeCount + 1 WHERE p.id = :id")
    void incrementLikeCount(@Param("id") Long id);
    
    @Modifying
    @Query("UPDATE Post p SET p.dislikeCount = p.dislikeCount + 1 WHERE p.id = :id")
    void incrementDislikeCount(@Param("id") Long id);
    
    List<Post> findTop10ByOrderByViewCountDesc();
    
    List<Post> findTop10ByOrderByCreatedAtDesc();
} 