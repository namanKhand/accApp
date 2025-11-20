import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import StreakCalendar from '../components/StreakCalendar';
import { useApp } from '../context/AppContext';

const StreaksScreen: React.FC = () => {
  const { checkIns } = useApp();

  const streakDays = useMemo(
    () =>
      checkIns.map((checkIn) => ({
        date: checkIn.date.split('T')[0],
        completed: true
      })),
    [checkIns]
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Your streaks</Text>
      <StreakCalendar days={streakDays} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12
  }
});

export default StreaksScreen;
