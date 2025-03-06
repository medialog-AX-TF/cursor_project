package com.medialog.board.controller;

import com.medialog.board.model.Category;
import com.medialog.board.model.Post;
import com.medialog.board.model.User;
import com.medialog.board.payload.request.PostRequest;
import com.medialog.board.payload.response.MessageResponse;
import com.medialog.board.repository.CategoryRepository;
import com.medialog.board.repository.PostRepository;
import com.medialog.board.repository.UserRepository;
import com.medialog.board.security.services.UserDetailsImpl;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<Page<Post>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<Post> posts = postRepository.findAll(pageable);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<Post>> getPostsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
        if (!categoryOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.findByCategoryOrderByCreatedAtDesc(categoryOptional.get(), pageable);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Post>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.searchByTitleOrContent(keyword, pageable);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<Page<Post>> getPostsByTag(
            @PathVariable String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.findByTag(tag, pageable);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Post>> getPopularPosts() {
        List<Post> posts = postRepository.findTop10ByOrderByViewCountDesc();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Post>> getRecentPosts() {
        List<Post> posts = postRepository.findTop10ByOrderByCreatedAtDesc();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (!postOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // 조회수 증가
        postRepository.incrementViewCount(id);

        return ResponseEntity.ok(postOptional.get());
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> createPost(@Valid @RequestBody PostRequest postRequest) {
        // 현재 인증된 사용자 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }
        
        Optional<Category> categoryOptional = categoryRepository.findById(postRequest.getCategoryId());
        if (!categoryOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Category not found!"));
        }
        
        Post post = Post.builder()
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .author(userOptional.get())
                .category(categoryOptional.get())
                .tags(new HashSet<>(postRequest.getTags()))
                .isPrivate(postRequest.isPrivate())
                .publishedAt(LocalDateTime.now())
                .build();
        
        postRepository.save(post);
        
        return ResponseEntity.ok(new MessageResponse("Post created successfully!"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @Valid @RequestBody PostRequest postRequest) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (!postOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Post post = postOptional.get();
        
        // 현재 인증된 사용자 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // 작성자 또는 관리자만 수정 가능
        if (!post.getAuthor().getId().equals(userDetails.getId()) && 
                !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: You don't have permission to update this post!"));
        }
        
        Optional<Category> categoryOptional = categoryRepository.findById(postRequest.getCategoryId());
        if (!categoryOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Category not found!"));
        }
        
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setCategory(categoryOptional.get());
        post.setTags(new HashSet<>(postRequest.getTags()));
        post.setPrivate(postRequest.isPrivate());
        
        postRepository.save(post);
        
        return ResponseEntity.ok(new MessageResponse("Post updated successfully!"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (!postOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Post post = postOptional.get();
        
        // 현재 인증된 사용자 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // 작성자 또는 관리자만 삭제 가능
        if (!post.getAuthor().getId().equals(userDetails.getId()) && 
                !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: You don't have permission to delete this post!"));
        }
        
        postRepository.delete(post);
        
        return ResponseEntity.ok(new MessageResponse("Post deleted successfully!"));
    }

    @PostMapping("/{id}/like")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> likePost(@PathVariable Long id) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        postRepository.incrementLikeCount(id);
        
        return ResponseEntity.ok(new MessageResponse("Post liked successfully!"));
    }

    @PostMapping("/{id}/dislike")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> dislikePost(@PathVariable Long id) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        postRepository.incrementDislikeCount(id);
        
        return ResponseEntity.ok(new MessageResponse("Post disliked successfully!"));
    }
} 