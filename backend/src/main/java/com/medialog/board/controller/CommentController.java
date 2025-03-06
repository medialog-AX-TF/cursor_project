package com.medialog.board.controller;

import com.medialog.board.model.Comment;
import com.medialog.board.model.Post;
import com.medialog.board.model.User;
import com.medialog.board.payload.request.CommentRequest;
import com.medialog.board.payload.response.MessageResponse;
import com.medialog.board.repository.CommentRepository;
import com.medialog.board.repository.PostRepository;
import com.medialog.board.repository.UserRepository;
import com.medialog.board.security.services.UserDetailsImpl;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPost(@PathVariable Long postId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (!postOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        List<Comment> comments = commentRepository.findByPostAndParentIsNullOrderByCreatedAtAsc(postOptional.get());
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/replies/{parentId}")
    public ResponseEntity<List<Comment>> getReplies(@PathVariable Long parentId) {
        List<Comment> replies = commentRepository.findByParentIdOrderByCreatedAtAsc(parentId);
        return ResponseEntity.ok(replies);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> createComment(@Valid @RequestBody CommentRequest commentRequest) {
        // 현재 인증된 사용자 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }
        
        Optional<Post> postOptional = postRepository.findById(commentRequest.getPostId());
        if (!postOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Post not found!"));
        }
        
        Comment comment = Comment.builder()
                .content(commentRequest.getContent())
                .author(userOptional.get())
                .post(postOptional.get())
                .isAnonymous(commentRequest.isAnonymous())
                .build();
        
        // 대댓글인 경우
        if (commentRequest.getParentId() != null) {
            Optional<Comment> parentOptional = commentRepository.findById(commentRequest.getParentId());
            if (parentOptional.isPresent()) {
                comment.setParent(parentOptional.get());
            }
        }
        
        commentRepository.save(comment);
        
        return ResponseEntity.ok(new MessageResponse("Comment created successfully!"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> updateComment(@PathVariable Long id, @Valid @RequestBody CommentRequest commentRequest) {
        Optional<Comment> commentOptional = commentRepository.findById(id);
        if (!commentOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Comment comment = commentOptional.get();
        
        // 현재 인증된 사용자 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // 작성자 또는 관리자만 수정 가능
        if (!comment.getAuthor().getId().equals(userDetails.getId()) && 
                !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: You don't have permission to update this comment!"));
        }
        
        comment.setContent(commentRequest.getContent());
        comment.setAnonymous(commentRequest.isAnonymous());
        
        commentRepository.save(comment);
        
        return ResponseEntity.ok(new MessageResponse("Comment updated successfully!"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        Optional<Comment> commentOptional = commentRepository.findById(id);
        if (!commentOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Comment comment = commentOptional.get();
        
        // 현재 인증된 사용자 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // 작성자 또는 관리자만 삭제 가능
        if (!comment.getAuthor().getId().equals(userDetails.getId()) && 
                !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: You don't have permission to delete this comment!"));
        }
        
        // 소프트 삭제 (실제로 삭제하지 않고 삭제 표시만 함)
        comment.setDeleted(true);
        commentRepository.save(comment);
        
        return ResponseEntity.ok(new MessageResponse("Comment deleted successfully!"));
    }

    @PostMapping("/{id}/like")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> likeComment(@PathVariable Long id) {
        if (!commentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        commentRepository.incrementLikeCount(id);
        
        return ResponseEntity.ok(new MessageResponse("Comment liked successfully!"));
    }

    @PostMapping("/{id}/dislike")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> dislikeComment(@PathVariable Long id) {
        if (!commentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        commentRepository.incrementDislikeCount(id);
        
        return ResponseEntity.ok(new MessageResponse("Comment disliked successfully!"));
    }
} 