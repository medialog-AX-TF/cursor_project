import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  // 임시 로그인 상태
  const isLoggedIn = false;
  
  return (
    <header className="main-header">
      <div className="container">
        <div className="logo">
          <Link to="/">게시판 프로젝트</Link>
        </div>
        
        <nav>
          <ul>
            <li><Link to="/">홈</Link></li>
            <li><Link to="/boards">게시판</Link></li>
            {isLoggedIn ? (
              <>
                <li><Link to="/profile">프로필</Link></li>
                <li><button className="btn-link">로그아웃</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login">로그인</Link></li>
                <li><Link to="/register">회원가입</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 