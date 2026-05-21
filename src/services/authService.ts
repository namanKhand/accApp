import { getApp } from '@react-native-firebase/app';
import auth, {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  getIdToken,
  FirebaseAuthTypes,
} from '@react-native-firebase/auth';
import firestore, { getFirestore, collection, doc, getDoc, setDoc } from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';
import { UserProfile } from '../types';

// WEB_CLIENT_ID from Firebase Console → Authentication → Sign-in method → Google → Web client ID
const GOOGLE_WEB_CLIENT_ID = '430323754842-REPLACE_WITH_WEB_CLIENT_ID.apps.googleusercontent.com';

const getFirebaseAuth = () => getAuth(getApp());
const getFirebaseDb = () => getFirestore(getApp());

async function buildProfile(firebaseUser: FirebaseAuthTypes.User): Promise<UserProfile> {
  try {
    await getIdToken(firebaseUser);
    const snap = await getDoc(doc(getFirebaseDb(), 'users', firebaseUser.uid));
    if (snap.exists()) {
      const data = snap.data() as Partial<UserProfile>;
      return {
        id: data.id ?? firebaseUser.uid,
        email: data.email ?? firebaseUser.email ?? '',
        displayName: data.displayName ?? firebaseUser.displayName ?? 'User',
        photoURL: data.photoURL ?? firebaseUser.photoURL ?? undefined,
        phoneNumber: data.phoneNumber,
        partnerId: data.partnerId,
      };
    }
  } catch (e) {
    console.error('buildProfile Firestore read failed:', e);
  }
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    displayName: firebaseUser.displayName ?? 'User',
    photoURL: firebaseUser.photoURL ?? undefined,
  };
}

class AuthService {
  async signUp(email: string, password: string, displayName: string): Promise<UserProfile> {
    const normalizedEmail = email.trim().toLowerCase();
    const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), normalizedEmail, password);
    await updateProfile(credential.user, { displayName });
    const profile: UserProfile = { id: credential.user.uid, email: normalizedEmail, displayName };
    try {
      await setDoc(doc(getFirebaseDb(), 'users', credential.user.uid), profile);
    } catch (e) {
      console.error('Firestore profile write failed (auth succeeded):', e);
    }
    return profile;
  }

  async signIn(email: string, password: string): Promise<UserProfile> {
    const normalizedEmail = email.trim().toLowerCase();
    const credential = await signInWithEmailAndPassword(getFirebaseAuth(), normalizedEmail, password);
    return buildProfile(credential.user);
  }

  async signOut(): Promise<void> {
    await signOut(getFirebaseAuth());
  }

  async signInWithGoogle(): Promise<UserProfile> {
    GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID, offlineAccess: false });
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult.data?.idToken;
    if (!idToken) throw new Error('Google Sign-In failed: no ID token returned.');
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const credential = await getFirebaseAuth().signInWithCredential(googleCredential);
    // Persist display name & photo if this is a new user
    if (credential.user.displayName || credential.user.photoURL) {
      try {
        await setDoc(doc(getFirebaseDb(), 'users', credential.user.uid), {
          id: credential.user.uid,
          email: credential.user.email ?? '',
          displayName: credential.user.displayName ?? 'User',
          photoURL: credential.user.photoURL ?? null,
        }, { merge: true });
      } catch (e) {
        console.error('Firestore profile upsert failed after Google sign-in:', e);
      }
    }
    return buildProfile(credential.user);
  }

  async signInWithApple(): Promise<UserProfile> {
    if (Platform.OS !== 'ios') {
      throw new Error('auth/apple-not-supported');
    }
    if (!(await AppleAuthentication.isAvailableAsync())) {
      throw new Error('auth/apple-not-available');
    }

    // Generate a nonce so Firebase can verify the Apple-issued identity token
    const rawNonce = Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      rawNonce,
    );

    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    if (!appleCredential.identityToken) {
      throw new Error('Apple Sign-In failed: no identity token returned.');
    }

    const firebaseCredential = auth.AppleAuthProvider.credential(
      appleCredential.identityToken,
      rawNonce,
    );
    const credential = await getFirebaseAuth().signInWithCredential(firebaseCredential);

    // Apple only returns fullName / email on the FIRST sign-in. Persist what we get.
    const displayName = appleCredential.fullName
      ? [appleCredential.fullName.givenName, appleCredential.fullName.familyName]
          .filter(Boolean).join(' ').trim()
      : null;
    const email = appleCredential.email ?? credential.user.email ?? '';

    try {
      await setDoc(doc(getFirebaseDb(), 'users', credential.user.uid), {
        id: credential.user.uid,
        email,
        displayName: displayName || credential.user.displayName || 'User',
      }, { merge: true });

      if (displayName && !credential.user.displayName) {
        await updateProfile(credential.user, { displayName });
      }
    } catch (e) {
      console.error('Firestore profile upsert failed after Apple sign-in:', e);
    }

    return buildProfile(credential.user);
  }

  async verifyPasswordResetCode(code: string): Promise<string> {
    return getFirebaseAuth().verifyPasswordResetCode(code.trim());
  }

  async confirmPasswordReset(code: string, newPassword: string): Promise<void> {
    await getFirebaseAuth().confirmPasswordReset(code.trim(), newPassword);
  }

  listenToAuthState(callback: (user: UserProfile | null) => void): () => void {
    return onAuthStateChanged(getFirebaseAuth(), async (firebaseUser) => {
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
