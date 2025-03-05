from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..schemas.comments import CommentCreate, CommentUpdate, CommentResponse, CommentWithReplies
from ..core.auth import auth_handler
from ..db.queries.comments import CommentQueries

router = APIRouter(prefix="/comments", tags=["comments"])

@router.post("", response_model=CommentResponse)
async def create_comment(comment_data: CommentCreate, user = Depends(auth_handler)):
    """새로운 댓글을 생성합니다."""
    comment = CommentQueries.create_comment(
        content=comment_data.content,
        user_id=user[0],
        post_id=comment_data.post_id,
        parent_id=comment_data.parent_id
    )
    
    if not comment:
        raise HTTPException(status_code=400, detail="Could not create comment")
    
    return CommentResponse(
        id=comment[0],
        content=comment[1],
        user_id=comment[2],
        post_id=comment[3],
        parent_id=comment[4],
        created_at=comment[5]
    )

@router.get("/post/{post_id}", response_model=List[CommentWithReplies])
async def get_comments(post_id: int):
    """게시글의 모든 댓글을 조회합니다."""
    comments = CommentQueries.get_comments_by_post(post_id)
    return CommentWithReplies.create_tree(comments)

@router.put("/{comment_id}", response_model=CommentResponse)
async def update_comment(comment_id: int, comment_data: CommentUpdate, user = Depends(auth_handler)):
    """댓글을 수정합니다."""
    current_comment = CommentQueries.get_comment(comment_id)
    if not current_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if current_comment[2] != user[0]:  # user_id 비교
        raise HTTPException(status_code=403, detail="Not authorized to update this comment")
    
    updated_comment = CommentQueries.update_comment(comment_id, comment_data.content)
    if not updated_comment:
        raise HTTPException(status_code=400, detail="Could not update comment")
    
    return CommentResponse(**updated_comment)

@router.delete("/{comment_id}")
async def delete_comment(comment_id: int, user = Depends(auth_handler)):
    """댓글을 삭제합니다."""
    current_comment = CommentQueries.get_comment(comment_id)
    if not current_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if current_comment[2] != user[0] and not user[6]:  # user_id 비교 및 관리자 확인
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")
    
    if not CommentQueries.delete_comment(comment_id):
        raise HTTPException(status_code=400, detail="Could not delete comment")
    
    return {"message": "Comment deleted successfully"} 