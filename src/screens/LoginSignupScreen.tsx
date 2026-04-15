import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, ActivityIndicator, Alert, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../constants/colors';
import { RootStackParamList } from '../navigation/RootNavigator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/authService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginSignup'>;

const LoginSignupScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const getSocialErrorMessage = (error: any, provider: 'Google' | 'Apple') => {
        if (error?.code === 'auth/operation-not-allowed') {
            return `${provider} sign-in is not enabled yet in Firebase Authentication.`;
        }
        if (error?.code === 'auth/account-exists-with-different-credential') {
            return 'An account already exists with this email using a different sign-in method.';
        }
        if (error?.code === 'auth/cancelled-popup-request' || error?.code === 'auth/popup-closed-by-user') {
            return `${provider} sign-in was cancelled.`;
        }
        if (error?.message === 'auth/apple-not-supported') {
            return 'Apple sign-in is only available on iOS devices.';
        }

        return `${provider} sign-in failed. Please try again.`;
    };

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            Alert.alert('Missing fields', 'Please enter your email and password.');
            return;
        }
        setLoading(true);
        try {
            await authService.signIn(email.trim(), password);
            // onAuthStateChanged in AppContext will fire automatically and
            // the RootNavigator state machine will mount the correct screen.
        } catch (error: any) {
            const message =
                error.code === 'auth/invalid-credential' ? 'Incorrect email or password. Please try again.' :
                    error.code === 'auth/user-not-found' ? 'No account found with this email.' :
                        error.code === 'auth/wrong-password' ? 'Incorrect password. Please try again.' :
                            error.code === 'auth/invalid-email' ? 'Please enter a valid email address.' :
                                error.code === 'auth/too-many-requests' ? 'Too many attempts. Please try again later.' :
                                    'Login failed. Please try again.';
            Alert.alert('Login Error', message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await authService.signInWithGoogle();
        } catch (error: any) {
            Alert.alert('Google Sign-In Error', getSocialErrorMessage(error, 'Google'));
        } finally {
            setLoading(false);
        }
    };

    const handleAppleSignIn = async () => {
        setLoading(true);
        try {
            await authService.signInWithApple();
        } catch (error: any) {
            Alert.alert('Apple Sign-In Error', getSocialErrorMessage(error, 'Apple'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={COLORS.backgroundGradient} style={StyleSheet.absoluteFillObject} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <Text style={styles.headerTitle}>Log In or Sign Up</Text>

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
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="**********"
                            placeholderTextColor={COLORS.secondary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text style={styles.forgotPassword}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.disabledButton]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.surface} />
                        ) : (
                            <Text style={styles.loginButtonText}>Log In</Text>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.orText}>or sign in with</Text>

                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn} disabled={loading}>
                            <MaterialCommunityIcons name="google" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                        {Platform.OS === 'ios' && (
                            <TouchableOpacity style={styles.socialButton} onPress={handleAppleSignIn} disabled={loading}>
                                <MaterialCommunityIcons name="apple" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account?</Text>
                        <TouchableOpacity
                            style={styles.signUpButton}
                            onPress={() => navigation.navigate('CreateAccount')}
                        >
                            <Text style={styles.signUpButtonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { flexGrow: 1, padding: 20, justifyContent: 'center' },
    card: {
        backgroundColor: COLORS.glassBg,
        borderWidth: 1.5,
        borderColor: COLORS.glassBorder,
        borderRadius: 32,
        padding: 28,
        alignItems: 'center',
        width: '100%',
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.18,
        shadowRadius: 32,
        elevation: 10,
    },
    headerTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.text, marginBottom: 28, letterSpacing: 0.3 },
    inputContainer: { width: '100%', marginBottom: 20 },
    label: { fontSize: 15, color: COLORS.text, marginBottom: 8, fontWeight: '600' },
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
    forgotPassword: { color: COLORS.primaryDark, fontSize: 12, textAlign: 'right', marginTop: 8, fontWeight: '600' },
    loginButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 14,
        marginTop: 10,
        marginBottom: 20,
        minWidth: 160,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.38)',
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.38,
        shadowRadius: 10,
        elevation: 5,
    },
    disabledButton: { opacity: 0.6 },
    loginButtonText: { color: COLORS.surface, fontSize: 16, fontWeight: 'bold', letterSpacing: 0.3 },
    orText: { color: COLORS.text, marginBottom: 15, opacity: 0.6, fontSize: 13 },
    socialContainer: { flexDirection: 'row', marginBottom: 36 },
    socialButton: {
        backgroundColor: COLORS.glassBgStrong,
        width: 54,
        height: 54,
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        borderWidth: 1.5,
        borderColor: COLORS.glassBorderStrong,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    footer: { alignItems: 'center' },
    footerText: { color: COLORS.text, marginBottom: 12, opacity: 0.7 },
    signUpButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 11,
        paddingHorizontal: 32,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.38)',
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 8,
        elevation: 4,
    },
    signUpButtonText: { color: COLORS.surface, fontWeight: 'bold', letterSpacing: 0.2 },
});

export default LoginSignupScreen;
