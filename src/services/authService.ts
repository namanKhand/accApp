import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { UserProfile } from '../types';

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

async function buildProfile(firebaseUser: FirebaseAuthTypes.User): Promise<UserProfile> {
  const snap = await firestore().collection('users').doc(firebaseUser.uid).get();
  if (snap.exists) {
    return snap.data() as UserProfile;
  }
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
    const credential = await auth().createUserWithEmailAndPassword(email, password);
    const profile: UserProfile = {
      id: credential.user.uid,
      email,
      displayName,
    };
    await firestore().collection('users').doc(credential.user.uid).set(profile);
    return profile;
  }

  /** Sign in with email + password */
  async signIn(email: string, password: string): Promise<UserProfile> {
    const credential = await auth().signInWithEmailAndPassword(email, password);
    return buildProfile(credential.user);
  }

  /** Sign out */
  async signOut(): Promise<void> {
    await auth().signOut();
  }

  /** Listen to auth state changes. Returns an unsubscribe function. */
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    return auth().onAuthStateChanged(async (firebaseUser) => {
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
