import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import postService from '../services/api/post.service';
import commentService from '../services/api/comment.service';
import fileService from '../services/api/file.service';
import authService from '../services/api/auth.service';

const BoardDetail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [files, setFiles] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const isLoggedIn = authService.isLoggedIn();
  
  // 게시글 정보 가져오기
  useEffect(() => {
    setLoading(true);
    
    postService.getPostById(id)
      .then(response => {
        setPost(response.data);
        setLoading(false);
        
        // 댓글 가져오기
        return commentService.getCommentsByPost(id);
      })
      .then(commentsResponse => {
        setComments(commentsResponse.data);
        
        // 첨부 파일 가져오기
        return fileService.getFilesByPost(id);
      })
      .then(filesResponse => {
        setFiles(filesResponse.data);
      })
      .catch(error => {
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching post details:', error);
        setLoading(false);
      });
  }, [id]);
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!commentContent.trim()) {
      return;
    }
    
    const comment = {
      content: commentContent,
      postId: id,
      isAnonymous: isAnonymous
    };
    
    commentService.createComment(comment)
      .then(response => {
        // 댓글 목록 새로고침
        return commentService.getCommentsByPost(id);
      })
      .then(commentsResponse => {
        setComments(commentsResponse.data);
        setCommentContent('');
        setIsAnonymous(false);
      })
      .catch(error => {
        console.error('Error creating comment:', error);
      });
  };
  
  const handleReplySubmit = (parentId, content) => {
    const reply = {
      content: content,
      postId: id,
      parentId: parentId,
      isAnonymous: false
    };
    
    commentService.createComment(reply)
      .then(response => {
        // 댓글 목록 새로고침
        return commentService.getCommentsByPost(id);
      })
      .then(commentsResponse => {
        setComments(commentsResponse.data);
      })
      .catch(error => {
        console.error('Error creating reply:', error);
      });
  };
  
  const handleDeletePost = () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      postService.deletePost(id)
        .then(response => {
          navigate('/boards');
        })
        .catch(error => {
          console.error('Error deleting post:', error);
        });
    }
  };
  
  const handleLikePost = () => {
    postService.likePost(id)
      .then(response => {
        // 게시글 정보 새로고침
        return postService.getPostById(id);
      })
      .then(response => {
        setPost(response.data);
      })
      .catch(error => {
        console.error('Error liking post:', error);
      });
  };
  
  const handleDislikePost = () => {
    postService.dislikePost(id)
      .then(response => {
        // 게시글 정보 새로고침
        return postService.getPostById(id);
      })
      .then(response => {
        setPost(response.data);
      })
      .catch(error => {
        console.error('Error disliking post:', error);
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
  
  const isAuthor = post && currentUser && post.author.id === currentUser.id;
  const isAdmin = authService.isAdmin();
  
  return (
    <div className="container">
      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : post ? (
        <div className="board-detail">
          <div className="board-header">
            <h2 className="board-title">{post.title}</h2>
            <div className="board-info">
              <span>작성자: {post.author.username}</span>
              <span>작성일: {formatDate(post.createdAt)}</span>
              <span>조회수: {post.viewCount}</span>
              <span>추천: {post.likeCount}</span>
              <span>비추천: {post.dislikeCount}</span>
            </div>
            
            {(isAuthor || isAdmin) && (
              <div className="board-actions">
                <Link to={`/boards/edit/${post.id}`} className="btn btn-primary">수정</Link>
                <button onClick={handleDeletePost} className="btn btn-danger">삭제</button>
              </div>
            )}
          </div>
          
          <div className="board-content">
            {post.content.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          
          {files.length > 0 && (
            <div className="board-files">
              <h3>첨부 파일</h3>
              <ul>
                {files.map(file => (
                  <li key={file.id}>
                    <a href={fileService.getFileUrl(file.id)} target="_blank" rel="noopener noreferrer">
                      {file.fileName} ({Math.round(file.fileSize / 1024)} KB)
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="board-reactions">
            <button onClick={handleLikePost} className="btn btn-success" disabled={!isLoggedIn}>
              👍 추천 ({post.likeCount})
            </button>
            <button onClick={handleDislikePost} className="btn btn-danger" disabled={!isLoggedIn}>
              👎 비추천 ({post.dislikeCount})
            </button>
          </div>
          
          <div className="comment-section">
            <h3>댓글 ({comments.length})</h3>
            
            {isLoggedIn && (
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <div className="form-group">
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                    />
                    익명으로 작성
                  </label>
                </div>
                <button type="submit" className="btn btn-primary">댓글 작성</button>
              </form>
            )}
            
            <div className="comment-list">
              {comments.length === 0 ? (
                <p>댓글이 없습니다.</p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <div className="comment-info">
                      <span>{comment.isAnonymous ? '익명' : comment.author.username}</span>
                      <span>{formatDate(comment.createdAt)}</span>
                    </div>
                    <div className="comment-content">
                      {comment.isDeleted ? (
                        <p className="deleted-comment">삭제된 댓글입니다.</p>
                      ) : (
                        <p>{comment.content}</p>
                      )}
                    </div>
                    <div className="comment-actions">
                      <button className="btn-link">답글</button>
                      {((currentUser && comment.author.id === currentUser.id) || isAdmin) && !comment.isDeleted && (
                        <>
                          <button className="btn-link">수정</button>
                          <button className="btn-link">삭제</button>
                        </>
                      )}
                    </div>
                    
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="reply-list">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="reply">
                            <div className="comment-info">
                              <span>{reply.isAnonymous ? '익명' : reply.author.username}</span>
                              <span>{formatDate(reply.createdAt)}</span>
                            </div>
                            <div className="comment-content">
                              {reply.isDeleted ? (
                                <p className="deleted-comment">삭제된 댓글입니다.</p>
                              ) : (
                                <p>{reply.content}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>게시글을 찾을 수 없습니다.</p>
      )}
      
      <div className="board-navigation">
        <Link to="/boards" className="btn btn-primary">목록으로</Link>
      </div>
    </div>
  );
};

export default BoardDetail; 