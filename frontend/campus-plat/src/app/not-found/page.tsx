// app/not-found/page.tsx

'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="relative">
        <span
          className="select-none text-[8rem] md:text-[12rem] font-extrabold text-blue-500 drop-shadow-lg animate-bounce"
          aria-hidden="true"
        >
          404
        </span>
        <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
          {/* Animated shadow */}
          <span className="w-28 h-6 rounded-full bg-blue-200 blur-md opacity-60 animate-pulse"></span>
        </span>
      </div>
      <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-800 transition-all duration-500">
        Oops! Page Not Found
      </h1>
      <p className="mt-2 text-gray-600 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        className={`mt-8 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-lg transition-all duration-300 ${hovered
            ? 'scale-105 bg-blue-700 shadow-2xl'
            : 'hover:scale-105 hover:bg-blue-700 hover:shadow-2xl'}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)} to={'/'}      >
        Go Home
      </Link>
      <div className="mt-8">
        <svg
          className="mx-auto w-20 h-20 text-blue-400 animate-spin-slow"
          fill="none"
          viewBox="0 0 80 80"
        >
          <circle
            cx="40"
            cy="40"
            r="35"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="110"
            strokeDashoffset="35"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
}
