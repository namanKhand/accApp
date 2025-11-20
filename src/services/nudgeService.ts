import { Nudge } from '../types';
import { randomId } from '../utils/ids';

class NudgeService {
  private nudges: Nudge[] = [];

  async getNudges(userId: string) {
    return this.nudges.filter((nudge) => nudge.recipientId === userId || nudge.senderId === userId);
  }

  async createNudge(nudge: Omit<Nudge, 'id' | 'createdAt'>) {
    const entry: Nudge = {
      ...nudge,
      id: randomId(),
      createdAt: new Date().toISOString()
    };
    this.nudges.push(entry);
  }
}

export const nudgeService = new NudgeService();
