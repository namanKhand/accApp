import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Goal, CheckIn, UserProfile, Nudge } from '../types';
import { authService } from '../services/authService';
import { goalService } from '../services/goalService';
import { checkInService } from '../services/checkInService';
import { nudgeService } from '../services/nudgeService';

interface AppContextValue {
  user: UserProfile | null;
  loading: boolean;
  goals: Goal[];
  checkIns: CheckIn[];
  nudges: Nudge[];
  setUser: (user: UserProfile | null) => void;
  refreshData: () => Promise<void>;
  addGoal: (goal: Goal) => Promise<void>;
  recordCheckIn: (checkIn: Omit<CheckIn, 'id'>) => Promise<void>;
  sendNudge: (nudge: Omit<Nudge, 'id' | 'createdAt'>) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [nudges, setNudges] = useState<Nudge[]>([]);

  const refreshData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [goalData, checkInData, nudgeData] = await Promise.all([
        goalService.getGoals(user.id),
        checkInService.getCheckIns(user.id),
        nudgeService.getNudges(user.id)
      ]);
      setGoals(goalData);
      setCheckIns(checkInData);
      setNudges(nudgeData);
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

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (profile) => {
      setUser(profile);
      if (profile) {
        await refreshData();
      } else {
        setGoals([]);
        setCheckIns([]);
        setNudges([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({ user, loading, goals, checkIns, nudges, setUser, refreshData, addGoal, recordCheckIn, sendNudge }),
    [user, loading, goals, checkIns, nudges]
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
