import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD6DY3gvL6qfPlNAdYth09mcS9FPW7W-MU',
  authDomain: 'accapp-bd7a0.firebaseapp.com',
  projectId: 'accapp-bd7a0',
  storageBucket: 'accapp-bd7a0.firebasestorage.app',
  messagingSenderId: '430323754842',
  appId: '1:430323754842:web:baac0b5d3c1e6dd55af563',
};

// Track whether this is the VERY FIRST time the JS runtime has booted.
// On a hot-reload the native app instance persists, but the JS module registry
// is wiped clean — so we must NOT call initializeAuth a second time.
const isFirstLoad = getApps().length === 0;
const app = isFirstLoad ? initializeApp(firebaseConfig) : getApp();

// Only call initializeAuth (with AsyncStorage persistence) on the very first load.
// On subsequent hot-reloads we simply retrieve the already-registered instance.
export const auth = isFirstLoad
  ? initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
  : getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);
