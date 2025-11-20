import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Text, HelperText } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { authService } from '../services/authService';
import { useApp } from '../context/AppContext';

const AuthScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'Auth'>> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useApp();

  const handleContinue = async () => {
    if (!phone || !name) {
      setError('Enter your phone and name to continue.');
      return;
    }
    const profile = await authService.signInWithPhone(phone, name);
    setUser(profile);
    navigation.replace('GoalSetup');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Log in or sign up</Text>
      <TextInput label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput label="Name" value={name} onChangeText={setName} />
      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>
      <Button mode="contained" onPress={handleContinue}>
        Continue
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

export default AuthScreen;
