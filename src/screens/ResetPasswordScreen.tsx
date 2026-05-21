import React, { useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getApp } from '@react-native-firebase/app';
import { confirmPasswordReset, getAuth } from '@react-native-firebase/auth';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
type RoutePropType = RouteProp<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RoutePropType>();
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const oobCode = route.params?.oobCode;

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleReset = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert('Missing fields', 'Please fill in both password fields.');
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert('Weak password', 'Password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Mismatch', 'Passwords do not match.');
            return;
        }
        if (!oobCode) return;

        setLoading(true);
        try {
            await confirmPasswordReset(getAuth(getApp()), oobCode, newPassword);
            setDone(true);
        } catch (error: any) {
            const message =
                error.code === 'auth/invalid-action-code' ? 'This reset link has expired or already been used.' :
                    error.code === 'auth/weak-password' ? 'Password must be at least 6 characters.' :
                        'Reset failed. Please request a new reset link.';
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFillObject} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={30} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Set New Password</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {done ? (
                    <View style={styles.successContainer}>
                        <MaterialCommunityIcons name="check-circle-outline" size={64} color={colors.primary} />
                        <Text style={styles.successTitle}>Password Updated!</Text>
                        <Text style={styles.successText}>
                            Your password has been reset successfully. You can now log in.
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginSignup')}>
                            <Text style={styles.buttonText}>Back to Log In</Text>
                        </TouchableOpacity>
                    </View>
                ) : !oobCode ? (
                    <View style={styles.form}>
                        <MaterialCommunityIcons name="email-outline" size={64} color={colors.primary} style={{ marginBottom: 20 }} />
                        <Text style={styles.description}>
                            Please follow the reset link in your email to set a new password. The link will open this screen automatically.
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text style={styles.buttonText}>Request New Link</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.form}>
                        <Text style={styles.description}>Enter a new password for your account.</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>New Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="At least 6 characters"
                                placeholderTextColor={colors.secondary}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                                autoFocus
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm New Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="**********"
                                placeholderTextColor={colors.secondary}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.disabledButton]}
                            onPress={handleReset}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={colors.surface} />
                            ) : (
                                <Text style={styles.buttonText}>Set New Password</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const makeStyles = (colors: ReturnType<typeof import('../context/ThemeContext').useTheme>['colors']) =>
    StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
    scrollContent: { flexGrow: 1, padding: 20, justifyContent: 'center' },
    form: { alignItems: 'center', width: '100%' },
    description: {
        fontSize: 15, color: colors.secondary, textAlign: 'center',
        marginBottom: 30, lineHeight: 22,
    },
    inputContainer: { width: '100%', marginBottom: 25 },
    label: { fontSize: 16, color: colors.text, marginBottom: 8, fontWeight: '500' },
    input: {
        backgroundColor: colors.surface, borderRadius: 10, padding: 15,
        fontSize: 16, color: colors.text,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
    },
    button: {
        backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 40,
        borderRadius: 10, alignItems: 'center', minWidth: 200, marginTop: 10,
    },
    disabledButton: { opacity: 0.6 },
    buttonText: { color: colors.surface, fontSize: 16, fontWeight: 'bold' },
    successContainer: { alignItems: 'center', paddingTop: 20 },
    successTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginTop: 20, marginBottom: 12 },
    successText: { fontSize: 15, color: colors.secondary, textAlign: 'center', lineHeight: 22, marginBottom: 40 },
});

export default ResetPasswordScreen;
