import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../screens/AuthScreen';
import MainTabs from './MainTabs';
import GoalSetupScreen from '../screens/GoalSetupScreen';
import PartnerInviteScreen from '../screens/PartnerInviteScreen';

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  GoalSetup: undefined;
  PartnerInvite: { goalId: string } | undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { user } = useApp();
  const initialRoute = user ? 'Main' : 'Onboarding';

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="GoalSetup" component={GoalSetupScreen} />
      <Stack.Screen name="PartnerInvite" component={PartnerInviteScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
