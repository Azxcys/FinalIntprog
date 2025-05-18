import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://ipt-final-2025-backend.onrender.com/api'
  : 'http://localhost:5000/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  role: 'admin' | 'employee';
}

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      console.log('Attempting login with:', credentials.username);
      const response = await axios.post(`${API_URL}/login`, credentials);
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response || error);
      throw error;
    }
  },

  async register(data: RegisterData) {
    try {
      console.log('Attempting registration with username:', data.username);
      const response = await axios.post(`${API_URL}/register`, {
        ...data,
        status: 'active' // Add default status as required by database
      });
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response || error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}; 