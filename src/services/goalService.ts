import { getApp } from '@react-native-firebase/app';
import firestore, {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import { Goal } from '../types';

const db = () => firestore(getApp());
const GOALS = 'goals';

type SafeGoalUpdates = Partial<Pick<Goal, 'partnerId' | 'status' | 'streak' | 'longestStreak' | 'endDate'>>;

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
      goals.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      return goals;
    } catch (e) {
      console.error('Error fetching goals', e);
      return [];
    }
  }

  async getGoalById(goalId: string): Promise<Goal | null> {
    try {
      const snap = await getDoc(doc(db(), GOALS, goalId));
      if (snap.exists()) {
        return { ...(snap.data() as Goal), id: snap.id };
      }
      return null;
    } catch (e) {
      console.error('Error fetching goal by ID', e);
      return null;
    }
  }

  async createGoal(goal: Omit<Goal, 'id'>): Promise<string> {
    const { ...goalData } = goal;
    const ref = await addDoc(collection(db(), GOALS), {
      ...goalData,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  }

  async updateGoal(goalId: string, updates: SafeGoalUpdates): Promise<void> {
    await updateDoc(doc(db(), GOALS, goalId), updates as Record<string, unknown>);
  }
}

export const goalService = new GoalService();
