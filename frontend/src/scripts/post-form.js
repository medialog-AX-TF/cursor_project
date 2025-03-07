/**
 * 게시판 프로젝트 - 게시글 작성 페이지 JavaScript 파일
 * 게시글 작성 및 수정 페이지 관련 기능을 담당하는 스크립트
 */

document.addEventListener('DOMContentLoaded', () => {
  // 에디터 툴바 기능
  setupEditorToolbar();
  
  // 파일 업로드 기능
  setupFileUpload();
  
  // 예약 발행 기능
  setupScheduledPublish();
  
  // 임시 저장 기능
  setupTempSave();
  
  // 미리보기 기능
  setupPreview();
  
  // 폼 제출 기능
  setupFormSubmit();
});

/**
 * 에디터 툴바 기능 설정
 */
function setupEditorToolbar() {
  const toolbar = document.querySelector('.editor-toolbar');
  const contentTextarea = document.getElementById('content');
  
  if (!toolbar || !contentTextarea) return;
  
  // 굵게
  const boldButton = toolbar.querySelector('.btn-bold');
  if (boldButton) {
    boldButton.addEventListener('click', () => {
      insertTextAtCursor(contentTextarea, '**', '**', '굵은 텍스트');
    });
  }
  
  // 기울임
  const italicButton = toolbar.querySelector('.btn-italic');
  if (italicButton) {
    italicButton.addEventListener('click', () => {
      insertTextAtCursor(contentTextarea, '*', '*', '기울인 텍스트');
    });
  }
  
  // 밑줄
  const underlineButton = toolbar.querySelector('.btn-underline');
  if (underlineButton) {
    underlineButton.addEventListener('click', () => {
      insertTextAtCursor(contentTextarea, '<u>', '</u>', '밑줄 텍스트');
    });
  }
  
  // 취소선
  const strikeButton = toolbar.querySelector('.btn-strike');
  if (strikeButton) {
    strikeButton.addEventListener('click', () => {
      insertTextAtCursor(contentTextarea, '~~', '~~', '취소선 텍스트');
    });
  }
  
  // 제목
  const headingButton = toolbar.querySelector('.btn-heading');
  if (headingButton) {
    headingButton.addEventListener('click', () => {
      insertTextAtCursor(contentTextarea, '## ', '', '제목');
    });
  }
  
  // 인용구
  const quoteButton = toolbar.querySelector('.btn-quote');
  if (quoteButton) {
    quoteButton.addEventListener('click', () => {
      insertTextAtCursor(contentTextarea, '> ', '', '인용구');
    });
  }
  
  // 코드
  const codeButton = toolbar.querySelector('.btn-code');
  if (codeButton) {
    codeButton.addEventListener('click', () => {
      insertTextAtCursor(contentTextarea, '```\n', '\n```', '코드 블록');
    });
  }
  
  // 목록
  const listButton = toolbar.querySelector('.btn-list');
  if (listButton) {
    listButton.addEventListener('click', () => {
      insertTextAtCursor(contentTextarea, '- ', '', '목록 항목');
    });
  }
  
  // 링크
  const linkButton = toolbar.querySelector('.btn-link');
  if (linkButton) {
    linkButton.addEventListener('click', () => {
      insertTextAtCursor(contentTextarea, '[', '](https://example.com)', '링크 텍스트');
    });
  }
  
  // 이미지
  const imageButton = toolbar.querySelector('.btn-image');
  if (imageButton) {
    imageButton.addEventListener('click', () => {
      insertTextAtCursor(contentTextarea, '![', '](https://example.com/image.jpg)', '이미지 설명');
    });
  }
  
  // 표
  const tableButton = toolbar.querySelector('.btn-table');
  if (tableButton) {
    tableButton.addEventListener('click', () => {
      const tableTemplate = `
| 제목1 | 제목2 | 제목3 |
|-------|-------|-------|
| 내용1 | 내용2 | 내용3 |
| 내용4 | 내용5 | 내용6 |
`;
      insertTextAtCursor(contentTextarea, tableTemplate, '', '');
    });
  }
}

/**
 * 커서 위치에 텍스트 삽입
 * @param {HTMLTextAreaElement} textarea - 텍스트 영역 요소
 * @param {string} before - 선택 영역 앞에 삽입할 텍스트
 * @param {string} after - 선택 영역 뒤에 삽입할 텍스트
 * @param {string} defaultText - 선택 영역이 없을 때 삽입할 기본 텍스트
 */
function insertTextAtCursor(textarea, before, after, defaultText) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selectedText = text.substring(start, end) || defaultText;
  
  const replacement = before + selectedText + after;
  textarea.value = text.substring(0, start) + replacement + text.substring(end);
  
  // 커서 위치 조정
  const newCursorPos = start + before.length + selectedText.length + after.length;
  textarea.focus();
  textarea.setSelectionRange(newCursorPos, newCursorPos);
}

/**
 * 파일 업로드 기능 설정
 */
function setupFileUpload() {
  const fileInput = document.getElementById('files');
  const filePreviewList = document.getElementById('file-preview-list');
  const fileUploadArea = document.querySelector('.file-upload-area');
  
  if (!fileInput || !filePreviewList || !fileUploadArea) return;
  
  // 드래그 앤 드롭 이벤트
  fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
  });
  
  fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.classList.remove('dragover');
  });
  
  fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    
    if (e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      handleFileSelect(fileInput.files);
    }
  });
  
  // 파일 선택 이벤트
  fileInput.addEventListener('change', () => {
    handleFileSelect(fileInput.files);
  });
}

/**
 * 파일 선택 처리
 * @param {FileList} files - 선택된 파일 목록
 */
function handleFileSelect(files) {
  const filePreviewList = document.getElementById('file-preview-list');
  if (!filePreviewList) return;
  
  // 파일 목록 초기화
  filePreviewList.innerHTML = '';
  
  // 최대 5개 파일로 제한
  const maxFiles = 5;
  const fileCount = Math.min(files.length, maxFiles);
  
  if (files.length > maxFiles) {
    showNotification(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`, 'warning');
  }
  
  for (let i = 0; i < fileCount; i++) {
    const file = files[i];
    
    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showNotification(`${file.name} 파일이 너무 큽니다. 최대 10MB까지 업로드할 수 있습니다.`, 'error');
      continue;
    }
    
    // 파일 미리보기 생성
    const filePreview = document.createElement('div');
    filePreview.className = 'file-preview';
    
    // 이미지 파일인 경우 미리보기 표시
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        filePreview.innerHTML = `
          <div class="file-preview-image">
            <img src="${e.target.result}" alt="${file.name}">
          </div>
          <div class="file-preview-info">
            <span class="file-name">${file.name}</span>
            <span class="file-size">${formatFileSize(file.size)}</span>
          </div>
          <button type="button" class="btn-remove-file" data-index="${i}">×</button>
        `;
      };
      reader.readAsDataURL(file);
    } else {
      // 이미지가 아닌 경우 아이콘 표시
      filePreview.innerHTML = `
        <div class="file-preview-icon">
          <i class="icon-file"></i>
        </div>
        <div class="file-preview-info">
          <span class="file-name">${file.name}</span>
          <span class="file-size">${formatFileSize(file.size)}</span>
        </div>
        <button type="button" class="btn-remove-file" data-index="${i}">×</button>
      `;
    }
    
    filePreviewList.appendChild(filePreview);
  }
  
  // 파일 제거 버튼 이벤트 설정
  const removeButtons = filePreviewList.querySelectorAll('.btn-remove-file');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'), 10);
      removeFile(index);
    });
  });
}

/**
 * 파일 크기 포맷
 * @param {number} size - 파일 크기 (바이트)
 * @returns {string} 포맷된 파일 크기
 */
function formatFileSize(size) {
  if (size < 1024) {
    return size + ' B';
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(1) + ' KB';
  } else {
    return (size / (1024 * 1024)).toFixed(1) + ' MB';
  }
}

/**
 * 파일 제거
 * @param {number} index - 제거할 파일 인덱스
 */
function removeFile(index) {
  const fileInput = document.getElementById('files');
  const filePreviewList = document.getElementById('file-preview-list');
  
  if (!fileInput || !filePreviewList) return;
  
  // FileList는 직접 수정할 수 없으므로 새 DataTransfer 객체 생성
  const dt = new DataTransfer();
  
  // 선택한 파일을 제외한 나머지 파일 추가
  for (let i = 0; i < fileInput.files.length; i++) {
    if (i !== index) {
      dt.items.add(fileInput.files[i]);
    }
  }
  
  // 파일 입력 업데이트
  fileInput.files = dt.files;
  
  // 파일 미리보기 업데이트
  handleFileSelect(fileInput.files);
}

/**
 * 예약 발행 기능 설정
 */
function setupScheduledPublish() {
  const useScheduleCheckbox = document.getElementById('use-schedule');
  const scheduledDateInput = document.getElementById('scheduled-date');
  
  if (!useScheduleCheckbox || !scheduledDateInput) return;
  
  // 체크박스 상태에 따라 날짜 입력 활성화/비활성화
  useScheduleCheckbox.addEventListener('change', () => {
    scheduledDateInput.disabled = !useScheduleCheckbox.checked;
    
    if (useScheduleCheckbox.checked) {
      // 기본값으로 현재 시간 + 1시간 설정
      const now = new Date();
      now.setHours(now.getHours() + 1);
      
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      scheduledDateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
      scheduledDateInput.focus();
    }
  });
}

/**
 * 임시 저장 기능 설정
 */
function setupTempSave() {
  const tempSaveButton = document.getElementById('btn-temp-save');
  const postForm = document.getElementById('post-write-form');
  
  if (!tempSaveButton || !postForm) return;
  
  // 자동 임시 저장 (1분마다)
  const autoSaveInterval = 60 * 1000;
  let autoSaveTimer;
  
  function startAutoSave() {
    autoSaveTimer = setInterval(() => {
      saveFormData(true);
    }, autoSaveInterval);
  }
  
  function stopAutoSave() {
    clearInterval(autoSaveTimer);
  }
  
  // 페이지 로드 시 자동 저장 시작
  startAutoSave();
  
  // 페이지 언로드 시 자동 저장 중지
  window.addEventListener('beforeunload', () => {
    stopAutoSave();
  });
  
  // 임시 저장 버튼 클릭 이벤트
  tempSaveButton.addEventListener('click', () => {
    saveFormData(false);
  });
  
  // 페이지 로드 시 임시 저장 데이터 복원
  loadFormData();
}

/**
 * 폼 데이터 저장
 * @param {boolean} isAutoSave - 자동 저장 여부
 */
function saveFormData(isAutoSave) {
  const postForm = document.getElementById('post-write-form');
  if (!postForm) return;
  
  // 폼 데이터 수집
  const formData = {
    category: document.getElementById('category')?.value,
    title: document.getElementById('title')?.value,
    content: document.getElementById('content')?.value,
    tags: document.getElementById('tags')?.value,
    isPrivate: document.getElementById('is-private')?.checked,
    isNotice: document.getElementById('is-notice')?.checked,
    useSchedule: document.getElementById('use-schedule')?.checked,
    scheduledDate: document.getElementById('scheduled-date')?.value,
    timestamp: new Date().toISOString()
  };
  
  // 로컬 스토리지에 저장
  localStorage.setItem('post_temp_data', JSON.stringify(formData));
  
  if (!isAutoSave) {
    showNotification('임시 저장되었습니다.', 'success');
  }
}

/**
 * 임시 저장 데이터 로드
 */
function loadFormData() {
  const tempData = localStorage.getItem('post_temp_data');
  if (!tempData) return;
  
  try {
    const formData = JSON.parse(tempData);
    
    // 저장된 데이터가 24시간 이상 지난 경우 삭제
    const savedTimestamp = new Date(formData.timestamp).getTime();
    const currentTime = new Date().getTime();
    const hoursDiff = (currentTime - savedTimestamp) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      localStorage.removeItem('post_temp_data');
      return;
    }
    
    // 폼 필드에 데이터 복원
    if (formData.category) document.getElementById('category').value = formData.category;
    if (formData.title) document.getElementById('title').value = formData.title;
    if (formData.content) document.getElementById('content').value = formData.content;
    if (formData.tags) document.getElementById('tags').value = formData.tags;
    if (formData.isPrivate) document.getElementById('is-private').checked = formData.isPrivate;
    if (formData.isNotice) document.getElementById('is-notice').checked = formData.isNotice;
    if (formData.useSchedule) {
      document.getElementById('use-schedule').checked = formData.useSchedule;
      document.getElementById('scheduled-date').disabled = false;
      if (formData.scheduledDate) document.getElementById('scheduled-date').value = formData.scheduledDate;
    }
    
    // 임시 저장 데이터가 있음을 알림
    const savedDate = new Date(formData.timestamp);
    const formattedTime = savedDate.toLocaleString();
    showNotification(`${formattedTime}에 임시 저장된 데이터를 불러왔습니다.`, 'info');
  } catch (error) {
    console.error('임시 저장 데이터 로드 실패:', error);
  }
}

/**
 * 미리보기 기능 설정
 */
function setupPreview() {
  const previewButton = document.getElementById('btn-preview');
  if (!previewButton) return;
  
  previewButton.addEventListener('click', () => {
    const title = document.getElementById('title')?.value;
    const content = document.getElementById('content')?.value;
    
    if (!title || !content) {
      showNotification('제목과 내용을 입력해주세요.', 'warning');
      return;
    }
    
    // 미리보기 모달 생성
    const previewModal = document.createElement('div');
    previewModal.className = 'preview-modal';
    previewModal.innerHTML = `
      <div class="preview-modal-content">
        <div class="preview-modal-header">
          <h2>미리보기</h2>
          <button type="button" class="btn-close-preview">×</button>
        </div>
        <div class="preview-modal-body">
          <h1 class="preview-title">${title}</h1>
          <div class="preview-content">${formatContent(content)}</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(previewModal);
    
    // 스크롤 방지
    document.body.style.overflow = 'hidden';
    
    // 닫기 버튼 이벤트
    const closeButton = previewModal.querySelector('.btn-close-preview');
    closeButton.addEventListener('click', () => {
      document.body.removeChild(previewModal);
      document.body.style.overflow = '';
    });
    
    // 모달 외부 클릭 시 닫기
    previewModal.addEventListener('click', (e) => {
      if (e.target === previewModal) {
        document.body.removeChild(previewModal);
        document.body.style.overflow = '';
      }
    });
  });
}

/**
 * 마크다운 형식의 내용을 HTML로 변환 (간단한 구현)
 * @param {string} content - 마크다운 형식의 내용
 * @returns {string} HTML 형식의 내용
 */
function formatContent(content) {
  // 실제 구현에서는 마크다운 라이브러리 사용 권장
  let html = content;
  
  // 줄바꿈
  html = html.replace(/\n/g, '<br>');
  
  // 굵게
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 기울임
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 취소선
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
  
  // 제목
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  
  // 인용구
  html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
  
  // 목록
  html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
  
  // 링크
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  
  // 이미지
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
  
  return html;
}

/**
 * 폼 제출 기능 설정
 */
function setupFormSubmit() {
  const postForm = document.getElementById('post-write-form');
  if (!postForm) return;
  
  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 필수 필드 검증
    const category = document.getElementById('category')?.value;
    const title = document.getElementById('title')?.value;
    const content = document.getElementById('content')?.value;
    
    if (!category) {
      showNotification('카테고리를 선택해주세요.', 'error');
      document.getElementById('category').focus();
      return;
    }
    
    if (!title) {
      showNotification('제목을 입력해주세요.', 'error');
      document.getElementById('title').focus();
      return;
    }
    
    if (!content) {
      showNotification('내용을 입력해주세요.', 'error');
      document.getElementById('content').focus();
      return;
    }
    
    // 태그 검증
    const tags = document.getElementById('tags')?.value;
    if (tags) {
      const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (tagList.length > 5) {
        showNotification('태그는 최대 5개까지 입력할 수 있습니다.', 'error');
        document.getElementById('tags').focus();
        return;
      }
    }
    
    // 예약 발행 검증
    const useSchedule = document.getElementById('use-schedule')?.checked;
    if (useSchedule) {
      const scheduledDate = document.getElementById('scheduled-date')?.value;
      if (!scheduledDate) {
        showNotification('예약 발행 날짜를 입력해주세요.', 'error');
        document.getElementById('scheduled-date').focus();
        return;
      }
      
      const scheduledTime = new Date(scheduledDate).getTime();
      const currentTime = new Date().getTime();
      
      if (scheduledTime <= currentTime) {
        showNotification('예약 발행 날짜는 현재 시간 이후로 설정해주세요.', 'error');
        document.getElementById('scheduled-date').focus();
        return;
      }
    }
    
    try {
      // 실제 구현에서는 서버에 게시글 작성 요청을 보냄
      // const formData = new FormData(postForm);
      // const response = await fetch('/api/posts', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.message || '게시글 작성에 실패했습니다.');
      // }
      
      // 임시 저장 데이터 삭제
      localStorage.removeItem('post_temp_data');
      
      // 작성 성공 시 게시글 목록 페이지로 이동
      showNotification('게시글이 작성되었습니다.', 'success');
      setTimeout(() => {
        window.location.href = 'post-list.html';
      }, 1000);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });
} 