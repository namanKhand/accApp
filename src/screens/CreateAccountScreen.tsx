import React, { useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/RootNavigator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/authService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateAccount'>;

const CreateAccountScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
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
            <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFillObject} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={30} color={colors.text} />
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
                            placeholderTextColor={colors.secondary}
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="email@example.com"
                            placeholderTextColor={colors.secondary}
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
                            placeholderTextColor={colors.secondary}
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
                            placeholderTextColor={colors.secondary}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreed(!agreed)}>
                        <MaterialCommunityIcons
                            name={agreed ? 'checkbox-marked' : 'checkbox-blank-outline'}
                            size={24}
                            color={colors.text}
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
                            <ActivityIndicator color={colors.surface} />
                        ) : (
                            <Text style={styles.signUpButtonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const makeStyles = (colors: ReturnType<typeof import('../context/ThemeContext').useTheme>['colors']) =>
    StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
    scrollContent: { padding: 20 },
    form: { alignItems: 'center' },
    inputContainer: { width: '100%', marginBottom: 20 },
    label: { fontSize: 16, color: colors.text, marginBottom: 8, fontWeight: '500' },
    input: {
        backgroundColor: colors.surface,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: colors.text,
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
    checkboxText: { marginLeft: 10, color: colors.text, fontSize: 14, flex: 1 },
    signUpButton: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginBottom: 20,
        minWidth: 140,
        alignItems: 'center',
    },
    disabledButton: { opacity: 0.6 },
    signUpButtonText: { color: colors.surface, fontSize: 16, fontWeight: 'bold' },
});

export default CreateAccountScreen;
