import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from '../types';

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

async function buildProfile(firebaseUser: User): Promise<UserProfile> {
  const ref = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  // Fallback profile if doc doesn't exist yet
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    displayName: firebaseUser.displayName ?? 'User',
    photoURL: firebaseUser.photoURL ?? undefined,
  };
}

// ------------------------------------------------------------------
// Auth Service
// ------------------------------------------------------------------

class AuthService {
  /** Sign up with email + password, then write a user profile doc to Firestore */
  async signUp(email: string, password: string, displayName: string): Promise<UserProfile> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const profile: UserProfile = {
      id: credential.user.uid,
      email,
      displayName,
    };
    await setDoc(doc(db, 'users', credential.user.uid), profile);
    return profile;
  }

  /** Sign in with email + password */
  async signIn(email: string, password: string): Promise<UserProfile> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return buildProfile(credential.user);
  }

  /** Sign out */
  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  /**
   * Listen to auth state changes.
   * Returns an unsubscribe function (matches the existing AppContext usage).
   */
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await buildProfile(firebaseUser);
        callback(profile);
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();
