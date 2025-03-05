from datetime import datetime, timedelta
from typing import Optional
import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from ..db.queries.users import UserQueries
import os
from dotenv import load_dotenv

load_dotenv()

# 비밀번호 해싱을 위한 설정
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """일반 비밀번호와 해시된 비밀번호를 비교합니다."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """비밀번호를 해시화합니다."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """JWT 토큰을 생성합니다."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str):
    """JWT 토큰을 디코딩합니다."""
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded_token if decoded_token["exp"] >= datetime.utcnow().timestamp() else None
    except:
        return None

class AuthHandler:
    async def __call__(self, credentials: HTTPAuthorizationCredentials = Security(security)):
        """토큰 검증과 사용자 인증을 처리합니다."""
        token = credentials.credentials
        decoded_token = decode_token(token)
        if decoded_token is None:
            raise HTTPException(status_code=401, detail="Invalid token or expired token.")
        
        user = UserQueries.get_user_by_username(decoded_token['sub'])
        if not user:
            raise HTTPException(status_code=401, detail="User not found.")
        
        if not user[5]:  # is_active 필드
            raise HTTPException(status_code=401, detail="Inactive user.")
        
        return user

auth_handler = AuthHandler() 