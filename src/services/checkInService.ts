import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckIn } from '../types';
import { randomId } from '../utils/ids';

const CHECKINS_KEY = 'acc_app_checkins';

class CheckInService {
  async getCheckIns(userId: string): Promise<CheckIn[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(CHECKINS_KEY);
      const checkIns: CheckIn[] = jsonValue != null ? JSON.parse(jsonValue) : [];
      return checkIns.filter((checkIn) => checkIn.userId === userId);
    } catch (e) {
      console.error('Error fetching checkins', e);
      return [];
    }
  }

  async createCheckIn(checkIn: Omit<CheckIn, 'id'>) {
    try {
      const checkIns = await this.getAllCheckIns();
      const entry: CheckIn = { ...checkIn, id: randomId() };
      checkIns.push(entry);
      await AsyncStorage.setItem(CHECKINS_KEY, JSON.stringify(checkIns));
    } catch (e) {
      console.error('Error creating checkin', e);
    }
  }

  private async getAllCheckIns(): Promise<CheckIn[]> {
    const jsonValue = await AsyncStorage.getItem(CHECKINS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  }
}

export const checkInService = new CheckInService();
