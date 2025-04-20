// src/stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { z } from 'zod';
import {jwtDecode} from 'jwt-decode';
import api from '../services/api';
import { User } from '../types';

// Schema validation
const roles = z.enum(['student', 'faculty', 'admin']);
const TokenDataSchema = z.object({
  exp: z.number(),
  sub: z.string(),
  username: z.string(),
  role: roles,
});

type Role = z.infer<typeof roles>;
type TokenData = z.infer<typeof TokenDataSchema>;

interface AuthState {
  accessToken: string | null;
  tokenData: TokenData | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  role: Role | null;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  validateToken: () => boolean;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: localStorage.getItem('accessToken'),
      tokenData: localStorage.getItem('tokenData') ? JSON.parse(localStorage.getItem('tokenData') || '') : null,
      isAuthenticated: localStorage.getItem('isAuthenticated') === "true",
      role: localStorage.getItem('role') == 'student' ? 'student' : localStorage.getItem('role') == 'faculty' ? 'faculty' : 'admin',
      user: null,
      loading: false,
      error: null,

      login: async (username, password) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/login/', { username, password });
          console.log(response.data);
          const { access } = response.data;
          const decoded = TokenDataSchema.parse(jwtDecode(access));

          
          localStorage.setItem('accessToken', access);
          localStorage.setItem('tokenData', JSON.stringify(decoded));
          localStorage.setItem('isAuthenticated', "true");
          localStorage.setItem('role', decoded.role);
          set({
            accessToken: access,
            tokenData: decoded,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            loading: false,
            isAuthenticated: false
          });
          throw error;
        }
      },

      signup: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/signup/', userData);
          const { access } = response.data;
          const decoded = TokenDataSchema.parse(jwtDecode(access));
          
          set({
            accessToken: access,
            tokenData: decoded,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Signup failed',
            loading: false,
            isAuthenticated: false
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenData');
        localStorage.removeItem('isAuthenticated');
        set({
          accessToken: null,
          tokenData: null,
          isAuthenticated: false,
          loading: false,
        });
      },

      validateToken: () => {
        const { accessToken, tokenData } = get();
        if (!accessToken || !tokenData) {
          set({ isAuthenticated: false });
          return false;
        }
        
        const currentTime = Date.now() / 1000;
        const isValid = tokenData.exp > currentTime;
        
        set({ isAuthenticated: isValid });
        if (!isValid) get().logout();
        return isValid;
      },

      initialize: () => {
        if (typeof window === 'undefined') return;
        
        set({ loading: true });
        const { accessToken, tokenData } = get();
        
        if (accessToken && tokenData) {
          const isValid = get().validateToken();
          set({ isAuthenticated: isValid, loading: false });
        } else {
          set({ isAuthenticated: false, loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        tokenData: state.tokenData,
      }),
    }
  )
);

interface SignupData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: Role;
}

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       accessToken: null,
//       tokenData: null,
//       loading: false,
//       error: null,

//       login: async (username, password) => {
//         set({ loading: true, error: null });
//         try {
//           const response = await api.post('/auth/login/', { username, password });
//           const { access } = response.data;
          
//           const decoded = TokenDataSchema.parse(jwtDecode(access));
//           set({
//             accessToken: access,
//             tokenData: decoded,
//             loading: false,
//           });
//         } catch (error) {
//           set({ 
//             error: error instanceof Error ? error.message : 'Login failed',
//             loading: false 
//           });
//           throw error;
//         }
//       },

//       signup: async (userData) => {
//         set({ loading: true, error: null });
//         try {
//           const response = await api.post('/auth/signup/', userData);
//           const { access } = response.data;
          
//           const decoded = TokenDataSchema.parse(jwtDecode(access));
//           set({
//             accessToken: access,
//             tokenData: decoded,
//             loading: false,
//           });
//         } catch (error) {
//           set({ 
//             error: error instanceof Error ? error.message : 'Signup failed',
//             loading: false 
//           });
//           throw error;
//         }
//       },

//       logout: () => {
//         set({
//           accessToken: null,
//           tokenData: null,
//           loading: false,
//         });
//       },

//       validateToken: () => {
//         const { accessToken, tokenData } = get();
//         if (!accessToken || !tokenData) return false;
        
//         const currentTime = Date.now() / 1000;
//         const isValid = tokenData.exp > currentTime;
        
//         if (!isValid) get().logout();
//         return isValid;
//       },
//     }),
//     {
//       name: 'auth-storage',
//       storage: createJSONStorage(() => localStorage),
//       partialize: (state) => ({
//         accessToken: state.accessToken,
//         tokenData: state.tokenData,
//       }),
//     }
//   )
// );
