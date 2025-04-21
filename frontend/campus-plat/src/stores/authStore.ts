// src/stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { z } from 'zod';
import {jwtDecode} from 'jwt-decode';
import api from '../services/api';
import { User } from '../types';

// Schema validation
const roles = z.enum(['student', 'faculty', 'admin', '']);
const TokenDataSchema = z.object({
  token_type: z.literal('access'),
  exp: z.number(),
  iat: z.number(),
  jti: z.string(),
  user_id: z.number(),
});

export type Role = z.infer<typeof roles>;
type TokenData = z.infer<typeof TokenDataSchema>;

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  tokenData: TokenData | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  role: Role | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
  refreshTokenInit: () => Promise<void>;
  validateToken: () => boolean;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      tokenData: localStorage.getItem('tokenData') ? JSON.parse(localStorage.getItem('tokenData') || '') : null,
      isAuthenticated: localStorage.getItem('isAuthenticated') === "true",
      role: localStorage.getItem('role') == 'student' ? 'student' : localStorage.getItem('role') == 'faculty' ? 'faculty' : 'admin',
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '') : null,
      loading: false,
      error: null,

      setAccessToken: (accessToken) => {
        localStorage.setItem('accessToken', accessToken);
        set({ accessToken });
      },

      refreshTokenInit: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/refresh/', { refresh_token: get().refreshToken });
          const accessToken = response.data.access;
          const refreshToken = response.data.refresh;
          const decoded = TokenDataSchema.parse(jwtDecode(accessToken));
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('tokenData', JSON.stringify(decoded));
          localStorage.setItem('isAuthenticated', "true");

          set({
            accessToken,
            tokenData: decoded,
            loading: false,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            error: error instanceof Error? error.message : 'Refresh token failed',
            loading: false,
            isAuthenticated: false
          });
          throw error;
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/login/', { email, password }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
          const accessToken = response.data.access_token;
          const refreshToken = response.data.refresh_token;
          const user = response.data.user;
          const decoded = TokenDataSchema.parse(jwtDecode(accessToken));

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('tokenData', JSON.stringify(decoded));
          localStorage.setItem('isAuthenticated', "true");
          localStorage.setItem('role', user.role);
          localStorage.setItem('user', JSON.stringify(user));

          set({
            role: user.role,
            accessToken,
            tokenData: decoded,
            loading: false,
            isAuthenticated: true,
           user: {
            id: user.id,
            last_name: user.last_name,
            first_name: user.first_name,
            email: user.email,
            role: user.role,
            profile_picture: user.profile_picture,
           } 
          });
        } catch (error) {
          let errorMessage = error instanceof Error ? error.response.data['error'] : 'Login failed';
          if (errorMessage['error'] == 'Invalid email or password') {
            errorMessage = 'Invalid email or password';
          }
          
          set({ 
            error: errorMessage,
            loading: false,
            isAuthenticated: false
          });
          throw error;
        }
      },

      signup: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/register/', userData);
          if (response.data['message'] == "User has been registered") {
          
            set({
              loading: false,
              isAuthenticated: true
            });
            
          } else {
            
            set({
              error: response.data['message'],
              loading: false,
              isAuthenticated: false
            });

            throw new Error(response.data['message']);
          }
          
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Signup failed',
            loading: false,
            isAuthenticated: false
          });
          throw error;
        }
      },

      logout: async () => {
        const response = await api.post('/auth/logout/', {refresh_token: get().refreshToken});
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenData');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        localStorage.removeItem('auth-storage');
        window.location.href = '/';
        set({
          accessToken: null,
          refreshToken: null,
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
