import { getApp } from '@react-native-firebase/app';
import firestore, {
  collection,
  addDoc,
  getDocs,
  setDoc,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import { Goal } from '../types';

const db = () => firestore(getApp());
const GOALS = 'goals';

class GoalService {
  async getGoals(userId: string): Promise<Goal[]> {
    try {
      const col = collection(db(), GOALS);
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

  async createGoal(goal: Goal): Promise<void> {
    try {
      const { id, ...goalData } = goal;
      const data = { ...goalData, createdAt: serverTimestamp() };
      if (id) {
        await setDoc(doc(db(), GOALS, id), data);
      } else {
        await addDoc(collection(db(), GOALS), data);
      }
    } catch (e) {
      console.error('Error creating goal', e);
    }
  }

  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<void> {
    try {
      await updateDoc(doc(db(), GOALS, goalId), updates as Record<string, unknown>);
    } catch (e) {
      console.error('Error updating goal', e);
    }
  }
}

export const goalService = new GoalService();
