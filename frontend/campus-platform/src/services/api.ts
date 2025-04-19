// src/services/api.js
import axios from 'axios';
import { authStore } from '../stores/authStore';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Request interceptor
api.interceptors.request.use(config => {
  const token = authStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
