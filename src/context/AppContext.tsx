import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Goal, CheckIn, UserProfile, Nudge, PartnerInvite } from '../types';
import { getApp } from '@react-native-firebase/app';
import firestore, { doc, setDoc } from '@react-native-firebase/firestore';
import { authService } from '../services/authService';
import { goalService } from '../services/goalService';
import { checkInService } from '../services/checkInService';
import { nudgeService } from '../services/nudgeService';
import { inviteService } from '../services/inviteService';
import { registerForPushNotificationsAsync } from '../services/notificationService';

const db = () => firestore(getApp());

interface AppContextValue {
  user: UserProfile | null;
  loading: boolean;
  goals: Goal[];
  checkIns: CheckIn[];
  nudges: Nudge[];
  sentInvites: PartnerInvite[];
  receivedInvites: PartnerInvite[];
  refreshData: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  recordCheckIn: (checkIn: Omit<CheckIn, 'id'>) => Promise<void>;
  sendNudge: (nudge: Omit<Nudge, 'id' | 'createdAt'>) => Promise<void>;
  sendInvite: (invite: Omit<PartnerInvite, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  acceptInvite: (invite: PartnerInvite) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [sentInvites, setSentInvites] = useState<PartnerInvite[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<PartnerInvite[]>([]);

  const userRef = useRef<UserProfile | null>(null);
  userRef.current = user;

  const loadData = useCallback(async (profile: UserProfile) => {
    const [goalData, nudgeData, sent, received] = await Promise.all([
      goalService.getGoals(profile.id),
      nudgeService.getNudges(profile.id),
      inviteService.getSentInvites(profile.id),
      inviteService.getReceivedInvites(profile.email),
    ]);
    const allCheckIns = await Promise.all(goalData.map(g => checkInService.getCheckInsForGoal(g.id)));
    setGoals(goalData);
    setCheckIns(allCheckIns.flat());
    setNudges(nudgeData);
    setSentInvites(sent);
    setReceivedInvites(received);
  }, []);

  const refreshData = useCallback(async () => {
    const currentUser = userRef.current;
    if (!currentUser) return;
    try {
      await loadData(currentUser);
    } catch (e) {
      console.error('refreshData error:', e);
    }
  }, [loadData]);

  const addGoal = useCallback(async (goal: Omit<Goal, 'id'>) => {
    const id = await goalService.createGoal(goal);
    setGoals(prev => [...prev, { ...goal, id }]);
    refreshData().catch(e => console.error('refreshData after addGoal:', e));
  }, [refreshData]);

  const recordCheckIn = useCallback(async (checkIn: Omit<CheckIn, 'id'>) => {
    await checkInService.createCheckIn(checkIn);
    // Update the goal's streak after a successful check-in
    const currentUser = userRef.current;
    if (currentUser) {
      try {
        const updatedGoals = await goalService.getGoals(currentUser.id);
        const goal = updatedGoals.find(g => g.id === checkIn.goalId);
        if (goal) {
          const allCheckIns = await checkInService.getCheckInsForGoal(goal.id);
          const { calculateCurrentStreak, calculateLongestStreak } = await import('../utils/streakUtils');
          const newStreak = calculateCurrentStreak(allCheckIns);
          const newLongest = Math.max(calculateLongestStreak(allCheckIns), goal.longestStreak ?? 0);
          await goalService.updateGoal(goal.id, { streak: newStreak, longestStreak: newLongest });
        }
      } catch (e) {
        console.error('Streak update error:', e);
      }
    }
    await refreshData();
  }, [refreshData]);

  const sendNudge = useCallback(async (nudge: Omit<Nudge, 'id' | 'createdAt'>) => {
    await nudgeService.createNudge(nudge);
    await refreshData();
  }, [refreshData]);

  const sendInvite = useCallback(async (invite: Omit<PartnerInvite, 'id' | 'status' | 'createdAt'>) => {
    const id = await inviteService.createInvite(invite);
    const newInvite: PartnerInvite = {
      ...invite,
      id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setSentInvites(prev => [...prev, newInvite]);
    refreshData().catch(e => console.error('refreshData after sendInvite:', e));
  }, [refreshData]);

  const acceptInvite = useCallback(async (invite: PartnerInvite) => {
    const currentUser = userRef.current;
    if (!currentUser) return;

    setLoading(true);
    try {
      const allGoals = await goalService.getGoals(invite.senderId);
      const targetGoal = allGoals.find(g => g.id === invite.goalId);
      if (!targetGoal) {
        throw new Error('Goal not found for this invite. Please contact support.');
      }

      // Atomically update invite, goal, and both user profiles in one batch
      const batch = db().batch();
      batch.update(doc(db(), 'invites', invite.id), { status: 'accepted' });
      batch.update(doc(db(), 'goals', targetGoal.id), { partnerId: currentUser.id });
      batch.set(doc(db(), 'users', currentUser.id), { partnerId: invite.senderId }, { merge: true });
      batch.set(doc(db(), 'users', invite.senderId), { partnerId: currentUser.id }, { merge: true });
      await batch.commit();

      // Immediately update local user state so RootNavigator transitions correctly
      setUser(prev => prev ? { ...prev, partnerId: invite.senderId } : null);
      await refreshData();
    } finally {
      setLoading(false);
    }
  }, [refreshData]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let active = true;

    const unsubscribe = authService.listenToAuthState(async (profile) => {
      if (interval) {
        clearInterval(interval);
        interval = undefined;
      }

      if (profile) {
        setUser(profile);
        setLoading(true);
        try {
          await loadData(profile);

          // Register push token and persist it to the user's Firestore profile
          registerForPushNotificationsAsync().then(async (token) => {
            if (token && active) {
              try {
                await setDoc(doc(db(), 'users', profile.id), { pushToken: token }, { merge: true });
              } catch (e) {
                console.warn('Could not save push token:', e);
              }
            }
          });

          // Poll every 5 s for invite updates while the user is logged in
          interval = setInterval(async () => {
            if (!active) return;
            try {
              const [sent, received] = await Promise.all([
                inviteService.getSentInvites(profile.id),
                inviteService.getReceivedInvites(profile.email),
              ]);
              if (active) {
                setSentInvites(sent);
                setReceivedInvites(received);
              }
            } catch {
              // Ignore transient polling errors
            }
          }, 5000);
        } finally {
          if (active) setLoading(false);
        }
      } else {
        if (active) {
          setUser(null);
          setGoals([]);
          setCheckIns([]);
          setNudges([]);
          setSentInvites([]);
          setReceivedInvites([]);
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
      if (interval) clearInterval(interval);
    };
  }, [loadData]);

  const value = useMemo(
    () => ({
      user, loading, goals, checkIns, nudges, sentInvites, receivedInvites,
      refreshData, addGoal, recordCheckIn, sendNudge, sendInvite, acceptInvite,
    }),
    [user, loading, goals, checkIns, nudges, sentInvites, receivedInvites,
      refreshData, addGoal, recordCheckIn, sendNudge, sendInvite, acceptInvite]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
