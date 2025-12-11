import { db } from './firebase';
import { Goal } from '../types';

class GoalService {
  private collectionName = 'goals';

  async getGoals(userId: string): Promise<Goal[]> {
    try {
      // Fetch goals where user is owner OR partner
      const snapshot = await db.collection(this.collectionName)
        .where('ownerId', '==', userId)
        .get();

      const partnerSnapshot = await db.collection(this.collectionName)
        .where('partnerId', '==', userId)
        .get();

      // Combine both results
      const goals: Goal[] = [];
      snapshot.forEach(doc => {
        goals.push({ id: doc.id, ...doc.data() } as Goal);
      });
      partnerSnapshot.forEach(doc => {
        // Avoid duplicates
        if (!goals.find(g => g.id === doc.id)) {
          goals.push({ id: doc.id, ...doc.data() } as Goal);
        }
      });

      return goals;
    } catch (e) {
      console.error('Error fetching goals', e);
      return [];
    }
  }

  async createGoal(goal: Goal) {
    try {
      // Remove id if it exists, let Firestore generate it
      const { id, ...goalData } = goal;
      await db.collection(this.collectionName).add(goalData);
    } catch (e) {
      console.error('Error creating goal', e);
      throw e;
    }
  }

  async updateGoal(goalId: string, updates: Partial<Goal>) {
    try {
      await db.collection(this.collectionName).doc(goalId).update(updates);
    } catch (e) {
      console.error('Error updating goal', e);
      throw e;
    }
  }
}

export const goalService = new GoalService();
