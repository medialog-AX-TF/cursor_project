/**
 * 게시판 프로젝트 - 메인 JavaScript 파일
 * 공통 기능을 담당하는 스크립트
 */

document.addEventListener('DOMContentLoaded', () => {
  // 다크 모드 토글 기능
  setupDarkModeToggle();
  
  // 모바일 메뉴 토글 기능
  setupMobileMenu();
  
  // 사용자 메뉴 드롭다운
  setupUserMenu();
});

/**
 * 다크 모드 토글 기능 설정
 */
function setupDarkModeToggle() {
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  if (!darkModeToggle) return;
  
  // 사용자 설정 또는 시스템 설정에 따라 초기 다크 모드 상태 설정
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedDarkMode = localStorage.getItem('darkMode');
  
  if (savedDarkMode === 'true' || (savedDarkMode === null && prefersDarkMode)) {
    document.documentElement.classList.add('dark-mode');
    darkModeToggle.setAttribute('aria-checked', 'true');
  }
  
  darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
    const isDarkMode = document.documentElement.classList.contains('dark-mode');
    darkModeToggle.setAttribute('aria-checked', isDarkMode.toString());
    localStorage.setItem('darkMode', isDarkMode.toString());
  });
}

/**
 * 모바일 메뉴 토글 기능 설정
 */
function setupMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (!mobileMenuToggle || !mainNav) return;
  
  mobileMenuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    const isExpanded = mainNav.classList.contains('active');
    mobileMenuToggle.setAttribute('aria-expanded', isExpanded.toString());
  });
  
  // 화면 크기가 변경될 때 모바일 메뉴 상태 초기화
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * 사용자 메뉴 드롭다운 설정
 */
function setupUserMenu() {
  const userProfile = document.querySelector('.user-profile');
  const userDropdown = document.querySelector('.user-dropdown');
  
  if (!userProfile || !userDropdown) return;
  
  userProfile.addEventListener('click', (e) => {
    e.preventDefault();
    userDropdown.classList.toggle('active');
  });
  
  // 외부 클릭 시 드롭다운 닫기
  document.addEventListener('click', (e) => {
    if (!userProfile.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove('active');
    }
  });
}

/**
 * 알림 메시지 표시
 * @param {string} message - 표시할 메시지
 * @param {string} type - 알림 유형 (success, error, warning, info)
 * @param {number} duration - 표시 시간 (밀리초)
 */
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  const container = document.querySelector('.notification-container') || createNotificationContainer();
  container.appendChild(notification);
  
  // 애니메이션 효과
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // 자동 제거
  setTimeout(() => {
    notification.classList.remove('show');
    notification.addEventListener('transitionend', () => {
      notification.remove();
      if (container.children.length === 0) {
        container.remove();
      }
    });
  }, duration);
}

/**
 * 알림 컨테이너 생성
 * @returns {HTMLElement} 생성된 알림 컨테이너
 */
function createNotificationContainer() {
  const container = document.createElement('div');
  container.className = 'notification-container';
  document.body.appendChild(container);
  return container;
}

// 전역 함수로 노출
window.showNotification = showNotification; 