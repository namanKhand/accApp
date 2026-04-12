import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../constants/colors';
import { RootStackParamList } from '../navigation/RootNavigator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/authService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateAccount'>;

const CreateAccountScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
            Alert.alert('Missing fields', 'Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Password mismatch', 'Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Weak password', 'Password must be at least 6 characters.');
            return;
        }
        if (!agreed) {
            Alert.alert('Terms required', 'Please agree to the Terms of Use and Privacy Policy.');
            return;
        }

        setLoading(true);
        try {
            await authService.signUp(email.trim(), password, fullName.trim());
            // onAuthStateChanged in AppContext fires automatically and RootNavigator mounts the correct authenticated screen.
        } catch (error: any) {
            const message =
                error.code === 'auth/email-already-in-use' ? 'An account with this email already exists.' :
                    error.code === 'auth/invalid-email' ? 'Please enter a valid email address.' :
                        error.code === 'auth/weak-password' ? 'Password must be at least 6 characters.' :
                            'Sign up failed. Please try again.';
            Alert.alert('Sign Up Error', message);
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
                <Text style={styles.headerTitle}>Create Account</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="First Name Last Name"
                            placeholderTextColor={COLORS.secondary}
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="email@example.com"
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
                            placeholder="At least 6 characters"
                            placeholderTextColor={COLORS.secondary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="**********"
                            placeholderTextColor={COLORS.secondary}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreed(!agreed)}>
                        <MaterialCommunityIcons
                            name={agreed ? 'checkbox-marked' : 'checkbox-blank-outline'}
                            size={24}
                            color={COLORS.text}
                        />
                        <Text style={styles.checkboxText}>
                            By checking the box, you agree to the Terms of Use and Privacy Policy
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.signUpButton, loading && styles.disabledButton]}
                        onPress={handleSignUp}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.surface} />
                        ) : (
                            <Text style={styles.signUpButtonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.orText}>or sign up with</Text>

                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButton}>
                            <MaterialCommunityIcons name="google" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <MaterialCommunityIcons name="apple" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>
                </View>
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
        backgroundColor: 'rgba(255,255,255,0.34)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.42)',
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
    scrollContent: { padding: 20 },
    form: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.36)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.44)',
        borderRadius: 28,
        padding: 24,
        shadowColor: COLORS.text,
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
    },
    inputContainer: { width: '100%', marginBottom: 20 },
    label: { fontSize: 16, color: COLORS.text, marginBottom: 8, fontWeight: '500' },
    input: {
        backgroundColor: 'rgba(255,255,255,0.42)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        padding: 15,
        fontSize: 16,
        color: COLORS.text,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
    },
    checkboxText: { marginLeft: 10, color: COLORS.text, fontSize: 14, flex: 1 },
    signUpButton: {
        backgroundColor: 'rgba(223,168,120,0.92)',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 12,
        marginBottom: 20,
        minWidth: 140,
        alignItems: 'center',
    },
    disabledButton: { opacity: 0.6 },
    signUpButtonText: { color: COLORS.surface, fontSize: 16, fontWeight: 'bold' },
    orText: { color: COLORS.text, marginBottom: 15 },
    socialContainer: { flexDirection: 'row', marginBottom: 20 },
    socialButton: {
        backgroundColor: 'rgba(255,255,255,0.42)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
});

export default CreateAccountScreen;
