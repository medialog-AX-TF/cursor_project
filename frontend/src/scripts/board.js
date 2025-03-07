/**
 * 게시판 프로젝트 - 게시판 관련 JavaScript 파일
 * 게시판 목록, 게시글 목록 등 게시판 관련 기능을 담당하는 스크립트
 */

document.addEventListener('DOMContentLoaded', () => {
  // 게시판 검색 기능
  setupBoardSearch();
  
  // 게시글 검색 기능
  setupPostSearch();
  
  // 게시글 정렬 기능
  setupPostSort();
  
  // 페이지네이션 기능
  setupPagination();
});

/**
 * 게시판 검색 기능 설정
 */
function setupBoardSearch() {
  const boardSearchForm = document.querySelector('.board-search');
  if (!boardSearchForm) return;
  
  boardSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const searchInput = boardSearchForm.querySelector('input');
    const searchTerm = searchInput?.value?.trim();
    
    if (!searchTerm) {
      showNotification('검색어를 입력해주세요.', 'warning');
      return;
    }
    
    // 실제 구현에서는 검색 결과 페이지로 이동
    // window.location.href = `board-search.html?q=${encodeURIComponent(searchTerm)}`;
    
    // 임시 구현
    filterBoardsBySearchTerm(searchTerm);
  });
}

/**
 * 검색어로 게시판 필터링
 * @param {string} searchTerm - 검색어
 */
function filterBoardsBySearchTerm(searchTerm) {
  const boardItems = document.querySelectorAll('.board-item');
  const searchTermLower = searchTerm.toLowerCase();
  let matchCount = 0;
  
  boardItems.forEach(item => {
    const boardTitle = item.querySelector('h3 a').textContent.toLowerCase();
    const boardDesc = item.querySelector('p').textContent.toLowerCase();
    
    if (boardTitle.includes(searchTermLower) || boardDesc.includes(searchTermLower)) {
      item.style.display = '';
      matchCount++;
    } else {
      item.style.display = 'none';
    }
  });
  
  if (matchCount === 0) {
    showNotification('검색 결과가 없습니다.', 'info');
  } else {
    showNotification(`${matchCount}개의 게시판을 찾았습니다.`, 'success');
  }
}

/**
 * 게시글 검색 기능 설정
 */
function setupPostSearch() {
  const postSearchForm = document.querySelector('.post-search');
  if (!postSearchForm) return;
  
  postSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const searchTypeSelect = postSearchForm.querySelector('.search-type');
    const searchInput = postSearchForm.querySelector('input');
    
    const searchType = searchTypeSelect?.value || 'title';
    const searchTerm = searchInput?.value?.trim();
    
    if (!searchTerm) {
      showNotification('검색어를 입력해주세요.', 'warning');
      return;
    }
    
    // 실제 구현에서는 검색 결과 페이지로 이동
    // const currentBoardId = new URLSearchParams(window.location.search).get('board');
    // window.location.href = `post-search.html?board=${currentBoardId}&type=${searchType}&q=${encodeURIComponent(searchTerm)}`;
    
    // 임시 구현
    filterPostsBySearchTerm(searchType, searchTerm);
  });
}

/**
 * 검색어로 게시글 필터링
 * @param {string} searchType - 검색 유형 (title, content, author, title_content)
 * @param {string} searchTerm - 검색어
 */
function filterPostsBySearchTerm(searchType, searchTerm) {
  const postRows = document.querySelectorAll('.post-table tbody tr');
  const searchTermLower = searchTerm.toLowerCase();
  let matchCount = 0;
  
  postRows.forEach(row => {
    let match = false;
    const titleCell = row.querySelector('.post-title a');
    const authorCell = row.querySelector('.post-author');
    
    if (!titleCell || !authorCell) return;
    
    const title = titleCell.textContent.toLowerCase();
    const author = authorCell.textContent.toLowerCase();
    
    switch (searchType) {
      case 'title':
        match = title.includes(searchTermLower);
        break;
      case 'author':
        match = author.includes(searchTermLower);
        break;
      case 'title_content':
        // 실제로는 내용도 검색해야 하지만, 목록에서는 내용이 없으므로 제목만 검색
        match = title.includes(searchTermLower);
        break;
      default:
        match = title.includes(searchTermLower);
    }
    
    if (match) {
      row.style.display = '';
      matchCount++;
    } else {
      row.style.display = 'none';
    }
  });
  
  if (matchCount === 0) {
    showNotification('검색 결과가 없습니다.', 'info');
  } else {
    showNotification(`${matchCount}개의 게시글을 찾았습니다.`, 'success');
  }
}

/**
 * 게시글 정렬 기능 설정
 */
function setupPostSort() {
  const postSortSelect = document.querySelector('.post-sort');
  if (!postSortSelect) return;
  
  postSortSelect.addEventListener('change', () => {
    const sortType = postSortSelect.value;
    
    // 실제 구현에서는 서버에 정렬된 데이터 요청
    // const currentBoardId = new URLSearchParams(window.location.search).get('board');
    // window.location.href = `post-list.html?board=${currentBoardId}&sort=${sortType}`;
    
    // 임시 구현
    sortPosts(sortType);
  });
}

/**
 * 게시글 정렬
 * @param {string} sortType - 정렬 유형 (latest, views, likes)
 */
function sortPosts(sortType) {
  const postTable = document.querySelector('.post-table tbody');
  if (!postTable) return;
  
  const postRows = Array.from(postTable.querySelectorAll('tr:not(.notice)'));
  
  postRows.sort((a, b) => {
    switch (sortType) {
      case 'views':
        const viewsA = parseInt(a.querySelector('.post-views').textContent.replace(/[^0-9]/g, ''), 10);
        const viewsB = parseInt(b.querySelector('.post-views').textContent.replace(/[^0-9]/g, ''), 10);
        return viewsB - viewsA;
      case 'likes':
        const likesA = parseInt(a.querySelector('.post-likes').textContent.replace(/[^0-9]/g, ''), 10);
        const likesB = parseInt(b.querySelector('.post-likes').textContent.replace(/[^0-9]/g, ''), 10);
        return likesB - likesA;
      case 'latest':
      default:
        const dateA = new Date(a.querySelector('.post-date').textContent);
        const dateB = new Date(b.querySelector('.post-date').textContent);
        return dateB - dateA;
    }
  });
  
  // 공지사항은 항상 최상단에 유지
  const noticeRows = Array.from(postTable.querySelectorAll('tr.notice'));
  
  // 테이블 재구성
  postTable.innerHTML = '';
  noticeRows.forEach(row => postTable.appendChild(row));
  postRows.forEach(row => postTable.appendChild(row));
  
  showNotification(`게시글을 ${getSortTypeText(sortType)}으로 정렬했습니다.`, 'success');
}

/**
 * 정렬 유형 텍스트 반환
 * @param {string} sortType - 정렬 유형
 * @returns {string} 정렬 유형 텍스트
 */
function getSortTypeText(sortType) {
  switch (sortType) {
    case 'views': return '조회수순';
    case 'likes': return '추천순';
    case 'latest': return '최신순';
    default: return '최신순';
  }
}

/**
 * 페이지네이션 기능 설정
 */
function setupPagination() {
  const pagination = document.querySelector('.pagination');
  if (!pagination) return;
  
  const pageLinks = pagination.querySelectorAll('a');
  
  pageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 실제 구현에서는 해당 페이지로 이동
      // const page = link.textContent;
      // const currentBoardId = new URLSearchParams(window.location.search).get('board');
      // window.location.href = `post-list.html?board=${currentBoardId}&page=${page}`;
      
      // 임시 구현
      pageLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      showNotification(`${link.textContent} 페이지로 이동합니다.`, 'info');
    });
  });
} 