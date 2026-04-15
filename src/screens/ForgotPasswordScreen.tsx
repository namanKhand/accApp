import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import auth from '@react-native-firebase/auth';
import { COLORS } from '../constants/colors';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSend = async () => {
        if (!email.trim()) {
            Alert.alert('Missing email', 'Please enter your email address.');
            return;
        }

        setLoading(true);
        try {
            await auth().sendPasswordResetEmail(email.trim().toLowerCase(), {
                handleCodeInApp: false,
                // continue URL shown after password reset in the browser
                url: 'https://accapp-bd7a0.firebaseapp.com',
            });
            console.log('[ForgotPassword] Reset email sent (or silently skipped) for:', email.trim().toLowerCase());
            setSent(true);
        } catch (error: any) {
            console.error('[ForgotPassword] Error:', error.code, error.message);
            const message =
                error.code === 'auth/user-not-found' ? 'No account found with this email.' :
                error.code === 'auth/invalid-email' ? 'Please enter a valid email address.' :
                error.code === 'auth/too-many-requests' ? 'Too many attempts. Please wait a few minutes and try again.' :
                `Something went wrong (${error.code ?? 'unknown'}). Please try again.`;
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={COLORS.backgroundGradient} style={StyleSheet.absoluteFillObject} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={30} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reset Password</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {sent ? (
                    <View style={styles.successContainer}>
                        <MaterialCommunityIcons name="email-check-outline" size={64} color={COLORS.primary} />
                        <Text style={styles.successTitle}>Check your inbox</Text>
                        <Text style={styles.successText}>
                            We sent a password reset link to{'\n'}
                            <Text style={styles.bold}>{email}</Text>
                            {'\n\n'}Check spam if you don't see it. Then copy the link and tap below to set your new password.
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ResetPassword')}>
                            <Text style={styles.buttonText}>Enter Reset Link</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('LoginSignup')}>
                            <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSend} style={styles.resendButton}>
                            <Text style={styles.resendText}>Didn't receive it? Resend</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.form}>
                        <Text style={styles.description}>
                            Enter the email address associated with your account and we'll send you a link to reset your password.
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="example@example.com"
                                placeholderTextColor={COLORS.secondary}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoCorrect={false}
                                autoFocus
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.disabledButton]}
                            onPress={handleSend}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.surface} />
                            ) : (
                                <Text style={styles.buttonText}>Send Reset Link</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 20,
        marginTop: 8,
        borderRadius: 22,
        backgroundColor: COLORS.glassBg,
        borderWidth: 1.5,
        borderColor: COLORS.glassBorder,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 4,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, letterSpacing: 0.2 },
    scrollContent: { flexGrow: 1, padding: 20, justifyContent: 'center' },
    form: {
        alignItems: 'center',
        width: '100%',
        backgroundColor: COLORS.glassBg,
        borderWidth: 1.5,
        borderColor: COLORS.glassBorder,
        borderRadius: 32,
        padding: 28,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.18,
        shadowRadius: 32,
        elevation: 10,
    },
    description: {
        fontSize: 15,
        color: COLORS.secondary,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    inputContainer: { width: '100%', marginBottom: 25 },
    label: { fontSize: 16, color: COLORS.text, marginBottom: 8, fontWeight: '500' },
    input: {
        backgroundColor: COLORS.glassBgStrong,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COLORS.glassBorderStrong,
        padding: 15,
        fontSize: 16,
        color: COLORS.text,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 14,
        alignItems: 'center',
        minWidth: 200,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.38)',
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 5,
    },
    disabledButton: { opacity: 0.6 },
    buttonText: { color: COLORS.surface, fontSize: 16, fontWeight: 'bold' },
    successContainer: { alignItems: 'center', paddingTop: 20 },
    successTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginTop: 20, marginBottom: 12 },
    successText: { fontSize: 15, color: COLORS.secondary, textAlign: 'center', lineHeight: 22, marginBottom: 40 },
    bold: { fontWeight: 'bold', color: COLORS.text },
    resendButton: { marginTop: 16 },
    secondaryButton: { marginTop: 14 },
    secondaryButtonText: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
    resendText: { color: COLORS.primary, fontSize: 14, textDecorationLine: 'underline' },
});

export default ForgotPasswordScreen;
