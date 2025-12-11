import { db } from './firebase';
import { Nudge } from '../types';

class NudgeService {
  private collectionName = 'nudges';

  async getNudges(userId: string) {
    try {
      // Fetch nudges where user is recipient OR sender
      const recipientSnapshot = await db.collection(this.collectionName)
        .where('recipientId', '==', userId)
        .get();

      const senderSnapshot = await db.collection(this.collectionName)
        .where('senderId', '==', userId)
        .get();

      // Combine both results
      const nudges: Nudge[] = [];
      recipientSnapshot.forEach((doc: any) => {
        nudges.push({ id: doc.id, ...doc.data() } as Nudge);
      });
      senderSnapshot.forEach((doc: any) => {
        // Avoid duplicates
        if (!nudges.find(n => n.id === doc.id)) {
          nudges.push({ id: doc.id, ...doc.data() } as Nudge);
        }
      });

      return nudges;
    } catch (e) {
      console.error('Error fetching nudges', e);
      return [];
    }
  }

  async createNudge(nudge: Omit<Nudge, 'id' | 'createdAt'>) {
    try {
      const nudgeData = {
        ...nudge,
        createdAt: new Date().toISOString()
      };
      await db.collection(this.collectionName).add(nudgeData);
    } catch (e) {
      console.error('Error creating nudge', e);
      throw e;
    }
  }
}

export const nudgeService = new NudgeService();
