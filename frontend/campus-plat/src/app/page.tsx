import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, accessToken } = useAuthStore();
  console.log(accessToken);

  useEffect(() => {
    if (!loading) {
      navigate(isAuthenticated ? '/dashboard' : '/login', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="animate-bounce">
            <svg
              className="w-24 h-24 md:w-32 md:h-32 text-blue-600 drop-shadow-lg"
              fill="none"
              viewBox="0 0 96 96"
            >
              <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="#fff" />
              <path
                d="M24 60 L48 36 L72 60"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="48" cy="60" r="4" fill="currentColor" />
            </svg>
          </div>
          <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-20 h-4 rounded-full bg-blue-200 blur-md opacity-60 animate-pulse"></span>
        </div>
        <h1 className="mt-8 text-3xl md:text-4xl font-extrabold text-blue-700 text-center drop-shadow transition-all duration-700">
          Welcome to Smart Campus OS
        </h1>
        <div className="mt-4 text-blue-600 text-lg">
          {loading ? 'Finalizing your experience...' : 'Redirecting...'}
        </div>
      </div>
    </div>
  );
}
