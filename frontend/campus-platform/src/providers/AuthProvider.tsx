// src/providers/AuthProvider.jsx
import { useEffect, ReactNode } from 'react';
import { authStore } from '../stores/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, loading, fetchUser } = authStore();
  
  useEffect(() => {
    if (!user && !loading) {
      fetchUser().catch(() => {});
    }
  }, [user, loading, fetchUser]);

  return <>{children}</>;
};
