import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import GoalCard from '../components/GoalCard';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import NudgeButton from '../components/NudgeButton';

const HomeScreen: React.FC = () => {
  const { goals, user, sendNudge } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const activeGoals = useMemo(() => goals.filter((g) => g.status === 'active'), [goals]);

  const handleNudge = async (goalId: string) => {
    if (!user) return;
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    await sendNudge({ goalId, senderId: user.id, recipientId: goal.partnerId, message: 'You got this!' });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text variant="headlineSmall">Hi {user?.displayName || 'there'}</Text>
        <Button mode="text" onPress={() => navigation.navigate('GoalSetup')}>
          New goal
        </Button>
      </View>
      {activeGoals.length === 0 ? (
        <Text variant="bodyMedium">Create your first goal to get started.</Text>
      ) : (
        activeGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onNudge={() => handleNudge(goal.id)} />
        ))
      )}
      {activeGoals.length > 0 && <NudgeButton onSend={() => handleNudge(activeGoals[0].id)} label="Nudge partner" />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  }
});

export default HomeScreen;
