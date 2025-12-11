import { db } from './firebase';
import { CheckIn } from '../types';

class CheckInService {
  private collectionName = 'checkins';

  async getCheckIns(userId: string): Promise<CheckIn[]> {
    try {
      const snapshot = await db.collection(this.collectionName)
        .where('userId', '==', userId)
        .get();

      const checkIns: CheckIn[] = [];
      snapshot.forEach((doc: any) => {
        checkIns.push({ id: doc.id, ...doc.data() } as CheckIn);
      });

      return checkIns;
    } catch (e) {
      console.error('Error fetching checkins', e);
      return [];
    }
  }

  async createCheckIn(checkIn: Omit<CheckIn, 'id'>) {
    try {
      await db.collection(this.collectionName).add(checkIn);
    } catch (e) {
      console.error('Error creating checkin', e);
      throw e;
    }
  }
}

export const checkInService = new CheckInService();
