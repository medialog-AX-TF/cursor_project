import axios from './axios';

class AuthService {
  login(username, password) {
    return axios
      .post('/auth/signin', {
        username,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  register(username, email, password, name) {
    return axios.post('/auth/signup', {
      username,
      email,
      password,
      name
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  hasRole(role) {
    const user = this.getCurrentUser();
    if (!user) return false;
    return user.roles.includes(role);
  }

  isAdmin() {
    return this.hasRole('ROLE_ADMIN');
  }

  isModerator() {
    return this.hasRole('ROLE_MODERATOR');
  }
}

export default new AuthService(); 