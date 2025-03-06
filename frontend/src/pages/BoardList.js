import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import categoryService from '../services/api/category.service';
import postService from '../services/api/post.service';
import authService from '../services/api/auth.service';

const BoardList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = authService.isLoggedIn();
  
  // 카테고리 목록 가져오기
  useEffect(() => {
    categoryService.getAllCategories()
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        setError('카테고리를 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching categories:', error);
      });
  }, []);
  
  // 게시글 목록 가져오기
  useEffect(() => {
    setLoading(true);
    
    const fetchPosts = () => {
      if (categoryId) {
        // 특정 카테고리의 게시글 가져오기
        categoryService.getCategoryById(categoryId)
          .then(categoryResponse => {
            setCurrentCategory(categoryResponse.data);
            
            return postService.getPostsByCategory(categoryId, currentPage, 10);
          })
          .then(postsResponse => {
            setPosts(postsResponse.data.content);
            setTotalPages(postsResponse.data.totalPages);
            setLoading(false);
          })
          .catch(error => {
            setError('게시글을 불러오는 중 오류가 발생했습니다.');
            console.error('Error fetching posts by category:', error);
            setLoading(false);
          });
      } else {
        // 모든 게시글 가져오기
        setCurrentCategory(null);
        
        postService.getAllPosts(currentPage, 10)
          .then(response => {
            setPosts(response.data.content);
            setTotalPages(response.data.totalPages);
            setLoading(false);
          })
          .catch(error => {
            setError('게시글을 불러오는 중 오류가 발생했습니다.');
            console.error('Error fetching all posts:', error);
            setLoading(false);
          });
      }
    };
    
    fetchPosts();
  }, [categoryId, currentPage]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchKeyword.trim()) {
      return;
    }
    
    setLoading(true);
    
    postService.searchPosts(searchKeyword, 0, 10)
      .then(response => {
        setPosts(response.data.content);
        setTotalPages(response.data.totalPages);
        setCurrentPage(0);
        setLoading(false);
      })
      .catch(error => {
        setError('검색 중 오류가 발생했습니다.');
        console.error('Error searching posts:', error);
        setLoading(false);
      });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="container">
      <h2>{currentCategory ? currentCategory.name : '전체 게시글'}</h2>
      
      {currentCategory && (
        <p className="category-description">{currentCategory.description}</p>
      )}
      
      <div className="board-controls">
        <div className="category-select">
          <label htmlFor="category">카테고리:</label>
          <select 
            id="category" 
            value={categoryId || ''} 
            onChange={(e) => navigate(e.target.value ? `/boards/category/${e.target.value}` : '/boards')}
          >
            <option value="">전체</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">검색</button>
        </form>
        
        {isLoggedIn && (
          <Link to="/boards/write" className="btn btn-primary">글쓰기</Link>
        )}
      </div>
      
      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : posts.length === 0 ? (
        <p>게시글이 없습니다.</p>
      ) : (
        <>
          <table className="board-list">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>
                    <Link to={`/boards/${post.id}`}>
                      {post.title}
                      {post.commentCount > 0 && <span className="comment-count">[{post.commentCount}]</span>}
                    </Link>
                  </td>
                  <td>{post.author.username}</td>
                  <td>{formatDate(post.createdAt)}</td>
                  <td>{post.viewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={currentPage === i ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BoardList; 