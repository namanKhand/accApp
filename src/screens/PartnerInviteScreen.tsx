import React, { useState } from 'react';
import { View, StyleSheet, Share } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useApp } from '../context/AppContext';
import { randomId } from '../utils/ids';
import { PartnerInvite } from '../types';

const PartnerInviteScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'PartnerInvite'>> = ({ route, navigation }) => {
  const { user } = useApp();
  const [phone, setPhone] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const goalId = route.params?.goalId;

  const handleShare = async () => {
    if (!user || !goalId) return;

    // Create a deep link to the app
    const redirectUrl = Linking.createURL('invite', {
      queryParams: {
        goalId,
        senderId: user.id,
        senderName: user.displayName || 'Your friend',
      },
    });

    const message = `Hey! I'm using One-Liner to build a new habit. Be my accountability partner?\n\n${redirectUrl}`;

    try {
      const result = await Share.share({
        message,
        title: 'Be my accountability partner',
      });

      if (result.action === Share.sharedAction) {
        setMessageSent(true);
        // In a real app, you might save the pending invite to your backend here
        const invite: PartnerInvite = {
          id: randomId(),
          senderId: user.id,
          recipientPhone: phone || 'shared-link',
          goalId,
          status: 'pending'
        };
        console.log('Invite created:', invite);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Invite your accountability partner</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Send a link to a friend who will help you stay on track.
      </Text>

      <Button mode="contained" onPress={handleShare} icon="share-variant" contentStyle={{ height: 50 }}>
        Share Invite Link
      </Button>

      {messageSent && (
        <View style={styles.successContainer}>
          <Text variant="bodyMedium" style={styles.successText}>
            Invite link shared! You can continue to the dashboard.
          </Text>
        </View>
      )}

      <Button mode="text" onPress={() => navigation.replace('Main')}>
        {messageSent ? "Go to Dashboard" : "Skip for now"}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
    backgroundColor: '#FAF5EF',
    justifyContent: 'center',
  },
  subtitle: {
    marginBottom: 24,
    color: '#666',
    textAlign: 'center',
  },
  successContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    alignItems: 'center',
  },
  successText: {
    color: '#2E7D32',
    textAlign: 'center',
  }
});

export default PartnerInviteScreen;
