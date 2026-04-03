import { getApp } from '@react-native-firebase/app';
import firestore, {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import { Nudge } from '../types';

const db = () => firestore(getApp());
const NUDGES = 'nudges';

class NudgeService {
  async getNudges(userId: string): Promise<Nudge[]> {
    try {
      const col = collection(db(), NUDGES);
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

  async createNudge(nudge: Omit<Nudge, 'id' | 'createdAt'>): Promise<void> {
    try {
      await addDoc(collection(db(), NUDGES), {
        ...nudge,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('Error creating nudge', e);
    }
  }
}

export const nudgeService = new NudgeService();
