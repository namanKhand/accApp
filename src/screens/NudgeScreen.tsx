import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useApp } from '../context/AppContext';

const NudgeScreen: React.FC = () => {
  const { nudges, user, goals, sendNudge } = useApp();

  const handleSendReminder = async () => {
    if (!user || goals.length === 0) return;
    await sendNudge({
      goalId: goals[0].id,
      senderId: user.id,
      recipientId: goals[0].partnerId,
      message: 'Time to check in!'
    });
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={handleSendReminder}>
        Send reminder
      </Button>
      <FlatList
        data={nudges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.message} subtitle={new Date(item.createdAt).toLocaleString()} />
            <Card.Content>
              <Text variant="bodySmall">To: {item.recipientId}</Text>
              <Text variant="bodySmall">From: {item.senderId}</Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={<Text>No nudges yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12
  },
  card: {
    marginTop: 12
  }
});

export default NudgeScreen;
