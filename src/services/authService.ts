import { UserProfile } from '../types';
import { randomId } from '../utils/ids';

class MockAuthService {
  private user: UserProfile | null = null;
  private listeners: Array<(user: UserProfile | null) => void> = [];

  onAuthStateChanged(callback: (user: UserProfile | null) => void) {
    this.listeners.push(callback);
    callback(this.user);
    return () => {
      this.listeners = this.listeners.filter((fn) => fn !== callback);
    };
  }

  async signInWithPhone(phoneNumber: string, displayName: string) {
    this.user = {
      id: randomId(),
      phoneNumber,
      displayName
    };
    this.notify();
    return this.user;
  }

  async signOut() {
    this.user = null;
    this.notify();
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.user));
  }
}

export const authService = new MockAuthService();
