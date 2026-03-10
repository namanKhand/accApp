import {
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    where,
    updateDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { PartnerInvite } from '../types';

const INVITES = 'invites';

export const inviteService = {
    /**
     * Fetch invites sent BY this user (to check if they are waiting for someone to accept)
     */
    getSentInvites: async (userId: string): Promise<PartnerInvite[]> => {
        try {
            const q = query(
                collection(db, INVITES),
                where('senderId', '==', userId),
                where('status', '==', 'pending')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data()
            } as PartnerInvite));
        } catch (error) {
            console.error('Error fetching sent invites:', error);
            return []; // Fail gracefully
        }
    },

    /**
     * Fetch invites sent TO this user (by email)
     */
    getReceivedInvites: async (email: string | undefined): Promise<PartnerInvite[]> => {
        if (!email) return [];
        try {
            const q = query(
                collection(db, INVITES),
                where('recipientEmail', '==', email.toLowerCase()),
                where('status', '==', 'pending')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data()
            } as PartnerInvite));
        } catch (error) {
            console.error('Error fetching received invites:', error);
            return []; // Fail gracefully
        }
    },

    /**
     * Create a new invite
     */
    createInvite: async (inviteData: Omit<PartnerInvite, 'id' | 'status' | 'createdAt'>): Promise<string> => {
        try {
            const inviteRef = doc(collection(db, INVITES));
            const invite: Omit<PartnerInvite, 'id'> = {
                ...inviteData,
                recipientEmail: inviteData.recipientEmail.toLowerCase(),
                status: 'pending',
                createdAt: new Date().toISOString(),
            };

            await setDoc(inviteRef, {
                ...invite,
                createdAt: serverTimestamp(), // Use server time for database sorting
            });
            return inviteRef.id;
        } catch (error) {
            console.error('Error creating invite:', error);
            throw error;
        }
    },

    /**
     * Update invite status (e.g. to 'accepted' or 'declined')
     */
    updateInviteStatus: async (inviteId: string, status: 'accepted' | 'declined'): Promise<void> => {
        try {
            const inviteRef = doc(db, INVITES, inviteId);
            await updateDoc(inviteRef, { status });
        } catch (error) {
            console.error('Error updating invite status:', error);
            throw error;
        }
    }
};
