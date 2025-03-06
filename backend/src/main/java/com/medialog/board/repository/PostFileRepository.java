package com.medialog.board.repository;

import com.medialog.board.model.Post;
import com.medialog.board.model.PostFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostFileRepository extends JpaRepository<PostFile, Long> {
    List<PostFile> findByPost(Post post);
    
    @Modifying
    @Query("UPDATE PostFile f SET f.downloadCount = f.downloadCount + 1 WHERE f.id = :id")
    void incrementDownloadCount(@Param("id") Long id);
    
    @Query("SELECT f FROM PostFile f WHERE f.fileType LIKE %:fileType%")
    List<PostFile> findByFileType(@Param("fileType") String fileType);
} 