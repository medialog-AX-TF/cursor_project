import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/api/auth.service';

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = authService.getCurrentUser();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    setCurrentUser(user);
  }, [navigate]);
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  
  return (
    <div className="container">
      <h2>내 프로필</h2>
      
      {currentUser ? (
        <div className="profile-container">
          <div className="profile-info">
            <div className="profile-header">
              <div className="profile-avatar">
                {currentUser.profileImageUrl ? (
                  <img src={currentUser.profileImageUrl} alt="프로필 이미지" />
                ) : (
                  <div className="avatar-placeholder">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="profile-details">
                <h3>{currentUser.username}</h3>
                <p>{currentUser.email}</p>
                <p>
                  권한: {currentUser.roles.map(role => {
                    switch(role) {
                      case 'ROLE_ADMIN':
                        return '관리자';
                      case 'ROLE_MODERATOR':
                        return '중재자';
                      default:
                        return '일반 사용자';
                    }
                  }).join(', ')}
                </p>
              </div>
            </div>
            
            <div className="profile-actions">
              <button className="btn btn-primary">프로필 수정</button>
              <button className="btn btn-danger" onClick={handleLogout}>로그아웃</button>
            </div>
          </div>
          
          <div className="profile-activity">
            <h3>내 활동</h3>
            
            <div className="activity-tabs">
              <button className="tab-button active">내가 쓴 글</button>
              <button className="tab-button">내가 쓴 댓글</button>
              <button className="tab-button">내 북마크</button>
            </div>
            
            <div className="activity-content">
              <p>아직 활동 내역이 없습니다.</p>
            </div>
          </div>
        </div>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
};

export default Profile; 