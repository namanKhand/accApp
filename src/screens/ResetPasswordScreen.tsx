import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { RootStackParamList } from '../navigation/RootNavigator';
import { authService } from '../services/authService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;

const extractResetCode = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  if (!trimmed.includes('://') && !trimmed.includes('oobCode=')) {
    return trimmed;
  }

  const match = trimmed.match(/[?&]oobCode=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : '';
};

const ResetPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [resetLinkOrCode, setResetLinkOrCode] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const code = useMemo(() => extractResetCode(resetLinkOrCode), [resetLinkOrCode]);

  useEffect(() => {
    let active = true;

    const loadInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (!active || !initialUrl) {
        return;
      }

      const detectedCode = extractResetCode(initialUrl);
      if (detectedCode) {
        setResetLinkOrCode(initialUrl);
      }
    };

    loadInitialUrl();

    const subscription = Linking.addEventListener('url', ({ url }) => {
      const detectedCode = extractResetCode(url);
      if (detectedCode) {
        setResetLinkOrCode(url);
      }
    });

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert('Missing Link', 'Paste the password reset link from your email, or paste the reset code.');
      return;
    }

    setLoading(true);
    try {
      const verifiedEmail = await authService.verifyPasswordResetCode(code);
      setEmail(verifiedEmail);
      setVerified(true);
      Alert.alert('Code Verified', 'You can now enter a new password for this account.');
    } catch (error: any) {
      const message =
        error?.code === 'auth/expired-action-code'
          ? 'This reset link has expired. Request a new one.'
          : error?.code === 'auth/invalid-action-code'
            ? 'This reset link is invalid. Paste the full link from your email.'
            : 'We could not verify this reset link. Please try again.';

      Alert.alert('Verification Error', message);
      setVerified(false);
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!verified) {
      Alert.alert('Verify First', 'Verify your reset link before setting a new password.');
      return;
    }
    if (!newPassword || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please enter and confirm your new password.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authService.confirmPasswordReset(code, newPassword);
      Alert.alert('Password Updated', 'Your password has been reset. You can sign in now.', [
        {
          text: 'Go to Sign In',
          onPress: () => navigation.navigate('LoginSignup'),
        },
      ]);
    } catch (error: any) {
      const message =
        error?.code === 'auth/expired-action-code'
          ? 'This reset link has expired. Request a new one.'
          : error?.code === 'auth/invalid-action-code'
            ? 'This reset link is invalid. Please request a new one.'
            : error?.code === 'auth/weak-password'
              ? 'Choose a stronger password.'
              : 'We could not reset your password. Please try again.';

      Alert.alert('Reset Error', message);
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
        <Text style={styles.headerTitle}>Set New Password</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.description}>
            Paste the password reset link from your email, or paste the reset code directly.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Reset Link or Code</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Paste the link from your email"
              placeholderTextColor={COLORS.secondary}
              value={resetLinkOrCode}
              onChangeText={(value) => {
                setResetLinkOrCode(value);
                setVerified(false);
                setEmail('');
              }}
              autoCapitalize="none"
              autoCorrect={false}
              multiline
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={handleVerifyCode}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={COLORS.surface} /> : <Text style={styles.primaryButtonText}>Verify Reset Link</Text>}
          </TouchableOpacity>

          {verified && (
            <>
              <View style={styles.verifiedCard}>
                <MaterialCommunityIcons name="email-check-outline" size={24} color={COLORS.primary} />
                <Text style={styles.verifiedText}>Resetting password for {email}</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="At least 6 characters"
                  placeholderTextColor={COLORS.secondary}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Repeat your new password"
                  placeholderTextColor={COLORS.secondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.disabledButton]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color={COLORS.surface} /> : <Text style={styles.primaryButtonText}>Reset Password</Text>}
              </TouchableOpacity>
            </>
          )}
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
  card: {
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
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  inputContainer: { width: '100%', marginBottom: 20 },
  label: { fontSize: 16, color: COLORS.text, marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: COLORS.glassBgStrong,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.glassBorderStrong,
    padding: 15,
    fontSize: 16,
    color: COLORS.text,
  },
  multilineInput: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.38)',
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  disabledButton: { opacity: 0.6 },
  primaryButtonText: { color: COLORS.surface, fontSize: 16, fontWeight: 'bold' },
  verifiedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  verifiedText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ResetPasswordScreen;
