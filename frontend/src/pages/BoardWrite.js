import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import categoryService from '../services/api/category.service';
import postService from '../services/api/post.service';
import fileService from '../services/api/file.service';
import authService from '../services/api/auth.service';

const BoardWrite = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const isLoggedIn = authService.isLoggedIn();
  
  // 로그인 상태 확인
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  
  // 카테고리 목록 가져오기
  useEffect(() => {
    categoryService.getAllCategories()
      .then(response => {
        setCategories(response.data);
        if (response.data.length > 0) {
          setCategoryId(response.data[0].id);
        }
      })
      .catch(error => {
        setError('카테고리를 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching categories:', error);
      });
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !categoryId) {
      setError('제목, 내용, 카테고리는 필수 입력 항목입니다.');
      return;
    }
    
    setLoading(true);
    
    const post = {
      title: title,
      content: content,
      categoryId: categoryId,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      isPrivate: isPrivate
    };
    
    postService.createPost(post)
      .then(response => {
        // 파일이 있는 경우 업로드
        if (files.length > 0) {
          const postId = response.data.id || response.data.message.match(/\d+/)[0]; // ID 추출
          return fileService.uploadFiles(postId, files);
        }
        return response;
      })
      .then(response => {
        navigate('/boards');
      })
      .catch(error => {
        setError('게시글 작성 중 오류가 발생했습니다.');
        console.error('Error creating post:', error);
        setLoading(false);
      });
  };
  
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };
  
  return (
    <div className="container">
      <h2>게시글 작성</h2>
      
      {error && <p className="error-message">{error}</p>}
      
      <form className="board-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">카테고리</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">카테고리 선택</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength="200"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="tags">태그 (쉼표로 구분)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="예: 태그1, 태그2, 태그3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="files">첨부 파일</label>
          <input
            type="file"
            id="files"
            multiple
            onChange={handleFileChange}
          />
        </div>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            비공개 글
          </label>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '저장 중...' : '저장'}
          </button>
          <button type="button" className="btn btn-danger" onClick={() => navigate('/boards')}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardWrite; 