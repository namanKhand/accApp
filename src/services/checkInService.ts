import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { CheckIn } from '../types';

const CHECKINS = 'checkIns';

class CheckInService {
  /** Upload a local file URI to Firebase Storage and return the download URL */
  private async uploadPhoto(localUri: string, userId: string): Promise<string> {
    const filename = `checkIns/${userId}/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);

    // Convert the local file URI to a Blob
    const response = await fetch(localUri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);
    return getDownloadURL(storageRef);
  }

  /** Get all check-ins for a specific goal (includes both partners) */
  async getCheckInsForGoal(goalId: string): Promise<CheckIn[]> {
    try {
      if (!goalId) return [];
      const snap = await getDocs(
        query(collection(db, CHECKINS), where('goalId', '==', goalId))
      );
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

      // Upload check-in photo if it's a local file
      if (photoUri && !photoUri.startsWith('https://')) {
        photoUri = await this.uploadPhoto(photoUri, checkIn.userId);
      }

      // Upload check-out photo if it's a local file
      if (checkOutPhotoUri && !checkOutPhotoUri.startsWith('https://')) {
        checkOutPhotoUri = await this.uploadPhoto(checkOutPhotoUri, checkIn.userId);
      }

      await addDoc(collection(db, CHECKINS), {
        ...rest,
        photoUri: photoUri ?? null,
        checkOutPhotoUri: checkOutPhotoUri ?? null,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('Error creating checkIn', e);
    }
  }
}

export const checkInService = new CheckInService();
