// src/services/authService.ts
import api from './api';
import { User } from '../types';

export const AuthService = {
  login: async (credentials: { username: string; password: string }): Promise<{ user: User; token: string }> => {
    const response = await api.post<{ user: User; token: string }>('/auth/login/', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/user/');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout/');
  }
};
