import firestore from '@react-native-firebase/firestore';
import { Nudge } from '../types';

const NUDGES = 'nudges';

class NudgeService {
  /** Get nudges sent to or from a user */
  async getNudges(userId: string): Promise<Nudge[]> {
    try {
      const col = firestore().collection(NUDGES);

      const [sentSnap, receivedSnap] = await Promise.all([
        col.where('senderId', '==', userId).get(),
        col.where('recipientId', '==', userId).get(),
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
      await firestore().collection(NUDGES).add({
        ...nudge,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (e) {
      console.error('Error creating nudge', e);
    }
  }
}

export const nudgeService = new NudgeService();
