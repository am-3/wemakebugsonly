// src/services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/authStore';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.REACT_APP_API_BASE_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      window.location.href = '/unauthorized';
    } else if (error.response?.status === 404) {
      window.location.href = '/not-found';
    } else if (error.response?.status === 500) {
      window.location.href = '/internal-server-error';
    }
    return Promise.reject(error);
  }
);

export default api;
