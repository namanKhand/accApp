import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Goal, CheckIn, UserProfile, Nudge, PartnerInvite } from '../types';
import { authService } from '../services/authService';
import { goalService } from '../services/goalService';
import { checkInService } from '../services/checkInService';
import { nudgeService } from '../services/nudgeService';
import { inviteService } from '../services/inviteService';

interface AppContextValue {
  user: UserProfile | null;
  loading: boolean;
  goals: Goal[];
  checkIns: CheckIn[];
  nudges: Nudge[];
  sentInvites: PartnerInvite[];
  receivedInvites: PartnerInvite[];
  refreshData: () => Promise<void>;
  addGoal: (goal: Goal) => Promise<void>;
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

  const refreshData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [goalData, nudgeData, sent, received] = await Promise.all([
        goalService.getGoals(user.id),
        nudgeService.getNudges(user.id),
        inviteService.getSentInvites(user.id),
        inviteService.getReceivedInvites(user.email)
      ]);
      const allCheckIns = await Promise.all(goalData.map(g => checkInService.getCheckInsForGoal(g.id)));
      setGoals(goalData);
      setCheckIns(allCheckIns.flat());
      setNudges(nudgeData);
      setSentInvites(sent);
      setReceivedInvites(received);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goal: Goal) => {
    await goalService.createGoal(goal);
    await refreshData();
  };

  const recordCheckIn = async (checkIn: Omit<CheckIn, 'id'>) => {
    await checkInService.createCheckIn(checkIn);
    await refreshData();
  };

  const sendNudge = async (nudge: Omit<Nudge, 'id' | 'createdAt'>) => {
    await nudgeService.createNudge(nudge);
    await refreshData();
  };

  const sendInvite = async (invite: Omit<PartnerInvite, 'id' | 'status' | 'createdAt'>) => {
    await inviteService.createInvite(invite);
    await refreshData();
  };

  const acceptInvite = async (invite: PartnerInvite) => {
    if (!user) return;

    setLoading(true);
    try {
      // 1. Mark invite accepted
      await inviteService.updateInviteStatus(invite.id, 'accepted');
      // 2. Add ourselves as partner to the Goal
      const allGoals = await goalService.getGoals(invite.senderId);
      const targetGoal = allGoals.find(g => g.id === invite.goalId);
      if (targetGoal) {
        await goalService.updateGoal(targetGoal.id, { partnerId: user.id });
      }

      await refreshData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Polling interval to check for accepted invites if we are waiting,
    // or receive invites if we are waiting to accept one.
    let interval: ReturnType<typeof setInterval>;

    // Firebase auth state listener — drives all login/logout transitions
    const unsubscribe = authService.onAuthStateChanged(async (profile) => {
      setUser(profile);
      if (profile) {
        setLoading(true);
        try {
          const [goalData, nudgeData, sent, received] = await Promise.all([
            goalService.getGoals(profile.id),
            nudgeService.getNudges(profile.id),
            inviteService.getSentInvites(profile.id),
            inviteService.getReceivedInvites(profile.email)
          ]);
          const allCheckIns = await Promise.all(goalData.map(g => checkInService.getCheckInsForGoal(g.id)));
          setGoals(goalData);
          setCheckIns(allCheckIns.flat());
          setNudges(nudgeData);
          setSentInvites(sent);
          setReceivedInvites(received);

          // Setup polling to refresh state while app is open and waiting
          // for a partner to join (since we aren't using real-time listeners for invites yet)
          interval = setInterval(async () => {
            try {
              const [sent, received] = await Promise.all([
                inviteService.getSentInvites(profile.id),
                inviteService.getReceivedInvites(profile.email)
              ]);
              setSentInvites(sent);
              setReceivedInvites(received);
            } catch (e) {
              // Ignore polling errors
            }
          }, 5000); // Check every 5 seconds

        } finally {
          setLoading(false);
        }
      } else {
        setGoals([]);
        setCheckIns([]);
        setNudges([]);
        setSentInvites([]);
        setReceivedInvites([]);
        setLoading(false);
        if (interval) clearInterval(interval);
      }
    });

    return () => {
      unsubscribe();
      if (interval) clearInterval(interval);
    };
  }, []);

  const value = useMemo(
    () => ({
      user, loading, goals, checkIns, nudges, sentInvites, receivedInvites,
      refreshData, addGoal, recordCheckIn, sendNudge, sendInvite, acceptInvite
    }),
    [user, loading, goals, checkIns, nudges, sentInvites, receivedInvites]
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
