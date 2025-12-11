import { auth } from './firebase';
import { UserProfile } from '../types';

class AuthService {
  onAuthStateChanged(callback: (user: UserProfile | null) => void) {
    return auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const userProfile: UserProfile = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'User',
          photoURL: firebaseUser.photoURL || undefined,
          phoneNumber: firebaseUser.phoneNumber || undefined,
        };
        callback(userProfile);
      } else {
        callback(null);
      }
    });
  }

  async signIn(email: string, pass: string) {
    const userCredential = await auth.signInWithEmailAndPassword(email, pass);
    return userCredential.user;
  }

  async signUp(email: string, pass: string, displayName: string) {
    const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
    if (userCredential.user) {
      await userCredential.user.updateProfile({ displayName });
    }
    return userCredential.user;
  }

  async signOut() {
    await auth.signOut();
  }
}

export const authService = new AuthService();
