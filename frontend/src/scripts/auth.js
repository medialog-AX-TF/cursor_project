/**
 * 게시판 프로젝트 - 인증 관련 JavaScript 파일
 * 로그인, 회원가입 등 인증 관련 기능을 담당하는 스크립트
 */

document.addEventListener('DOMContentLoaded', () => {
  // 로그인 폼 처리
  setupLoginForm();
  
  // 회원가입 폼 처리
  setupRegisterForm();
  
  // 비밀번호 강도 측정
  setupPasswordStrengthMeter();
  
  // 이메일 중복 확인
  setupEmailCheck();
  
  // 닉네임 중복 확인
  setupNicknameCheck();
});

/**
 * 로그인 폼 설정
 */
function setupLoginForm() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = loginForm.querySelector('#email').value;
    const password = loginForm.querySelector('#password').value;
    const rememberMe = loginForm.querySelector('#remember-me')?.checked || false;
    
    if (!validateEmail(email)) {
      showNotification('유효한 이메일 주소를 입력해주세요.', 'error');
      return;
    }
    
    if (!password) {
      showNotification('비밀번호를 입력해주세요.', 'error');
      return;
    }
    
    try {
      // 실제 구현에서는 서버에 로그인 요청을 보냄
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, rememberMe })
      // });
      
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.message || '로그인에 실패했습니다.');
      // }
      
      // 로그인 성공 시 홈페이지로 이동
      showNotification('로그인에 성공했습니다.', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });
  
  // 소셜 로그인 버튼 이벤트 처리
  const socialButtons = loginForm.querySelectorAll('.btn-social');
  socialButtons.forEach(button => {
    button.addEventListener('click', () => {
      const provider = button.classList.contains('btn-google') ? 'google' :
                       button.classList.contains('btn-facebook') ? 'facebook' :
                       button.classList.contains('btn-github') ? 'github' : '';
      
      if (provider) {
        // 실제 구현에서는 소셜 로그인 처리
        // window.location.href = `/api/auth/${provider}`;
        showNotification(`${provider} 로그인은 아직 구현되지 않았습니다.`, 'info');
      }
    });
  });
}

/**
 * 회원가입 폼 설정
 */
function setupRegisterForm() {
  const registerForm = document.getElementById('register-form');
  if (!registerForm) return;
  
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = registerForm.querySelector('#email').value;
    const password = registerForm.querySelector('#password').value;
    const passwordConfirm = registerForm.querySelector('#password-confirm').value;
    const name = registerForm.querySelector('#name').value;
    const nickname = registerForm.querySelector('#nickname').value;
    const termsAgreed = registerForm.querySelector('#terms')?.checked || false;
    const privacyAgreed = registerForm.querySelector('#privacy')?.checked || false;
    
    // 유효성 검사
    if (!validateEmail(email)) {
      showNotification('유효한 이메일 주소를 입력해주세요.', 'error');
      return;
    }
    
    if (!validatePassword(password)) {
      showNotification('비밀번호는 8자 이상, 대소문자, 숫자, 특수문자를 포함해야 합니다.', 'error');
      return;
    }
    
    if (password !== passwordConfirm) {
      showNotification('비밀번호가 일치하지 않습니다.', 'error');
      return;
    }
    
    if (!name) {
      showNotification('이름을 입력해주세요.', 'error');
      return;
    }
    
    if (!nickname) {
      showNotification('닉네임을 입력해주세요.', 'error');
      return;
    }
    
    if (!termsAgreed || !privacyAgreed) {
      showNotification('이용약관과 개인정보처리방침에 동의해주세요.', 'error');
      return;
    }
    
    try {
      // 실제 구현에서는 서버에 회원가입 요청을 보냄
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, name, nickname })
      // });
      
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.message || '회원가입에 실패했습니다.');
      // }
      
      // 회원가입 성공 시 로그인 페이지로 이동
      showNotification('회원가입에 성공했습니다.', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });
}

/**
 * 비밀번호 강도 측정 설정
 */
function setupPasswordStrengthMeter() {
  const passwordInput = document.getElementById('password');
  const strengthLevel = document.getElementById('password-strength-level');
  const strengthText = document.getElementById('password-strength-text');
  
  if (!passwordInput || !strengthLevel || !strengthText) return;
  
  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const strength = calculatePasswordStrength(password);
    
    // 강도에 따라 스타일 및 텍스트 변경
    strengthLevel.style.width = `${strength.percent}%`;
    strengthLevel.style.backgroundColor = strength.color;
    strengthText.textContent = strength.text;
  });
}

/**
 * 이메일 중복 확인 설정
 */
function setupEmailCheck() {
  const checkEmailButton = document.getElementById('check-email');
  if (!checkEmailButton) return;
  
  checkEmailButton.addEventListener('click', async () => {
    const emailInput = document.getElementById('email');
    const email = emailInput?.value;
    
    if (!email) {
      showNotification('이메일을 입력해주세요.', 'error');
      return;
    }
    
    if (!validateEmail(email)) {
      showNotification('유효한 이메일 주소를 입력해주세요.', 'error');
      return;
    }
    
    try {
      // 실제 구현에서는 서버에 중복 확인 요청을 보냄
      // const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
      // const data = await response.json();
      
      // if (data.exists) {
      //   showNotification('이미 사용 중인 이메일입니다.', 'error');
      // } else {
      //   showNotification('사용 가능한 이메일입니다.', 'success');
      // }
      
      // 임시 구현
      showNotification('사용 가능한 이메일입니다.', 'success');
    } catch (error) {
      showNotification('이메일 중복 확인에 실패했습니다.', 'error');
    }
  });
}

/**
 * 닉네임 중복 확인 설정
 */
function setupNicknameCheck() {
  const checkNicknameButton = document.getElementById('check-nickname');
  if (!checkNicknameButton) return;
  
  checkNicknameButton.addEventListener('click', async () => {
    const nicknameInput = document.getElementById('nickname');
    const nickname = nicknameInput?.value;
    
    if (!nickname) {
      showNotification('닉네임을 입력해주세요.', 'error');
      return;
    }
    
    try {
      // 실제 구현에서는 서버에 중복 확인 요청을 보냄
      // const response = await fetch(`/api/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`);
      // const data = await response.json();
      
      // if (data.exists) {
      //   showNotification('이미 사용 중인 닉네임입니다.', 'error');
      // } else {
      //   showNotification('사용 가능한 닉네임입니다.', 'success');
      // }
      
      // 임시 구현
      showNotification('사용 가능한 닉네임입니다.', 'success');
    } catch (error) {
      showNotification('닉네임 중복 확인에 실패했습니다.', 'error');
    }
  });
}

/**
 * 이메일 유효성 검사
 * @param {string} email - 검사할 이메일
 * @returns {boolean} 유효성 여부
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 유효성 검사
 * @param {string} password - 검사할 비밀번호
 * @returns {boolean} 유효성 여부
 */
function validatePassword(password) {
  // 8자 이상, 대소문자, 숫자, 특수문자 포함
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * 비밀번호 강도 계산
 * @param {string} password - 계산할 비밀번호
 * @returns {Object} 강도 정보 (percent, color, text)
 */
function calculatePasswordStrength(password) {
  if (!password) {
    return { percent: 0, color: '#ddd', text: '비밀번호 강도' };
  }
  
  let strength = 0;
  
  // 길이 점수
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 15;
  
  // 복잡성 점수
  if (/[a-z]/.test(password)) strength += 10;
  if (/[A-Z]/.test(password)) strength += 10;
  if (/\d/.test(password)) strength += 10;
  if (/[@$!%*?&]/.test(password)) strength += 10;
  
  // 다양성 점수
  const uniqueChars = new Set(password).size;
  strength += Math.min(uniqueChars * 2, 20);
  
  // 강도 레벨 결정
  let color, text;
  
  if (strength < 30) {
    color = '#ef476f'; // 매우 약함
    text = '매우 약함';
  } else if (strength < 50) {
    color = '#ffd166'; // 약함
    text = '약함';
  } else if (strength < 70) {
    color = '#06d6a0'; // 보통
    text = '보통';
  } else if (strength < 90) {
    color = '#118ab2'; // 강함
    text = '강함';
  } else {
    color = '#073b4c'; // 매우 강함
    text = '매우 강함';
  }
  
  return { percent: strength, color, text };
}

// 전역 함수로 노출
window.validateEmail = validateEmail;
window.validatePassword = validatePassword; 