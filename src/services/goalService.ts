import firestore from '@react-native-firebase/firestore';
import { Goal } from '../types';

const GOALS = 'goals';

class GoalService {
  /** Get all goals where the user is the owner or the partner */
  async getGoals(userId: string): Promise<Goal[]> {
    try {
      const col = firestore().collection(GOALS);

      const [ownerSnap, partnerSnap] = await Promise.all([
        col.where('ownerId', '==', userId).get(),
        col.where('partnerId', '==', userId).get(),
      ]);

      const seen = new Set<string>();
      const goals: Goal[] = [];

      for (const snap of [...ownerSnap.docs, ...partnerSnap.docs]) {
        if (!seen.has(snap.id)) {
          seen.add(snap.id);
          goals.push({ ...(snap.data() as Goal), id: snap.id });
        }
      }

      return goals;
    } catch (e) {
      console.error('Error fetching goals', e);
      return [];
    }
  }

  /** Create a new goal in Firestore */
  async createGoal(goal: Goal): Promise<void> {
    try {
      const { id, ...goalData } = goal;
      const data = { ...goalData, createdAt: firestore.FieldValue.serverTimestamp() };
      if (id) {
        await firestore().collection(GOALS).doc(id).set(data);
      } else {
        await firestore().collection(GOALS).add(data);
      }
    } catch (e) {
      console.error('Error creating goal', e);
    }
  }

  /** Update an existing goal */
  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<void> {
    try {
      await firestore().collection(GOALS).doc(goalId).update(updates as Record<string, unknown>);
    } catch (e) {
      console.error('Error updating goal', e);
    }
  }
}

export const goalService = new GoalService();
