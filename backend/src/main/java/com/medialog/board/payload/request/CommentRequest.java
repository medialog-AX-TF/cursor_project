package com.medialog.board.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommentRequest {
    @NotBlank
    private String content;

    @NotNull
    private Long postId;

    private Long parentId;

    private boolean isAnonymous;
} 