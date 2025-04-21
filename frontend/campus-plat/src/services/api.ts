// src/services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/authStore';
import { AuthService } from './authService';

const api: AxiosInstance = axios.create({
  // url: import.meta.env.REACT_APP_API_BASE_URL,
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;

  if (token && config.headers && (!config.url?.includes("login") || !config.url?.includes("refresh") || !config.url?.includes("register"))) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Content-Type'] ='application/json';
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // console.log(error.request);

    try {
      const response = await AuthService.getNewToken(useAuthStore.getState().refreshToken!);
      if (response.status === 200 && response.data.access_token) {
        // Update access token in both localStorage and auth store
        localStorage.setItem('access_token', response.data.access_token);
        useAuthStore.getState().setAccessToken(response.data.access_token);
        return;
      }
    } catch (error) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      alert('Session expired. Please try again.');
    }
      
      // const authStore = useAuthStore.getState();
      // if (error.request?.responseUrl?.includes('api/auth/refresh')) {
      //   authStore.logout();
      //   window.location.href = '/login';
      //   return Promise.reject(error);
      // }

      // const refreshToken = authStore.refreshToken;

      // if (refreshToken) {
      //   try {
      //     authStore.refreshTokenInit();
      //   } catch (refreshError) {
      //     authStore.logout();
      //     window.location.href = '/login';
      //   }
      // } else {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      // }
      // useAuthStore.getState().logout();
      // window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // window.location.href = '/unauthorized';
    } else if (error.response?.status === 404) {
      // window.location.href = '/not-found';
    } else if (error.response?.status === 500) {
      // window.location.href = '/internal-server-error';
    }
    return Promise.reject(error);
  }
);

export default api;
