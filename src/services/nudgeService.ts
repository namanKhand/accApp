import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Nudge } from '../types';

const NUDGES = 'nudges';

class NudgeService {
  /** Get nudges sent to or from a user */
  async getNudges(userId: string): Promise<Nudge[]> {
    try {
      const col = collection(db, NUDGES);

      const [sentSnap, receivedSnap] = await Promise.all([
        getDocs(query(col, where('senderId', '==', userId))),
        getDocs(query(col, where('recipientId', '==', userId))),
      ]);

      const seen = new Set<string>();
      const nudges: Nudge[] = [];

      for (const snap of [...sentSnap.docs, ...receivedSnap.docs]) {
        if (!seen.has(snap.id)) {
          seen.add(snap.id);
          nudges.push({ ...(snap.data() as Nudge), id: snap.id });
        }
      }

      return nudges;
    } catch (e) {
      console.error('Error fetching nudges', e);
      return [];
    }
  }

  /** Send a nudge */
  async createNudge(nudge: Omit<Nudge, 'id' | 'createdAt'>): Promise<void> {
    try {
      await addDoc(collection(db, NUDGES), {
        ...nudge,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('Error creating nudge', e);
    }
  }
}

export const nudgeService = new NudgeService();
