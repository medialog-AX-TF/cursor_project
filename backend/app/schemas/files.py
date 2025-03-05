from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FileResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    file_path: str
    file_size: int
    mime_type: str
    post_id: Optional[int]
    user_id: int
    username: str
    created_at: datetime

    class Config:
        from_attributes = True

class FileUploadResponse(BaseModel):
    message: str
    file: FileResponse 