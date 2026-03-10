import firestore from '@react-native-firebase/firestore';
import { PartnerInvite } from '../types';

const INVITES = 'invites';

export const inviteService = {
    /** Fetch invites sent BY this user */
    getSentInvites: async (userId: string): Promise<PartnerInvite[]> => {
        try {
            const snapshot = await firestore()
                .collection(INVITES)
                .where('senderId', '==', userId)
                .where('status', '==', 'pending')
                .get();
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as PartnerInvite));
        } catch (error) {
            console.error('Error fetching sent invites:', error);
            return [];
        }
    },

    /** Fetch invites sent TO this user (by email) */
    getReceivedInvites: async (email: string | undefined): Promise<PartnerInvite[]> => {
        if (!email) return [];
        try {
            const snapshot = await firestore()
                .collection(INVITES)
                .where('recipientEmail', '==', email.toLowerCase())
                .where('status', '==', 'pending')
                .get();
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as PartnerInvite));
        } catch (error) {
            console.error('Error fetching received invites:', error);
            return [];
        }
    },

    /** Create a new invite */
    createInvite: async (inviteData: Omit<PartnerInvite, 'id' | 'status' | 'createdAt'>): Promise<string> => {
        try {
            const ref = await firestore().collection(INVITES).add({
                ...inviteData,
                recipientEmail: inviteData.recipientEmail.toLowerCase(),
                status: 'pending',
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
            return ref.id;
        } catch (error) {
            console.error('Error creating invite:', error);
            throw error;
        }
    },

    /** Update invite status */
    updateInviteStatus: async (inviteId: string, status: 'accepted' | 'declined'): Promise<void> => {
        try {
            await firestore().collection(INVITES).doc(inviteId).update({ status });
        } catch (error) {
            console.error('Error updating invite status:', error);
            throw error;
        }
    }
};
