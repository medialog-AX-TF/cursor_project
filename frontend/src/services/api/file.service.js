import axios from './axios';

class FileService {
  uploadFiles(postId, files) {
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    return axios.post(`/files/upload/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  getFilesByPost(postId) {
    return axios.get(`/files/post/${postId}`);
  }

  getFileUrl(id) {
    return `${axios.defaults.baseURL}/files/${id}`;
  }

  deleteFile(id) {
    return axios.delete(`/files/${id}`);
  }
}

export default new FileService(); 