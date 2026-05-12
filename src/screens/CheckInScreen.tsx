import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../context/AppContext';

const CheckInScreen: React.FC = () => {
  const { user, goals, recordCheckIn } = useApp();
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [status, setStatus] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.6 });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!user || goals.length === 0) return;
    const currentGoal = goals
      .filter(g => g.ownerId === user.id && g.status === 'active')
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0]
      ?? goals[goals.length - 1];
    const goalId = currentGoal.id;
    await recordCheckIn({
      userId: user.id,
      goalId,
      date: new Date().toISOString(),
      checkInAt: new Date().toISOString(),
      photoUri,
      notes,
      verifiedByPartner: false
    });
    setStatus('Check-in submitted!');
    setNotes('');
    setPhotoUri(undefined);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Share your proof</Text>
      <Button icon="camera" mode="outlined" onPress={pickImage}>
        {photoUri ? 'Change photo' : 'Upload photo'}
      </Button>
      {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}
      <TextInput label="Notes" value={notes} onChangeText={setNotes} multiline />
      <Button mode="contained" onPress={handleSubmit}>
        Submit check-in
      </Button>
      {status && <Text>{status}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8
  }
});

export default CheckInScreen;
