from pydantic import BaseModel, constr
from typing import Optional, List
from datetime import datetime

class PostBase(BaseModel):
    title: constr(min_length=1, max_length=200)
    content: str
    category_id: int

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[constr(min_length=1, max_length=200)] = None
    content: Optional[str] = None
    category_id: Optional[int] = None

class PostResponse(PostBase):
    id: int
    user_id: int
    username: str
    category_name: str
    view_count: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool = False

    class Config:
        from_attributes = True

class PostListResponse(BaseModel):
    total: int
    items: List[PostResponse]
    page: int
    per_page: int
    total_pages: int

    @classmethod
    def create(cls, posts: List[tuple], total: int, page: int, per_page: int):
        return cls(
            total=total,
            items=[PostResponse(**post) for post in posts],
            page=page,
            per_page=per_page,
            total_pages=((total - 1) // per_page) + 1
        ) 