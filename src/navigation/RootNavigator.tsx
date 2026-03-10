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
import WaitingForPartnerScreen from '../screens/WaitingForPartnerScreen';
import AcceptInviteScreen from '../screens/AcceptInviteScreen';
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
  WaitingForPartner: undefined;
  AcceptInvite: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { user, loading, goals, sentInvites, receivedInvites } = useApp();

  if (loading) {
    return <LaunchScreen />;
  }

  // --- State Machine Logic ---
  // Default to unauthenticated flow
  let initialRoute: keyof RootStackParamList = 'Launch';

  const hasActiveSharedGoal = goals.some(g => g.partnerId && g.partnerId !== '');
  const isWaitingForPartner = sentInvites.length > 0;
  const hasPendingInviteToAccept = receivedInvites.length > 0;

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
        // --- Unauthenticated Stack ---
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
            options={{ title: 'Sign In', headerShown: false }}
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
        // --- Authenticated Stack ---
        <>
          {hasActiveSharedGoal ? (
            // User is fully set up with a partner and a specific goal
            <>
              <Stack.Screen
                name="Main"
                component={MainTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ContactUs"
                component={ContactUsScreen}
                options={{ title: 'Contact Us' }}
              />
            </>
          ) : hasPendingInviteToAccept ? (
            // User has received an invite but hasn't accepted yet
            <Stack.Screen
              name="AcceptInvite"
              component={AcceptInviteScreen}
              options={{ headerShown: false }}
            />
          ) : isWaitingForPartner ? (
            // User sent an invite and is waiting for them to join
            <Stack.Screen
              name="WaitingForPartner"
              component={WaitingForPartnerScreen}
              options={{ headerShown: false }}
            />
          ) : (
            // User has no active goal and no invites -> force them to create a goal
            <>
              <Stack.Screen
                name="GoalSetup"
                component={GoalSetupScreen}
                options={{ title: 'Set Your Goal' }}
              />
              <Stack.Screen
                name="InviteFriend"
                component={InviteFriendScreen}
                options={{ title: 'Invite Partner', headerLeft: () => null, gestureEnabled: false }}
              />
            </>
          )}
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
