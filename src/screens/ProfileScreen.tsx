import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';

const ProfileScreen: React.FC = () => {
  const { user, goals } = useApp();

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">{user?.displayName || 'Guest'}</Text>
      <Text variant="bodyMedium">Phone: {user?.phoneNumber || 'N/A'}</Text>
      <Text variant="bodyMedium">Partner ID: {user?.partnerId || 'Not linked yet'}</Text>
      <Text variant="bodyMedium">Goals owned: {goals.filter((g) => g.ownerId === user?.id).length}</Text>
      <Button onPress={() => authService.signOut()}>Sign out</Button>
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

export default ProfileScreen;
