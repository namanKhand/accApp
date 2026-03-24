import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { CheckIn } from '../types';

const CHECKINS = 'checkIns';

class CheckInService {
  /** Upload a local file URI to Firebase Storage and return the download URL */
  private async uploadPhoto(localUri: string, userId: string): Promise<string> {
    const filename = `checkIns/${userId}/${Date.now()}.jpg`;
    const ref = storage().ref(filename);
    await ref.putFile(localUri);
    return ref.getDownloadURL();
  }

  /** Get all check-ins for a specific goal (includes both partners) */
  async getCheckInsForGoal(goalId: string): Promise<CheckIn[]> {
    try {
      if (!goalId) return [];
      const snap = await firestore()
        .collection(CHECKINS)
        .where('goalId', '==', goalId)
        .get();
      return snap.docs.map((d) => ({ ...(d.data() as CheckIn), id: d.id }));
    } catch (e) {
      console.error('Error fetching checkIns', e);
      return [];
    }
  }

  /** Create a check-in, uploading any photo first if it is a local URI */
  async createCheckIn(checkIn: Omit<CheckIn, 'id'>): Promise<void> {
    try {
      let { photoUri, checkOutPhotoUri, ...rest } = checkIn;

      if (photoUri && !photoUri.startsWith('https://')) {
        photoUri = await this.uploadPhoto(photoUri, checkIn.userId);
      }

      if (checkOutPhotoUri && !checkOutPhotoUri.startsWith('https://')) {
        checkOutPhotoUri = await this.uploadPhoto(checkOutPhotoUri, checkIn.userId);
      }

      await firestore().collection(CHECKINS).add({
        ...rest,
        photoUri: photoUri ?? null,
        checkOutPhotoUri: checkOutPhotoUri ?? null,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (e) {
      console.error('Error creating checkIn', e);
      throw e;
    }
  }
}

export const checkInService = new CheckInService();
