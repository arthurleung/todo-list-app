'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check if all required config values are present
const missingConfig = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingConfig.length > 0) {
  console.error('Missing Firebase configuration values:', missingConfig);
}

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let analytics: Analytics | null = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  console.log('Firebase initialized successfully');
  
  db = getFirestore(app);
  auth = getAuth(app);

  // Initialize Analytics only if supported
  if (typeof window !== 'undefined') {
    isSupported().then(yes => {
      if (yes) {
        analytics = getAnalytics(app);
        console.log('Analytics initialized successfully');
      } else {
        console.log('Analytics not supported in this environment');
      }
    });
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { db, auth, analytics };