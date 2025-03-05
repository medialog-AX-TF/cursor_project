from fastapi import APIRouter, HTTPException, Depends
from ..schemas.users import UserCreate, UserLogin, UserResponse, TokenResponse
from ..core.auth import verify_password, get_password_hash, create_access_token, auth_handler
from ..db.queries.users import UserQueries

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    """새로운 사용자를 등록합니다."""
    # 이메일 중복 확인
    if UserQueries.get_user_by_email(user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 사용자명 중복 확인
    if UserQueries.get_user_by_username(user_data.username):
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # 비밀번호 해시화
    hashed_password = get_password_hash(user_data.password)
    
    # 사용자 생성
    user = UserQueries.create_user(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password,
        full_name=user_data.full_name
    )
    
    if not user:
        raise HTTPException(status_code=400, detail="Could not create user")
    
    return UserResponse(
        id=user[0],
        username=user[1],
        email=user[2],
        full_name=user[3],
        is_active=user[4],
        is_admin=user[5],
        created_at=user[6]
    )

@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    """사용자 로그인을 처리합니다."""
    user = UserQueries.get_user_by_username(user_data.username)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    if not verify_password(user_data.password, user[3]):  # password_hash
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    if not user[5]:  # is_active
        raise HTTPException(status_code=401, detail="Inactive user")
    
    access_token = create_access_token(data={"sub": user[1]})  # username
    return TokenResponse(access_token=access_token)

@router.get("/me", response_model=UserResponse)
async def get_current_user(user = Depends(auth_handler)):
    """현재 로그인한 사용자의 정보를 반환합니다."""
    return UserResponse(
        id=user[0],
        username=user[1],
        email=user[2],
        full_name=user[4],
        is_active=user[5],
        is_admin=user[6],
        created_at=user[7]
    ) 