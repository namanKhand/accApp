import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
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
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      {!user ? (
        <>
          <Stack.Screen
            name="Launch"
            component={LaunchScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LoginSignup"
            component={LoginSignupScreen}
            options={{
              title: 'Sign In',
              headerShown: false
            }}
          />
          <Stack.Screen
            name="CreateAccount"
            component={CreateAccountScreen}
            options={{ title: 'Create Account' }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ title: 'Reset Password' }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPasswordScreen}
            options={{ title: 'Reset Password' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GoalSetup"
            component={GoalSetupScreen}
            options={{ title: 'Set Your Goal' }}
          />
          <Stack.Screen
            name="InviteFriend"
            component={InviteFriendScreen}
            options={{ title: 'Invite Partner' }}
          />
          <Stack.Screen
            name="ContactUs"
            component={ContactUsScreen}
            options={{ title: 'Contact Us' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
