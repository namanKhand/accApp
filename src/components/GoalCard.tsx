import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, ProgressBar, Button } from 'react-native-paper';
import { Goal } from '../types';

interface Props {
  goal: Goal;
  onNudge?: () => void;
}

const GoalCard: React.FC<Props> = ({ goal, onNudge }) => (
  <Card style={styles.card}>
    <Card.Title title={goal.title} subtitle={goal.description} />
    <Card.Content>
      <Text variant="bodySmall">Cadence: {goal.cadence}</Text>
      <Text variant="bodySmall">Streak: {goal.streak} days</Text>
      <ProgressBar progress={Math.min(goal.streak / 30, 1)} color="#C46B3B" style={styles.progress} />
    </Card.Content>
    {onNudge && (
      <Card.Actions>
        <Button onPress={onNudge}>Nudge partner</Button>
      </Card.Actions>
    )}
  </Card>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 12
  },
  progress: {
    marginTop: 8
  }
});

export default GoalCard;
