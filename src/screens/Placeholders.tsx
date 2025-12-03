import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const createPlaceholder = (name: string) => {
    return () => (
        <View style={styles.container}>
            <Text style={styles.text}>{name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    text: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export const LaunchScreen = createPlaceholder('Launch Screen');
export const OnboardingScreen = createPlaceholder('Onboarding Screen');
export const LoginSignupScreen = createPlaceholder('Login/Signup Screen');
export const CreateAccountScreen = createPlaceholder('Create Account Screen');
export const ForgotPasswordScreen = createPlaceholder('Forgot Password Screen');
export const ResetPasswordScreen = createPlaceholder('Reset Password Screen');
export const GoalSetupScreen = createPlaceholder('Goal Setup Screen');
export const HomeScreen = createPlaceholder('Home (Me) Screen');
export const FriendsScreen = createPlaceholder('Friends Screen');
export const SettingsScreen = createPlaceholder('Settings Screen');
export const InviteFriendScreen = createPlaceholder('Invite Friend Screen');
