# 게시판 프로젝트 프롬프트 모음

이 디렉토리에는 게시판 프로젝트 개발을 위한 AI 어시스턴트 프롬프트 파일들이 포함되어 있습니다. 각 스프린트별, 기능별로 구분되어 있으며, 개발자 A와 개발자 B가 AI 어시스턴트에게 요청할 수 있는 프롬프트 템플릿을 제공합니다.

## 사용 방법

1. 개발하려는 기능에 해당하는 프롬프트 파일을 찾습니다.
2. 프롬프트 내용을 복사하여 AI 어시스턴트에게 전달합니다.
3. 프롬프트 내의 `[사용 기술 스택: ...]`, `[프로젝트 구조 설명]` 등의 부분을 실제 프로젝트 정보로 대체합니다.
4. AI 어시스턴트의 응답을 받아 개발을 진행합니다.

## 스프린트 1: 사용자 관리 및 게시판 기본 구조

### 백엔드 개발 프롬프트
- [사용자 관리 기능 백엔드 개발](sprint1_user_management_backend.md)
- [게시판 관리 기능 백엔드 개발](sprint1_board_management_backend.md)

### 프론트엔드 개발 프롬프트
- [공통 컴포넌트 개발](sprint1_frontend_common_components.md)
- [사용자 관리 페이지 개발](sprint1_frontend_user_pages.md)

## 스프린트 2: 게시글 및 댓글 기능 개발

### 백엔드 개발 프롬프트
- [게시글 관리 기능 백엔드 개발](sprint2_post_management_backend.md)
- [댓글 관리 기능 백엔드 개발](sprint2_comment_management_backend.md)

### 프론트엔드 개발 프롬프트
- [게시글 페이지 개발](sprint2_frontend_post_pages.md)
- [댓글 컴포넌트 개발](sprint2_frontend_comment_components.md)

## 스프린트 3: 파일 관리 및 검색 기능 개발

### 백엔드 개발 프롬프트
- [파일 관리 기능 백엔드 개발](sprint3_file_management_backend.md)
- [검색 및 알림 기능 백엔드 개발](sprint3_search_notification_backend.md)

### 프론트엔드 개발 프롬프트
- [파일 관리 컴포넌트 개발](sprint3_frontend_file_components.md)
- [검색 및 알림 페이지 개발](sprint3_frontend_search_notification.md)

## 스프린트 4: 관리자 기능 및 API 개발

### 백엔드 개발 프롬프트
- [관리자 기능 백엔드 개발](sprint4_admin_backend.md)
- [관리자 콘텐츠 관리 기능 백엔드 개발](sprint4_admin_content_backend.md)

### 프론트엔드 개발 프롬프트
- [관리자 페이지 개발](sprint4_frontend_admin.md)
- [관리자 콘텐츠 관리 페이지 개발](sprint4_frontend_admin_content.md)

## 스프린트 5: 통합, 테스트 및 배포

### 통합 및 테스트 작업 프롬프트
- [통합 및 테스트 작업](sprint5_integration_testing.md)
- [테스트 및 문서화 작업](sprint5_testing_documentation.md)

## 프롬프트 커스터마이징

각 프롬프트는 기본 템플릿으로 제공되며, 실제 프로젝트 상황에 맞게 수정하여 사용할 수 있습니다. 다음과 같은 부분을 프로젝트에 맞게 수정하세요:

- 사용 기술 스택 정보
- 프로젝트 구조 설명
- 특정 요구사항 추가 또는 수정
- 기존 코드와의 통합 방법 설명

## 주의사항

- AI 어시스턴트의 응답은 항상 검토 후 사용하세요.
- 보안 관련 코드는 특히 주의 깊게 검토하세요.
- 생성된 코드가 프로젝트의 코딩 스타일과 일관성을 유지하는지 확인하세요.
- 필요에 따라 프롬프트를 더 구체적으로 작성하여 더 정확한 결과를 얻을 수 있습니다. 