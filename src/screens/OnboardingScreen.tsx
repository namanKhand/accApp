import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

const slides = [
  {
    title: 'Shared accountability',
    body: 'Invite a partner who is responsible for keeping you on track.'
  },
  {
    title: 'Show your proof',
    body: 'Check in with daily photos and notes to maintain streaks.'
  },
  {
    title: 'Nudges that matter',
    body: 'Partners get alerted to nudge you if you miss a check-in.'
  },
  {
    title: 'Momentum together',
    body: 'Build habits as a team—progress is a shared mission.'
  }
];

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC<Props> = ({ navigation }) => (
  <View style={styles.container}>
    <FlatList
      data={slides}
      keyExtractor={(item) => item.title}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Card.Title title={item.title} titleVariant="headlineSmall" />
          <Card.Content>
            <Text variant="bodyMedium">{item.body}</Text>
          </Card.Content>
        </Card>
      )}
    />
    <Button mode="contained" onPress={() => navigation.replace('Auth')}>
      Get started
    </Button>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
    backgroundColor: '#FAF5EF'
  },
  card: {
    marginBottom: 12
  }
});

export default OnboardingScreen;
