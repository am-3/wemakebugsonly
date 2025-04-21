// src/services/authService.ts
import api from './api';
import { User } from '../types';
import { AxiosResponse } from 'axios';

export const AuthService = {
  login: async (credentials: { username: string; password: string }): Promise<{ user: User; token: string }> => {
    const response = await api.post<{ user: User; token: string }>('/auth/login/', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/user/');
    return response.data;
  },

  getNewToken: async (refreshToken: string): Promise<AxiosResponse<any, any>> => {
    const response = await api.post('/auth/refresh/', { refresh_token: refreshToken });
    return response;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout/');
  }
};
