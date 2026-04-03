import { getApp } from '@react-native-firebase/app';
import firestore, {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import { PartnerInvite } from '../types';

const db = () => firestore(getApp());
const INVITES = 'invites';

export const inviteService = {
  getSentInvites: async (userId: string): Promise<PartnerInvite[]> => {
    try {
      const snapshot = await getDocs(
        query(collection(db(), INVITES),
          where('senderId', '==', userId),
          where('status', '==', 'pending'))
      );
      return snapshot.docs.map((d: { id: string; data: () => object }) => ({ id: d.id, ...d.data() } as PartnerInvite));
    } catch (error) {
      console.error('Error fetching sent invites:', error);
      return [];
    }
  },

  getReceivedInvites: async (email: string | undefined): Promise<PartnerInvite[]> => {
    if (!email) return [];
    try {
      const snapshot = await getDocs(
        query(collection(db(), INVITES),
          where('recipientEmail', '==', email.toLowerCase()),
          where('status', '==', 'pending'))
      );
      return snapshot.docs.map((d: { id: string; data: () => object }) => ({ id: d.id, ...d.data() } as PartnerInvite));
    } catch (error) {
      console.error('Error fetching received invites:', error);
      return [];
    }
  },

  createInvite: async (inviteData: Omit<PartnerInvite, 'id' | 'status' | 'createdAt'>): Promise<string> => {
    try {
      const ref = await addDoc(collection(db(), INVITES), {
        ...inviteData,
        recipientEmail: inviteData.recipientEmail.toLowerCase(),
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      return ref.id;
    } catch (error) {
      console.error('Error creating invite:', error);
      throw error;
    }
  },

  updateInviteStatus: async (inviteId: string, status: 'accepted' | 'declined'): Promise<void> => {
    try {
      await updateDoc(doc(db(), INVITES, inviteId), { status });
    } catch (error) {
      console.error('Error updating invite status:', error);
      throw error;
    }
  },
};
