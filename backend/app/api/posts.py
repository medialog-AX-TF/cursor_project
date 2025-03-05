from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from ..schemas.posts import PostCreate, PostUpdate, PostResponse, PostListResponse
from ..core.auth import auth_handler
from ..db.queries.posts import PostQueries

router = APIRouter(prefix="/posts", tags=["posts"])

@router.post("", response_model=PostResponse)
async def create_post(post_data: PostCreate, user = Depends(auth_handler)):
    """새로운 게시글을 생성합니다."""
    post = PostQueries.create_post(
        title=post_data.title,
        content=post_data.content,
        user_id=user[0],
        category_id=post_data.category_id
    )
    
    if not post:
        raise HTTPException(status_code=400, detail="Could not create post")
    
    return PostResponse(
        id=post[0],
        title=post[1],
        content=post[2],
        user_id=post[3],
        category_id=post[4],
        view_count=post[5],
        created_at=post[6]
    )

@router.get("", response_model=PostListResponse)
async def get_posts(
    category_id: Optional[int] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100)
):
    """게시글 목록을 조회합니다."""
    posts, total = PostQueries.get_posts(category_id, page, per_page)
    return PostListResponse.create(posts, total, page, per_page)

@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: int):
    """특정 게시글을 조회합니다."""
    PostQueries.increment_view_count(post_id)
    post = PostQueries.get_post(post_id)
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return PostResponse(**post)

@router.put("/{post_id}", response_model=PostResponse)
async def update_post(post_id: int, post_data: PostUpdate, user = Depends(auth_handler)):
    """게시글을 수정합니다."""
    current_post = PostQueries.get_post(post_id)
    if not current_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if current_post[3] != user[0]:  # user_id 비교
        raise HTTPException(status_code=403, detail="Not authorized to update this post")
    
    update_data = post_data.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    updated_post = PostQueries.update_post(post_id, **update_data)
    if not updated_post:
        raise HTTPException(status_code=400, detail="Could not update post")
    
    return PostResponse(**updated_post)

@router.delete("/{post_id}")
async def delete_post(post_id: int, user = Depends(auth_handler)):
    """게시글을 삭제합니다."""
    current_post = PostQueries.get_post(post_id)
    if not current_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if current_post[3] != user[0] and not user[6]:  # user_id 비교 및 관리자 확인
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    
    if not PostQueries.delete_post(post_id):
        raise HTTPException(status_code=400, detail="Could not delete post")
    
    return {"message": "Post deleted successfully"} 