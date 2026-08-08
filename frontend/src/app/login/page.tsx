'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/utils/api';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await authApi.guestLogin();
      router.push('/tasks');
    } catch (err: any) {
      console.error(err);
      setError('Unable to connect to the backend server. Please verify it is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    handleGuestLogin();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      
      {/* Decorative premium glowing background blobs */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-pink-400/20 blur-3xl dark:bg-pink-600/10 pointer-events-none"></div>

      <div className="relative w-full max-w-md space-y-8 rounded-3xl bg-white/80 p-10 shadow-2xl backdrop-blur-xl border border-white/40 dark:bg-slate-900/80 dark:border-slate-800/40 transition-all duration-300">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-primary-hover text-white shadow-xl shadow-primary/20 transform transition-transform duration-300 hover:rotate-12">
            {/* Pyramid icon */}
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 22h20L12 2z" />
            </svg>
          </div>
          <h2 className="mt-4 text-sm font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            Pyramid Workspace
          </h2>
        </div>

        {/* Header Text */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white bg-clip-text">
            Let's get back on track
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400">
            Select a login option to manage your caseload.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-xs font-medium text-red-650 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 animate-pulse">
            {error}
          </div>
        )}

        {/* Form / Actions */}
        <div className="space-y-4 pt-2">
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800 hover:shadow-xl hover:scale-[1.02] dark:bg-primary dark:hover:bg-primary-hover dark:shadow-primary/10 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Continue as Guest'}
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:scale-[1.02] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-50"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.29c1.92,-1.77 3.02,-4.38 3.02,-7.38c0,-0.66 -0.06,-1.3 -0.16,-1.82z" fill="#4285F4" />
                <path d="M12,20.62c2.43,0 4.47,-0.81 5.96,-2.2l-2.92,-2.26c-0.81,0.54 -1.85,0.87 -3.04,0.87c-2.34,0 -4.33,-1.58 -5.04,-3.7H3.59v2.66c1.49,2.96 4.56,4.63 7.82,4.63z" fill="#34A853" />
                <path d="M6.96,13.33c-0.18,-0.54 -0.28,-1.11 -0.28,-1.7c0,-0.59 0.1,-1.16 0.28,-1.7V7.27H3.59c-0.61,1.21 -0.96,2.57 -0.96,4.03c0,1.46 0.35,2.82 0.96,4.03l3.37,-2.67-0.01,-0.33z" fill="#FBBC05" />
                <path d="M12,6.38c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,3.69 14.43,3.02 12,3.02C8.74,3.02 5.67,4.69 4.18,7.65L7.27,9.98c0.71,-2.12 2.7,-3.6 5.04,-3.601z" fill="#EA4335" />
              </g>
            </svg>
            Login with Google
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 pt-2">
          By clicking continue, you agree to our{' '}
          <a href="#" className="underline text-slate-500 hover:text-primary dark:text-slate-400">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline text-slate-500 hover:text-primary dark:text-slate-400">
            Privacy Policy
          </a>
          .
        </p>

      </div>
    </div>
  );
}
