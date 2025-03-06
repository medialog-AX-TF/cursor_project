import axios from './axios';

class CategoryService {
  getAllCategories() {
    return axios.get('/categories');
  }

  getRootCategories() {
    return axios.get('/categories/root');
  }

  getCategoryById(id) {
    return axios.get(`/categories/${id}`);
  }

  getSubcategories(id) {
    return axios.get(`/categories/${id}/subcategories`);
  }

  createCategory(category) {
    return axios.post('/categories', category);
  }

  updateCategory(id, category) {
    return axios.put(`/categories/${id}`, category);
  }

  deleteCategory(id) {
    return axios.delete(`/categories/${id}`);
  }
}

export default new CategoryService(); 