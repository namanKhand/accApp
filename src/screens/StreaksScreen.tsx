import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import StreakCalendar from '../components/StreakCalendar';
import { useApp } from '../context/AppContext';

const StreaksScreen: React.FC = () => {
  const { checkIns, user } = useApp();

  const streakDays = useMemo(() => {
    const seen = new Set<string>();
    const days: { date: string; completed: boolean }[] = [];
    checkIns
      .filter(ci => ci.userId === user?.id)
      .forEach(ci => {
        const date = ci.date.split('T')[0];
        if (!seen.has(date)) {
          seen.add(date);
          days.push({ date, completed: true });
        }
      });
    return days;
  }, [checkIns, user]);

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Your streaks</Text>
      <StreakCalendar days={streakDays} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 }
});

export default StreaksScreen;
