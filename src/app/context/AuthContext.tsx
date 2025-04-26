'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  User,
  Auth,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set persistence to LOCAL
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('Persistence set to LOCAL');
      })
      .catch((error) => {
        console.error('Error setting persistence:', error);
      });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      if (user) {
        console.log('User details:', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        });
      }
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {
      console.error('Auth not initialized');
      return;
    }

    console.log('Starting Google sign in process');
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    try {
      console.log('Initiating popup sign in');
      const result = await signInWithPopup(auth, provider);
      console.log('Sign in successful:', result.user);
      setUser(result.user);
    } catch (error: any) {
      console.error('Error in signInWithGoogle:', error);
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up was blocked by the browser. Please allow pop-ups for this site.');
      } else {
        throw error;
      }
    }
  };

  const logout = async () => {
    if (!auth) {
      console.error('Auth not initialized');
      return;
    }

    try {
      await signOut(auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 