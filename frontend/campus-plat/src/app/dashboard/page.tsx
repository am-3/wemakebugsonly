// app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading]);

  // ...render dashboard if authenticated
}