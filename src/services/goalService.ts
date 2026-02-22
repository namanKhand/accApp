import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Goal } from '../types';

const GOALS = 'goals';

class GoalService {
  /** Get all goals where the user is the owner or the partner */
  async getGoals(userId: string): Promise<Goal[]> {
    try {
      const col = collection(db, GOALS);

      const [ownerSnap, partnerSnap] = await Promise.all([
        getDocs(query(col, where('ownerId', '==', userId))),
        getDocs(query(col, where('partnerId', '==', userId))),
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
      if (id) {
        // If an ID was pre-assigned keep it via setDoc
        const { setDoc, doc: docFn } = await import('firebase/firestore');
        await setDoc(docFn(db, GOALS, id), { ...goalData, createdAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, GOALS), { ...goalData, createdAt: serverTimestamp() });
      }
    } catch (e) {
      console.error('Error creating goal', e);
    }
  }

  /** Update an existing goal */
  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<void> {
    try {
      await updateDoc(doc(db, GOALS, goalId), updates as Record<string, unknown>);
    } catch (e) {
      console.error('Error updating goal', e);
    }
  }
}

export const goalService = new GoalService();
