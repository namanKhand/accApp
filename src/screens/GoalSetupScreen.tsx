import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Text, SegmentedButtons } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useApp } from '../context/AppContext';
import { Goal } from '../types';
import { randomId } from '../utils/ids';

const GoalSetupScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'GoalSetup'>> = ({ navigation }) => {
  const { user, addGoal } = useApp();
  const [title, setTitle] = useState('Morning workout');
  const [description, setDescription] = useState('30 minutes of movement before work');
  const [cadence, setCadence] = useState<Goal['cadence']>('daily');

  const handleSave = async () => {
    if (!user) return;
    const goal: Goal = {
      id: randomId(),
      ownerId: user.id,
      title,
      description,
      cadence,
      startDate: new Date().toISOString(),
      streak: 0,
      partnerId: user.partnerId || '',
      status: 'active'
    };
    await addGoal(goal);
    navigation.navigate('PartnerInvite', { goalId: goal.id });
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Set up your first goal</Text>
      <TextInput label="Goal title" value={title} onChangeText={setTitle} />
      <TextInput label="Describe success" value={description} onChangeText={setDescription} multiline />
      <SegmentedButtons
        value={cadence}
        onValueChange={(value) => setCadence(value as Goal['cadence'])}
        buttons={[
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'custom', label: 'Custom' }
        ]}
      />
      <Button mode="contained" onPress={handleSave}>
        Save and invite partner
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
    backgroundColor: '#FAF5EF'
  }
});

export default GoalSetupScreen;
