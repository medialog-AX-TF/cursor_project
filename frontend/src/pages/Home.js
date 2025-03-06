import React from 'react';

const Home = () => {
  return (
    <div className="container">
      <header>
        <h1>게시판 프로젝트</h1>
        <p>React와 Spring Boot로 구현된 게시판 프로젝트입니다.</p>
      </header>
      
      <section className="features">
        <h2>주요 기능</h2>
        <div className="feature-grid">
          <div className="feature-item">
            <h3>사용자 관리</h3>
            <p>회원가입, 로그인, 프로필 관리 기능을 제공합니다.</p>
          </div>
          <div className="feature-item">
            <h3>게시판 관리</h3>
            <p>다양한 카테고리의 게시판을 제공합니다.</p>
          </div>
          <div className="feature-item">
            <h3>게시글 관리</h3>
            <p>게시글 작성, 조회, 수정, 삭제 기능을 제공합니다.</p>
          </div>
          <div className="feature-item">
            <h3>댓글 관리</h3>
            <p>게시글에 댓글을 작성하고 관리할 수 있습니다.</p>
          </div>
        </div>
      </section>
      
      <section className="recent-posts">
        <h2>최근 게시글</h2>
        <p>아직 게시글이 없습니다.</p>
      </section>
    </div>
  );
};

export default Home; 