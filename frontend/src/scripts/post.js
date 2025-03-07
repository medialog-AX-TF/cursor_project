/**
 * 게시판 프로젝트 - 게시글 상세 페이지 JavaScript 파일
 * 게시글 상세 페이지 관련 기능을 담당하는 스크립트
 */

document.addEventListener('DOMContentLoaded', () => {
  // 게시글 추천/비추천 기능
  setupPostVote();
  
  // 게시글 공유 기능
  setupPostShare();
  
  // 게시글 북마크 기능
  setupPostBookmark();
  
  // 게시글 신고 기능
  setupPostReport();
  
  // 게시글 삭제 기능
  setupPostDelete();
  
  // 댓글 작성 기능
  setupCommentForm();
  
  // 댓글 추천/비추천 기능
  setupCommentVote();
  
  // 댓글 답글 기능
  setupCommentReply();
  
  // 댓글 신고 기능
  setupCommentReport();
});

/**
 * 게시글 추천/비추천 기능 설정
 */
function setupPostVote() {
  const likeButton = document.querySelector('.btn-like');
  const dislikeButton = document.querySelector('.btn-dislike');
  
  if (!likeButton || !dislikeButton) return;
  
  likeButton.addEventListener('click', async () => {
    try {
      // 실제 구현에서는 서버에 추천 요청을 보냄
      // const postId = new URLSearchParams(window.location.search).get('id');
      // const response = await fetch(`/api/posts/${postId}/vote`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ type: 'like' })
      // });
      
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.message || '추천에 실패했습니다.');
      // }
      
      // 임시 구현
      const likeCount = likeButton.querySelector('.vote-count');
      const currentCount = parseInt(likeCount.textContent, 10);
      likeCount.textContent = currentCount + 1;
      
      likeButton.classList.add('voted');
      dislikeButton.classList.remove('voted');
      
      showNotification('게시글을 추천했습니다.', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });
  
  dislikeButton.addEventListener('click', async () => {
    try {
      // 실제 구현에서는 서버에 비추천 요청을 보냄
      // const postId = new URLSearchParams(window.location.search).get('id');
      // const response = await fetch(`/api/posts/${postId}/vote`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ type: 'dislike' })
      // });
      
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.message || '비추천에 실패했습니다.');
      // }
      
      // 임시 구현
      const dislikeCount = dislikeButton.querySelector('.vote-count');
      const currentCount = parseInt(dislikeCount.textContent, 10);
      dislikeCount.textContent = currentCount + 1;
      
      dislikeButton.classList.add('voted');
      likeButton.classList.remove('voted');
      
      showNotification('게시글을 비추천했습니다.', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });
}

/**
 * 게시글 공유 기능 설정
 */
function setupPostShare() {
  const shareButton = document.querySelector('.btn-share');
  if (!shareButton) return;
  
  shareButton.addEventListener('click', () => {
    // 현재 URL 가져오기
    const url = window.location.href;
    const title = document.querySelector('.post-title').textContent;
    
    // 공유 API 사용 가능 여부 확인
    if (navigator.share) {
      navigator.share({
        title: title,
        url: url
      })
      .then(() => {
        showNotification('게시글을 공유했습니다.', 'success');
      })
      .catch(error => {
        console.error('공유 실패:', error);
        fallbackShare(url);
      });
    } else {
      fallbackShare(url);
    }
  });
}

/**
 * 공유 API를 지원하지 않는 경우 대체 공유 방법
 * @param {string} url - 공유할 URL
 */
function fallbackShare(url) {
  // 클립보드에 URL 복사
  navigator.clipboard.writeText(url)
    .then(() => {
      showNotification('URL이 클립보드에 복사되었습니다.', 'success');
    })
    .catch(() => {
      // 클립보드 API를 지원하지 않는 경우 임시 입력 필드 사용
      const tempInput = document.createElement('input');
      tempInput.value = url;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      
      showNotification('URL이 클립보드에 복사되었습니다.', 'success');
    });
}

/**
 * 게시글 북마크 기능 설정
 */
function setupPostBookmark() {
  const bookmarkButton = document.querySelector('.btn-bookmark');
  if (!bookmarkButton) return;
  
  // 로컬 스토리지에서 북마크 상태 확인
  const postId = new URLSearchParams(window.location.search).get('id');
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  const isBookmarked = bookmarks.includes(postId);
  
  if (isBookmarked) {
    bookmarkButton.classList.add('bookmarked');
    bookmarkButton.setAttribute('aria-pressed', 'true');
  }
  
  bookmarkButton.addEventListener('click', () => {
    const isCurrentlyBookmarked = bookmarkButton.classList.contains('bookmarked');
    
    if (isCurrentlyBookmarked) {
      // 북마크 제거
      const index = bookmarks.indexOf(postId);
      if (index !== -1) {
        bookmarks.splice(index, 1);
      }
      
      bookmarkButton.classList.remove('bookmarked');
      bookmarkButton.setAttribute('aria-pressed', 'false');
      showNotification('북마크가 해제되었습니다.', 'info');
    } else {
      // 북마크 추가
      if (!bookmarks.includes(postId)) {
        bookmarks.push(postId);
      }
      
      bookmarkButton.classList.add('bookmarked');
      bookmarkButton.setAttribute('aria-pressed', 'true');
      showNotification('북마크에 추가되었습니다.', 'success');
    }
    
    // 로컬 스토리지에 저장
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  });
}

/**
 * 게시글 신고 기능 설정
 */
function setupPostReport() {
  const reportButton = document.querySelector('.btn-report');
  if (!reportButton) return;
  
  reportButton.addEventListener('click', () => {
    // 실제 구현에서는 신고 모달 표시
    // showReportModal('post', postId);
    
    // 임시 구현
    showNotification('신고 기능은 아직 구현되지 않았습니다.', 'info');
  });
}

/**
 * 게시글 삭제 기능 설정
 */
function setupPostDelete() {
  const deleteButton = document.querySelector('.btn-delete');
  if (!deleteButton) return;
  
  deleteButton.addEventListener('click', async () => {
    const confirmed = confirm('정말로 이 게시글을 삭제하시겠습니까?');
    
    if (!confirmed) return;
    
    try {
      // 실제 구현에서는 서버에 삭제 요청을 보냄
      // const postId = new URLSearchParams(window.location.search).get('id');
      // const response = await fetch(`/api/posts/${postId}`, {
      //   method: 'DELETE'
      // });
      
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.message || '게시글 삭제에 실패했습니다.');
      // }
      
      // 삭제 성공 시 목록 페이지로 이동
      showNotification('게시글이 삭제되었습니다.', 'success');
      setTimeout(() => {
        window.location.href = 'post-list.html';
      }, 1000);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });
}

/**
 * 댓글 작성 기능 설정
 */
function setupCommentForm() {
  const commentForm = document.querySelector('.comment-form');
  if (!commentForm) return;
  
  const commentTextarea = commentForm.querySelector('.comment-textarea');
  const submitButton = commentForm.querySelector('.btn-submit-comment');
  
  submitButton.addEventListener('click', async () => {
    const content = commentTextarea.value.trim();
    
    if (!content) {
      showNotification('댓글 내용을 입력해주세요.', 'warning');
      return;
    }
    
    const isAnonymous = commentForm.querySelector('.comment-anonymous')?.checked || false;
    
    try {
      // 실제 구현에서는 서버에 댓글 작성 요청을 보냄
      // const postId = new URLSearchParams(window.location.search).get('id');
      // const response = await fetch(`/api/posts/${postId}/comments`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content, isAnonymous })
      // });
      
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.message || '댓글 작성에 실패했습니다.');
      // }
      
      // 임시 구현: 새 댓글 추가
      addNewComment(content, isAnonymous);
      
      // 입력 필드 초기화
      commentTextarea.value = '';
      
      showNotification('댓글이 작성되었습니다.', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });
}

/**
 * 새 댓글 추가 (임시 구현)
 * @param {string} content - 댓글 내용
 * @param {boolean} isAnonymous - 익명 여부
 */
function addNewComment(content, isAnonymous) {
  const commentList = document.querySelector('.comment-list');
  if (!commentList) return;
  
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const newComment = document.createElement('div');
  newComment.className = 'comment';
  newComment.innerHTML = `
    <div class="comment-header">
      <div class="comment-info">
        <span class="comment-author">${isAnonymous ? '익명' : '사용자님'}</span>
        <span class="comment-date">${formattedDate}</span>
      </div>
      <div class="comment-actions">
        <button class="btn-action btn-reply">답글</button>
        <button class="btn-action btn-report">신고</button>
      </div>
    </div>
    <div class="comment-content">
      <p>${content}</p>
    </div>
    <div class="comment-footer">
      <div class="comment-vote">
        <button class="btn-vote-sm btn-like-sm">
          <i class="icon-like-sm"></i>
          <span>0</span>
        </button>
        <button class="btn-vote-sm btn-dislike-sm">
          <i class="icon-dislike-sm"></i>
          <span>0</span>
        </button>
      </div>
    </div>
  `;
  
  // 댓글 목록의 맨 앞에 추가
  commentList.insertBefore(newComment, commentList.firstChild);
  
  // 댓글 수 업데이트
  updateCommentCount(1);
  
  // 새 댓글에 이벤트 리스너 추가
  setupCommentVoteForElement(newComment);
  setupCommentReplyForElement(newComment);
  setupCommentReportForElement(newComment);
}

/**
 * 댓글 수 업데이트
 * @param {number} increment - 증가량
 */
function updateCommentCount(increment) {
  const commentCountElements = document.querySelectorAll('.comment-count');
  
  commentCountElements.forEach(element => {
    const currentCount = parseInt(element.textContent, 10);
    element.textContent = currentCount + increment;
  });
}

/**
 * 댓글 추천/비추천 기능 설정
 */
function setupCommentVote() {
  const comments = document.querySelectorAll('.comment');
  
  comments.forEach(comment => {
    setupCommentVoteForElement(comment);
  });
}

/**
 * 특정 댓글 요소에 추천/비추천 기능 설정
 * @param {HTMLElement} comment - 댓글 요소
 */
function setupCommentVoteForElement(comment) {
  const likeButton = comment.querySelector('.btn-like-sm');
  const dislikeButton = comment.querySelector('.btn-dislike-sm');
  
  if (!likeButton || !dislikeButton) return;
  
  likeButton.addEventListener('click', () => {
    const likeCount = likeButton.querySelector('span');
    const currentCount = parseInt(likeCount.textContent, 10);
    likeCount.textContent = currentCount + 1;
    
    likeButton.classList.add('voted');
    dislikeButton.classList.remove('voted');
    
    showNotification('댓글을 추천했습니다.', 'success');
  });
  
  dislikeButton.addEventListener('click', () => {
    const dislikeCount = dislikeButton.querySelector('span');
    const currentCount = parseInt(dislikeCount.textContent, 10);
    dislikeCount.textContent = currentCount + 1;
    
    dislikeButton.classList.add('voted');
    likeButton.classList.remove('voted');
    
    showNotification('댓글을 비추천했습니다.', 'success');
  });
}

/**
 * 댓글 답글 기능 설정
 */
function setupCommentReply() {
  const comments = document.querySelectorAll('.comment');
  
  comments.forEach(comment => {
    setupCommentReplyForElement(comment);
  });
}

/**
 * 특정 댓글 요소에 답글 기능 설정
 * @param {HTMLElement} comment - 댓글 요소
 */
function setupCommentReplyForElement(comment) {
  const replyButton = comment.querySelector('.btn-reply');
  if (!replyButton) return;
  
  replyButton.addEventListener('click', () => {
    // 이미 답글 폼이 있는지 확인
    if (comment.querySelector('.reply-form')) return;
    
    const author = comment.querySelector('.comment-author').textContent;
    
    // 답글 폼 생성
    const replyForm = document.createElement('div');
    replyForm.className = 'reply-form';
    replyForm.innerHTML = `
      <div class="comment-form">
        <textarea placeholder="${author}님에게 답글 작성" class="comment-textarea"></textarea>
        <div class="comment-form-footer">
          <div class="comment-options">
            <label class="checkbox-label">
              <input type="checkbox" class="comment-anonymous">
              <span>익명으로 작성</span>
            </label>
          </div>
          <button class="btn btn-primary btn-submit-reply">답글 작성</button>
        </div>
      </div>
    `;
    
    // 답글 목록이 있는지 확인
    let replyList = comment.querySelector('.reply-list');
    
    if (!replyList) {
      // 답글 목록이 없으면 생성
      replyList = document.createElement('div');
      replyList.className = 'reply-list';
      comment.appendChild(replyList);
    }
    
    // 답글 폼을 답글 목록의 맨 앞에 추가
    replyList.insertBefore(replyForm, replyList.firstChild);
    
    // 답글 작성 버튼에 이벤트 리스너 추가
    const submitButton = replyForm.querySelector('.btn-submit-reply');
    submitButton.addEventListener('click', () => {
      const content = replyForm.querySelector('.comment-textarea').value.trim();
      
      if (!content) {
        showNotification('답글 내용을 입력해주세요.', 'warning');
        return;
      }
      
      const isAnonymous = replyForm.querySelector('.comment-anonymous')?.checked || false;
      
      // 새 답글 추가
      addNewReply(replyList, content, isAnonymous);
      
      // 답글 폼 제거
      replyForm.remove();
      
      showNotification('답글이 작성되었습니다.', 'success');
    });
    
    // 텍스트 영역에 포커스
    replyForm.querySelector('.comment-textarea').focus();
  });
}

/**
 * 새 답글 추가
 * @param {HTMLElement} replyList - 답글 목록 요소
 * @param {string} content - 답글 내용
 * @param {boolean} isAnonymous - 익명 여부
 */
function addNewReply(replyList, content, isAnonymous) {
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const newReply = document.createElement('div');
  newReply.className = 'comment reply';
  newReply.innerHTML = `
    <div class="comment-header">
      <div class="comment-info">
        <span class="comment-author">${isAnonymous ? '익명' : '사용자님'}</span>
        <span class="comment-date">${formattedDate}</span>
      </div>
      <div class="comment-actions">
        <button class="btn-action btn-reply">답글</button>
        <button class="btn-action btn-report">신고</button>
      </div>
    </div>
    <div class="comment-content">
      <p>${content}</p>
    </div>
    <div class="comment-footer">
      <div class="comment-vote">
        <button class="btn-vote-sm btn-like-sm">
          <i class="icon-like-sm"></i>
          <span>0</span>
        </button>
        <button class="btn-vote-sm btn-dislike-sm">
          <i class="icon-dislike-sm"></i>
          <span>0</span>
        </button>
      </div>
    </div>
  `;
  
  // 답글 목록에 추가
  replyList.appendChild(newReply);
  
  // 댓글 수 업데이트
  updateCommentCount(1);
  
  // 새 답글에 이벤트 리스너 추가
  setupCommentVoteForElement(newReply);
  setupCommentReplyForElement(newReply);
  setupCommentReportForElement(newReply);
}

/**
 * 댓글 신고 기능 설정
 */
function setupCommentReport() {
  const comments = document.querySelectorAll('.comment');
  
  comments.forEach(comment => {
    setupCommentReportForElement(comment);
  });
}

/**
 * 특정 댓글 요소에 신고 기능 설정
 * @param {HTMLElement} comment - 댓글 요소
 */
function setupCommentReportForElement(comment) {
  const reportButton = comment.querySelector('.btn-report');
  if (!reportButton) return;
  
  reportButton.addEventListener('click', () => {
    // 실제 구현에서는 신고 모달 표시
    // showReportModal('comment', commentId);
    
    // 임시 구현
    showNotification('신고 기능은 아직 구현되지 않았습니다.', 'info');
  });
} 