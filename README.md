# 게시판 프로젝트 (Board Project)

## 프로젝트 개요
이 프로젝트는 사용자들이 게시글을 작성, 조회, 수정, 삭제할 수 있는 기본적인 게시판 시스템입니다.

## 주요 기능
- 사용자 관리
  - 회원가입
  - 로그인/로그아웃
  - 프로필 관리

- 게시글 관리
  - 게시글 작성
  - 게시글 조회
  - 게시글 수정
  - 게시글 삭제
  - 게시글 목록 페이징

- 댓글 기능
  - 댓글 작성
  - 댓글 수정/삭제

- 파일 첨부 기능
  - 이미지 업로드
  - 일반 파일 첨부

## 기술 스택
- Backend
  - Python 3.9+
  - FastAPI
  - PostgreSQL (with psycopg2)
  - Raw SQL 쿼리 사용

- Frontend
  - React
  - TypeScript
  - Tailwind CSS
  - Axios

## 개발 환경 설정
1. 필요 조건
   - Python 3.9 이상
   - Node.js 16.0 이상
   - PostgreSQL 13.0 이상

2. 설치 방법
```bash
# Backend
git clone [repository-url]
cd [project-directory]
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

3. 환경 변수 설정
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=board_db
DB_USER=your_username
DB_PASSWORD=your_password
SECRET_KEY=your_secret_key
```

4. 데이터베이스 초기화
```bash
# PostgreSQL 접속
psql -U your_username -d postgres

# 데이터베이스 생성
CREATE DATABASE board_db;

# 초기 테이블 생성 스크립트 실행
psql -U your_username -d board_db -f ./backend/db/init.sql
```

5. 실행 방법
```bash
# Backend
uvicorn main:app --reload

# Frontend
cd frontend
npm run dev
```

## API 문서
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 프로젝트 구조
```
project_A/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   │   ├── connection.py
│   │   │   └── queries/
│   │   │       ├── users.py
│   │   │       ├── posts.py
│   │   │       └── comments.py
│   │   └── schemas/
│   ├── db/
│   │   └── init.sql
│   ├── tests/
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── README.md
└── requirements.txt
```

## 라이센스
MIT License

## 기여 방법
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 

데이터베이스 스키마 설계와 초기화 SQL 스크립트를 작성해주세요. 
필요한 모든 테이블의 컬럼, 제약조건, 인덱스를 포함해주세요. 

백엔드 API 구조와 엔드포인트 설계를 해주세요.
각 API의 요청/응답 형식과 인증/인가 방식을 포함해주세요. 

FastAPI를 사용한 백엔드 코드 구현을 해주세요.
사용자 인증과 기본적인 CRUD 작업부터 시작하겠습니다. 

React와 TypeScript를 사용한 프론트엔드 구조와 
공통 컴포넌트 설계를 해주세요. 

프론트엔드 페이지 구현을 해주세요.
사용자 인증과 게시글 관련 기능부터 시작하겠습니다. 

1. API 엔드포인트 테스트 코드 작성
2. 프론트엔드 컴포넌트 단위 테스트
3. 전체 시스템 통합 테스트 


게시판 구축 프로젝트를 하려고 합니다. 당신은 리드미 파일과 요구사항 파일을 작성해 주시고  저에게 검증 받아 주세요

ORM 은 사용지 않습니다

당신이 작성한 리드미 와 요구사항을 기반으로 게시판을 구축하려면 내가 어떻게 요청하는 것이 가장 완성도 있는 게시판 구축을 할수 있나요 ?