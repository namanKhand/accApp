import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useApp } from '../context/AppContext';
import { randomId } from '../utils/ids';
import { PartnerInvite } from '../types';

const PartnerInviteScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'PartnerInvite'>> = ({ route, navigation }) => {
  const { user } = useApp();
  const [phone, setPhone] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const goalId = route.params?.goalId;

  const handleSend = () => {
    if (!user || !goalId) return;
    const invite: PartnerInvite = {
      id: randomId(),
      senderId: user.id,
      recipientPhone: phone,
      goalId,
      status: 'pending'
    };
    console.log('Invite payload', invite); // placeholder for SMS invite
    setMessageSent(true);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Invite your accountability partner</Text>
      <TextInput label="Partner phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Button mode="contained" onPress={handleSend}>
        Send invite
      </Button>
      {messageSent && <Text variant="bodyMedium">Invite sent! You can update it from your profile later.</Text>}
      <Button onPress={() => navigation.replace('Main')}>Skip for now</Button>
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

export default PartnerInviteScreen;
