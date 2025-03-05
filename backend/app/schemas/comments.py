from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    post_id: int
    parent_id: Optional[int] = None

class CommentUpdate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: int
    post_id: int
    user_id: int
    username: str
    parent_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    is_deleted: bool = False
    replies: List['CommentResponse'] = []

    class Config:
        from_attributes = True

class CommentWithReplies(CommentResponse):
    replies: List[CommentResponse]

    @classmethod
    def create_tree(cls, comments: List[tuple]) -> List['CommentWithReplies']:
        """댓글 목록을 트리 구조로 변환합니다."""
        comment_dict = {}
        root_comments = []

        # 모든 댓글을 딕셔너리에 저장
        for comment in comments:
            comment_obj = cls(**comment)
            comment_dict[comment_obj.id] = comment_obj
            if comment_obj.parent_id is None:
                root_comments.append(comment_obj)
            else:
                parent = comment_dict.get(comment_obj.parent_id)
                if parent:
                    parent.replies.append(comment_obj)

        return root_comments 