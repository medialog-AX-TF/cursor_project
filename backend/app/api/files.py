import os
import shutil
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import FileResponse
from typing import Optional
from ..schemas.files import FileResponse, FileUploadResponse
from ..core.auth import auth_handler
from ..db.queries.files import FileQueries
import uuid

router = APIRouter(prefix="/files", tags=["files"])

# 파일 업로드 설정
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

def save_upload_file(upload_file: UploadFile, filename: str) -> str:
    """업로드된 파일을 저장합니다."""
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    return file_path

@router.post("", response_model=FileUploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    post_id: Optional[int] = None,
    user = Depends(auth_handler)
):
    """파일을 업로드합니다."""
    # 파일 확장자 추출
    file_ext = os.path.splitext(file.filename)[1]
    # 고유한 파일명 생성
    filename = f"{uuid.uuid4()}{file_ext}"
    
    try:
        # 파일 저장
        file_path = save_upload_file(file, filename)
        
        # 파일 정보 데이터베이스에 저장
        file_info = FileQueries.create_file(
            filename=filename,
            original_filename=file.filename,
            file_path=file_path,
            file_size=os.path.getsize(file_path),
            mime_type=file.content_type,
            post_id=post_id,
            user_id=user[0]
        )
        
        if not file_info:
            # 실패 시 저장된 파일 삭제
            os.remove(file_path)
            raise HTTPException(status_code=400, detail="Could not save file information")
        
        return FileUploadResponse(
            message="File uploaded successfully",
            file=FileResponse(**file_info)
        )
        
    except Exception as e:
        # 에러 발생 시 저장된 파일 삭제
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{file_id}")
async def download_file(file_id: int):
    """파일을 다운로드합니다."""
    file_info = FileQueries.get_file(file_id)
    if not file_info:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = file_info[3]  # file_path
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found on server")
    
    return FileResponse(
        path=file_path,
        filename=file_info[2],  # original_filename
        media_type=file_info[5]  # mime_type
    )

@router.delete("/{file_id}")
async def delete_file(file_id: int, user = Depends(auth_handler)):
    """파일을 삭제합니다."""
    file_info = FileQueries.get_file(file_id)
    if not file_info:
        raise HTTPException(status_code=404, detail="File not found")
    
    if file_info[7] != user[0] and not user[6]:  # user_id 비교 및 관리자 확인
        raise HTTPException(status_code=403, detail="Not authorized to delete this file")
    
    # 데이터베이스에서 파일 정보 삭제
    deleted_file = FileQueries.delete_file(file_id)
    if not deleted_file:
        raise HTTPException(status_code=400, detail="Could not delete file")
    
    # 실제 파일 삭제
    file_path = deleted_file[1]
    if os.path.exists(file_path):
        os.remove(file_path)
    
    return {"message": "File deleted successfully"} 