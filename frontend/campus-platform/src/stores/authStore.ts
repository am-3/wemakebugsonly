// src/stores/authStore.ts
import { create } from 'zustand';
import { AuthService } from '../services/authService';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<User>;
  fetchUser: () => Promise<User>;
  logout: () => void;
}

export const authStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { token, user } = await AuthService.login({ username, password });
      localStorage.setItem('token', token);
      set({ user, token, loading: false });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const user = await AuthService.getCurrentUser();
      set({ user, loading: false });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, error: null });
    AuthService.logout();
  }
}));
