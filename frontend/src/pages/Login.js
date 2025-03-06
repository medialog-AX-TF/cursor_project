import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    setMessage('');
    setLoading(true);
    
    // 여기에 로그인 API 호출 로직 추가
    console.log('Login attempt with:', { username, password });
    
    // 임시 로그인 성공 처리
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>로그인</h2>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">사용자명</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </div>
          
          {message && (
            <div className="alert alert-danger">
              {message}
            </div>
          )}
        </form>
        
        <div className="form-footer">
          <p>
            계정이 없으신가요? <a href="/register">회원가입</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 