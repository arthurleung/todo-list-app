import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyC8st65tnS7bI-jl1HOryGQlZdQOdvGV5A",
  authDomain: "to-do-list-3b66b.firebaseapp.com",
  projectId: "to-do-list-3b66b",
  storageBucket: "to-do-list-3b66b.firebasestorage.app",
  messagingSenderId: "255180522264",
  appId: "1:255180522264:web:85d7200096739b7b87946d",
  measurementId: "G-V7DMVWT99Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);