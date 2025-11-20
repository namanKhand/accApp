import { Goal } from '../types';
import { randomId } from '../utils/ids';

class GoalService {
  private goals: Goal[] = [];

  async getGoals(userId: string) {
    return this.goals.filter((goal) => goal.ownerId === userId || goal.partnerId === userId);
  }

  async createGoal(goal: Goal) {
    this.goals.push(goal.id ? goal : { ...goal, id: randomId() });
  }

  async updateGoal(goalId: string, updates: Partial<Goal>) {
    this.goals = this.goals.map((goal) => (goal.id === goalId ? { ...goal, ...updates } : goal));
  }
}

export const goalService = new GoalService();
