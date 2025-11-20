export interface UserProfile {
  id: string;
  phoneNumber: string;
  displayName: string;
  photoURL?: string;
  partnerId?: string;
}

export interface Goal {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  cadence: 'daily' | 'weekly' | 'custom';
  customSchedule?: string;
  startDate: string;
  endDate?: string;
  streak: number;
  partnerId: string;
  status: 'active' | 'paused' | 'completed';
}

export interface CheckIn {
  id: string;
  userId: string;
  goalId: string;
  date: string;
  photoUri?: string;
  notes?: string;
  verifiedByPartner: boolean;
}

export interface Nudge {
  id: string;
  senderId: string;
  recipientId: string;
  goalId: string;
  message: string;
  createdAt: string;
}

export interface PartnerInvite {
  id: string;
  senderId: string;
  recipientPhone: string;
  goalId?: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface StreakDay {
  date: string;
  completed: boolean;
}
