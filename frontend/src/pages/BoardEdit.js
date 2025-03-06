import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import categoryService from '../services/api/category.service';
import postService from '../services/api/post.service';
import fileService from '../services/api/file.service';
import authService from '../services/api/auth.service';

const BoardEdit = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const isLoggedIn = authService.isLoggedIn();
  const isAdmin = authService.isAdmin();
  
  // 로그인 상태 확인
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  
  // 게시글 정보 및 카테고리 목록 가져오기
  useEffect(() => {
    setLoading(true);
    
    // 카테고리 목록 가져오기
    categoryService.getAllCategories()
      .then(categoryResponse => {
        setCategories(categoryResponse.data);
        
        // 게시글 정보 가져오기
        return postService.getPostById(id);
      })
      .then(postResponse => {
        const post = postResponse.data;
        
        // 현재 사용자가 작성자이거나 관리자인지 확인
        if (currentUser && (post.author.id === currentUser.id || isAdmin)) {
          setTitle(post.title);
          setContent(post.content);
          setCategoryId(post.category.id);
          setIsPrivate(post.isPrivate);
          
          // 태그 설정
          if (post.tags && post.tags.length > 0) {
            setTags(post.tags.join(', '));
          }
          
          // 첨부 파일 가져오기
          return fileService.getFilesByPost(id);
        } else {
          throw new Error('권한이 없습니다.');
        }
      })
      .then(filesResponse => {
        setExistingFiles(filesResponse.data);
        setLoading(false);
      })
      .catch(error => {
        if (error.message === '권한이 없습니다.') {
          setError('이 게시글을 수정할 권한이 없습니다.');
        } else {
          setError('게시글 정보를 불러오는 중 오류가 발생했습니다.');
          console.error('Error fetching post details:', error);
        }
        setLoading(false);
      });
  }, [id, currentUser, isAdmin, navigate]);
  
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
    
    postService.updatePost(id, post)
      .then(response => {
        // 파일이 있는 경우 업로드
        if (files.length > 0) {
          return fileService.uploadFiles(id, files);
        }
        return response;
      })
      .then(response => {
        navigate(`/boards/${id}`);
      })
      .catch(error => {
        setError('게시글 수정 중 오류가 발생했습니다.');
        console.error('Error updating post:', error);
        setLoading(false);
      });
  };
  
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };
  
  const handleDeleteFile = (fileId) => {
    if (window.confirm('이 파일을 삭제하시겠습니까?')) {
      fileService.deleteFile(fileId)
        .then(response => {
          setExistingFiles(existingFiles.filter(file => file.id !== fileId));
        })
        .catch(error => {
          console.error('Error deleting file:', error);
        });
    }
  };
  
  return (
    <div className="container">
      <h2>게시글 수정</h2>
      
      {error && <p className="error-message">{error}</p>}
      
      {loading ? (
        <p>로딩 중...</p>
      ) : (
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
          
          {existingFiles.length > 0 && (
            <div className="form-group">
              <label>기존 첨부 파일</label>
              <ul className="file-list">
                {existingFiles.map(file => (
                  <li key={file.id}>
                    <span>{file.fileName} ({Math.round(file.fileSize / 1024)} KB)</span>
                    <button
                      type="button"
                      className="btn-link"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="files">새 첨부 파일</label>
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
            <button type="button" className="btn btn-danger" onClick={() => navigate(`/boards/${id}`)}>
              취소
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BoardEdit; 