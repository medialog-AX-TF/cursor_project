package com.medialog.board.repository;

import com.medialog.board.model.Comment;
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
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostAndParentIsNullOrderByCreatedAtAsc(Post post);
    
    List<Comment> findByParentIdOrderByCreatedAtAsc(Long parentId);
    
    Page<Comment> findByAuthorOrderByCreatedAtDesc(User author, Pageable pageable);
    
    @Modifying
    @Query("UPDATE Comment c SET c.likeCount = c.likeCount + 1 WHERE c.id = :id")
    void incrementLikeCount(@Param("id") Long id);
    
    @Modifying
    @Query("UPDATE Comment c SET c.dislikeCount = c.dislikeCount + 1 WHERE c.id = :id")
    void incrementDislikeCount(@Param("id") Long id);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId")
    long countByPostId(@Param("postId") Long postId);
} 