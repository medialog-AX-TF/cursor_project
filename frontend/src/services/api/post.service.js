import axios from './axios';

class PostService {
  getAllPosts(page = 0, size = 10, sortBy = 'createdAt', direction = 'desc') {
    return axios.get(`/posts?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
  }

  getPostsByCategory(categoryId, page = 0, size = 10) {
    return axios.get(`/posts/category/${categoryId}?page=${page}&size=${size}`);
  }

  searchPosts(keyword, page = 0, size = 10) {
    return axios.get(`/posts/search?keyword=${keyword}&page=${page}&size=${size}`);
  }

  getPostsByTag(tag, page = 0, size = 10) {
    return axios.get(`/posts/tag/${tag}?page=${page}&size=${size}`);
  }

  getPopularPosts() {
    return axios.get('/posts/popular');
  }

  getRecentPosts() {
    return axios.get('/posts/recent');
  }

  getPostById(id) {
    return axios.get(`/posts/${id}`);
  }

  createPost(post) {
    return axios.post('/posts', post);
  }

  updatePost(id, post) {
    return axios.put(`/posts/${id}`, post);
  }

  deletePost(id) {
    return axios.delete(`/posts/${id}`);
  }

  likePost(id) {
    return axios.post(`/posts/${id}/like`);
  }

  dislikePost(id) {
    return axios.post(`/posts/${id}/dislike`);
  }
}

export default new PostService(); 