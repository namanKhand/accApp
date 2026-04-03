import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getApp } from '@react-native-firebase/app';
import auth, { sendPasswordResetEmail, getAuth } from '@react-native-firebase/auth';
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
            await sendPasswordResetEmail(getAuth(getApp()), email.trim().toLowerCase());
            setSent(true);
        } catch (error: any) {
            const message =
                error.code === 'auth/user-not-found' ? 'No account found with this email.' :
                error.code === 'auth/invalid-email' ? 'Please enter a valid email address.' :
                'Something went wrong. Please try again.';
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
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
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginSignup')}>
                            <Text style={styles.buttonText}>Back to Sign In</Text>
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
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
    scrollContent: { flexGrow: 1, padding: 20, justifyContent: 'center' },
    form: { alignItems: 'center', width: '100%' },
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
        backgroundColor: COLORS.surface,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: COLORS.text,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 10,
        alignItems: 'center',
        minWidth: 200,
    },
    disabledButton: { opacity: 0.6 },
    buttonText: { color: COLORS.surface, fontSize: 16, fontWeight: 'bold' },
    successContainer: { alignItems: 'center', paddingTop: 20 },
    successTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginTop: 20, marginBottom: 12 },
    successText: { fontSize: 15, color: COLORS.secondary, textAlign: 'center', lineHeight: 22, marginBottom: 40 },
    bold: { fontWeight: 'bold', color: COLORS.text },
    resendButton: { marginTop: 16 },
    resendText: { color: COLORS.primary, fontSize: 14, textDecorationLine: 'underline' },
});

export default ForgotPasswordScreen;
