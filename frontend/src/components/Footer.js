import React from 'react';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} 게시판 프로젝트. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">이용약관</a>
          <a href="#">개인정보처리방침</a>
          <a href="#">문의하기</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 