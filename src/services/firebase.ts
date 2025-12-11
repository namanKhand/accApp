// @ts-ignore
import firebase from 'firebase/compat/app';
// @ts-ignore
import 'firebase/compat/auth';
// @ts-ignore
import 'firebase/compat/firestore';
// @ts-ignore
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyADozZE8MOHmizRAUGwFbTBlCzaKkCkY5w",
  authDomain: "accoutability-app.firebaseapp.com",
  projectId: "accoutability-app",
  storageBucket: "accoutability-app.firebasestorage.app",
  messagingSenderId: "592757889484",
  appId: "1:592757889484:web:204a743d568bcf809ca569",
  measurementId: "G-0GXC7EJEKE"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export services using compat API
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
