'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signInWithGoogle, loading, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    console.log('Login component mounted');
    console.log('Current auth state:', { loading, user });
  }, [loading, user]);

  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Sign in button clicked');
    
    if (isSigningIn || loading) {
      console.log('Sign in already in progress');
      return;
    }
    
    try {
      setIsSigningIn(true);
      setError(null);
      console.log('Attempting to sign in...');
      await signInWithGoogle();
      console.log('Sign in successful');
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading || isSigningIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            <p className="text-gray-600">Signing in...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is already logged in, don't show login screen
  if (user) {
    console.log('User already logged in, redirecting...');
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome to Todo List</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <button
          type="button"
          onClick={handleSignIn}
          disabled={isSigningIn || loading}
          className={`w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 rounded-lg px-6 py-3 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-all duration-200 shadow-sm ${
            (isSigningIn || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="font-medium">
            {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
          </span>
        </button>
      </div>
    </div>
  );
} 