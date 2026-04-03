import { getApp } from '@react-native-firebase/app';
import firestore, {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import storage, { ref, putFile, getDownloadURL } from '@react-native-firebase/storage';
import { CheckIn } from '../types';

const db = () => firestore(getApp());
const st = () => storage(getApp());
const CHECKINS = 'checkIns';

class CheckInService {
  private async uploadPhoto(localUri: string, userId: string): Promise<string> {
    const filename = `checkIns/${userId}/${Date.now()}.jpg`;
    const storageRef = ref(st(), filename);
    await putFile(storageRef, localUri);
    return getDownloadURL(storageRef);
  }

  async getCheckInsForGoal(goalId: string): Promise<CheckIn[]> {
    try {
      if (!goalId) return [];
      const snap = await getDocs(query(collection(db(), CHECKINS), where('goalId', '==', goalId)));
      return snap.docs.map((d: { id: string; data: () => object }) => ({ ...(d.data() as CheckIn), id: d.id }));
    } catch (e) {
      console.error('Error fetching checkIns', e);
      return [];
    }
  }

  async createCheckIn(checkIn: Omit<CheckIn, 'id'>): Promise<void> {
    try {
      let { photoUri, checkOutPhotoUri, ...rest } = checkIn;
      if (photoUri && !photoUri.startsWith('https://')) {
        photoUri = await this.uploadPhoto(photoUri, checkIn.userId);
      }
      if (checkOutPhotoUri && !checkOutPhotoUri.startsWith('https://')) {
        checkOutPhotoUri = await this.uploadPhoto(checkOutPhotoUri, checkIn.userId);
      }
      await addDoc(collection(db(), CHECKINS), {
        ...rest,
        photoUri: photoUri ?? null,
        checkOutPhotoUri: checkOutPhotoUri ?? null,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('Error creating checkIn', e);
      throw e;
    }
  }
}

export const checkInService = new CheckInService();
