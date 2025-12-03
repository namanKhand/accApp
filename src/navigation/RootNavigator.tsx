import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import LaunchScreen from '../screens/LaunchScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginSignupScreen from '../screens/LoginSignupScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import GoalSetupScreen from '../screens/GoalSetupScreen';
import InviteFriendScreen from '../screens/InviteFriendScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import MainTabs from './MainTabs';

export type RootStackParamList = {
  Launch: undefined;
  Onboarding: undefined;
  LoginSignup: undefined;
  CreateAccount: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  GoalSetup: undefined;
  InviteFriend: undefined;
  ContactUs: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { user, loading } = useApp();

  if (loading) {
    return <LaunchScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Launch" component={LaunchScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="LoginSignup" component={LoginSignupScreen} />
          <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="GoalSetup" component={GoalSetupScreen} />
          <Stack.Screen name="InviteFriend" component={InviteFriendScreen} />
          <Stack.Screen name="ContactUs" component={ContactUsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
