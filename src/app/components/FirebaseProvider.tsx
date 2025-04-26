'use client';

import { useEffect, useState } from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Import Firebase config dynamically to ensure it only runs on client
    import('../firebase/config').then(() => {
      setIsInitialized(true);
    });
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <AuthProvider>{children}</AuthProvider>;
} 