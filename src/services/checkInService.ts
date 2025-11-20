import { CheckIn } from '../types';
import { randomId } from '../utils/ids';

class CheckInService {
  private checkIns: CheckIn[] = [];

  async getCheckIns(userId: string) {
    return this.checkIns.filter((checkIn) => checkIn.userId === userId);
  }

  async createCheckIn(checkIn: Omit<CheckIn, 'id'>) {
    const entry: CheckIn = { ...checkIn, id: randomId() };
    this.checkIns.push(entry);
  }
}

export const checkInService = new CheckInService();
