// src/components/common/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { authStore } from '../../stores/authStore';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('student' | 'faculty' | 'admin')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = authStore();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Link href="/login">Login</Link>;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Link href="//unauthorized">Unauthorized</Link>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
