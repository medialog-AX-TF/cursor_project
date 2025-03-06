package com.medialog.board.controller;

import com.medialog.board.model.Post;
import com.medialog.board.model.PostFile;
import com.medialog.board.payload.response.MessageResponse;
import com.medialog.board.repository.PostFileRepository;
import com.medialog.board.repository.PostRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/files")
public class FileController {
    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostFileRepository postFileRepository;

    @PostMapping("/upload/{postId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> uploadFiles(@PathVariable Long postId, @RequestParam("files") MultipartFile[] files) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (!postOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Post not found!"));
        }

        Post post = postOptional.get();
        List<PostFile> uploadedFiles = new ArrayList<>();

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            for (MultipartFile file : files) {
                String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                String fileExtension = "";
                if (fileName.contains(".")) {
                    fileExtension = fileName.substring(fileName.lastIndexOf("."));
                }
                
                // 파일명 중복 방지를 위해 UUID 사용
                String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
                Path targetLocation = uploadPath.resolve(uniqueFileName);
                
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                PostFile postFile = PostFile.builder()
                        .fileName(fileName)
                        .filePath(uniqueFileName)
                        .fileType(file.getContentType())
                        .fileSize(file.getSize())
                        .post(post)
                        .build();

                uploadedFiles.add(postFileRepository.save(postFile));
            }

            return ResponseEntity.ok(uploadedFiles);
        } catch (IOException ex) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Could not upload files!"));
        }
    }

    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<?> getFile(@PathVariable Long id, HttpServletRequest request) {
        Optional<PostFile> fileOptional = postFileRepository.findById(id);
        if (!fileOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        PostFile postFile = fileOptional.get();
        
        // 다운로드 횟수 증가
        postFileRepository.incrementDownloadCount(id);

        try {
            Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(postFile.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + postFile.getFileName() + "\"")
                    .body(resource);
        } catch (MalformedURLException ex) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid file URL!"));
        } catch (IOException ex) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Could not read file!"));
        }
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<PostFile>> getFilesByPost(@PathVariable Long postId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (!postOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        List<PostFile> files = postFileRepository.findByPost(postOptional.get());
        return ResponseEntity.ok(files);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteFile(@PathVariable Long id) {
        Optional<PostFile> fileOptional = postFileRepository.findById(id);
        if (!fileOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        PostFile postFile = fileOptional.get();

        try {
            Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(postFile.getFilePath());
            Files.deleteIfExists(filePath);
            
            postFileRepository.delete(postFile);
            
            return ResponseEntity.ok(new MessageResponse("File deleted successfully!"));
        } catch (IOException ex) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Could not delete file!"));
        }
    }
} 