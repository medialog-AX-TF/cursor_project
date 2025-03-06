import axios from './axios';

class CommentService {
  getCommentsByPost(postId) {
    return axios.get(`/comments/post/${postId}`);
  }

  getReplies(parentId) {
    return axios.get(`/comments/replies/${parentId}`);
  }

  createComment(comment) {
    return axios.post('/comments', comment);
  }

  updateComment(id, comment) {
    return axios.put(`/comments/${id}`, comment);
  }

  deleteComment(id) {
    return axios.delete(`/comments/${id}`);
  }

  likeComment(id) {
    return axios.post(`/comments/${id}/like`);
  }

  dislikeComment(id) {
    return axios.post(`/comments/${id}/dislike`);
  }
}

export default new CommentService(); 