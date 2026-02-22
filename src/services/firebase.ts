import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD6DY3gvL6qfPlNAdYth09mcS9FPW7W-MU',
  authDomain: 'accapp-bd7a0.firebaseapp.com',
  projectId: 'accapp-bd7a0',
  storageBucket: 'accapp-bd7a0.firebasestorage.app',
  messagingSenderId: '430323754842',
  appId: '1:430323754842:web:baac0b5d3c1e6dd55af563',
};

// Prevent duplicate initialization during Expo fast-refresh
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
