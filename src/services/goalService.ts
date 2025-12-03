import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal } from '../types';
import { randomId } from '../utils/ids';

const GOALS_KEY = 'acc_app_goals';

class GoalService {
  async getGoals(userId: string): Promise<Goal[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(GOALS_KEY);
      const goals: Goal[] = jsonValue != null ? JSON.parse(jsonValue) : [];
      return goals.filter((goal) => goal.ownerId === userId || goal.partnerId === userId);
    } catch (e) {
      console.error('Error fetching goals', e);
      return [];
    }
  }

  async createGoal(goal: Goal) {
    try {
      const goals = await this.getAllGoals();
      const newGoal = goal.id ? goal : { ...goal, id: randomId() };
      goals.push(newGoal);
      await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
    } catch (e) {
      console.error('Error creating goal', e);
    }
  }

  async updateGoal(goalId: string, updates: Partial<Goal>) {
    try {
      const goals = await this.getAllGoals();
      const updatedGoals = goals.map((goal) => (goal.id === goalId ? { ...goal, ...updates } : goal));
      await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals));
    } catch (e) {
      console.error('Error updating goal', e);
    }
  }

  private async getAllGoals(): Promise<Goal[]> {
    const jsonValue = await AsyncStorage.getItem(GOALS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  }
}

export const goalService = new GoalService();
