# Cursor 를 활용한 게시판 구축 프로젝트 (Board Construction Project)

## 프로젝트 개요

이 프로젝트는 사용자들이 게시글을 작성하고, 댓글을 달고, 파일을 공유할 수 있는 웹 기반 게시판 시스템을 구축하는 것을 목표로 합니다. 이 시스템은 사용자 인증, 권한 관리, 게시글 및 댓글 CRUD 기능, 파일 업로드/다운로드, 검색 기능 등을 제공합니다.

## 기술 스택

- **프론트엔드**: React
- **백엔드**: Spring Boot
- **데이터베이스**: PostgreSQL
- **인증**: JWT (JSON Web Tokens)
- **파일 저장소**: AWS S3 또는 로컬 파일 시스템
- **배포**: Docker, AWS/GCP/Azure

## 주요 기능

- 사용자 관리 (회원가입, 로그인, 프로필 관리)
- 게시판 관리 (카테고리 생성, 수정, 삭제)
- 게시글 관리 (작성, 조회, 수정, 삭제)
- 댓글 관리 (작성, 조회, 수정, 삭제)
- 파일 첨부 기능
- 검색 기능
- 알림 기능
- 관리자 대시보드

## 설치 및 실행 방법

### 사전 요구사항

- Java 17 이상
- Node.js (v14 이상)
- PostgreSQL
- npm 또는 yarn

### 설치 방법

1. 저장소 클론
   ```bash
   git clone https://github.com/medialog-AX-TF/cursor_project.git
   cd cursor_project
   ```

2. 백엔드 설정
   ```bash
   # 백엔드 디렉토리로 이동
   cd backend
   
   # Maven으로 의존성 설치 및 빌드
   ./mvnw clean install
   
   # 애플리케이션 실행
   ./mvnw spring-boot:run
   ```

3. 프론트엔드 설정
   ```bash
   # 프론트엔드 디렉토리로 이동
   cd ../frontend
   
   # 의존성 설치
   npm install
   
   # 개발 서버 실행
   npm start
   ```

4. 데이터베이스 설정
   - PostgreSQL 데이터베이스 생성
   - `application.properties` 또는 `application.yml` 파일에서 데이터베이스 연결 정보 설정
   ```
   spring.datasource.url=jdbc:postgresql://localhost:5432/cursor
   spring.datasource.username=root
   spring.datasource.password=****
   ```

## 프로젝트 구조

```
cursor_project/
├── frontend/                # 프론트엔드 코드 (React)
│   ├── public/              # 정적 파일
│   ├── src/                 # 소스 코드
│   │   ├── components/      # 리액트 컴포넌트
│   │   ├── pages/           # 페이지 컴포넌트
│   │   ├── services/        # API 서비스
│   │   ├── utils/           # 유틸리티 함수
│   │   └── App.js           # 메인 앱 컴포넌트
│   └── package.json         # 프론트엔드 의존성
├── backend/                 # 백엔드 코드 (Spring Boot)
│   ├── src/                 # 소스 코드
│   │   ├── main/
│   │   │   ├── java/        # Java 소스 코드
│   │   │   │   ├── controller/ # 컨트롤러
│   │   │   │   ├── model/      # 데이터 모델
│   │   │   │   ├── repository/ # 데이터 접근 계층
│   │   │   │   ├── service/    # 비즈니스 로직
│   │   │   │   ├── config/     # 설정 클래스
│   │   │   │   └── util/       # 유틸리티 클래스
│   │   │   └── resources/  # 리소스 파일
│   │   └── test/           # 테스트 코드
│   └── pom.xml             # Maven 의존성
├── .gitignore              # Git 무시 파일
├── docker-compose.yml      # Docker 구성 파일
└── README.md               # 프로젝트 설명
```

## 기여 방법

1. 이 저장소를 포크합니다.
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`).
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`).
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`).
5. Pull Request를 생성합니다.

## 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 연락처

프로젝트 관리자 - [이메일 주소](mailto:your.email@example.com)

프로젝트 링크: [https://github.com/medialog-AX-TF/cursor_project](https://github.com/medialog-AX-TF/cursor_project) 
