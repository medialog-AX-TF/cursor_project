from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, posts, comments, files

app = FastAPI(
    title="게시판 API",
    description="게시판 시스템을 위한 RESTful API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 운영 환경에서는 구체적인 도메인을 지정해야 합니다
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(auth.router)
app.include_router(posts.router)
app.include_router(comments.router)
app.include_router(files.router)

@app.get("/")
async def root():
    return {
        "message": "게시판 API 서버",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    } 