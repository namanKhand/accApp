import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../constants/colors';
import { RootStackParamList } from '../navigation/RootNavigator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getHasSeenOnboarding } from '../utils/onboarding';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Launch'>;

const LaunchScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        let active = true;

        const boot = async () => {
            const hasSeenOnboarding = await getHasSeenOnboarding();

            const timer = setTimeout(() => {
                if (!active) return;
                navigation.replace(hasSeenOnboarding ? 'LoginSignup' : 'Onboarding');
            }, 1800);

            return () => clearTimeout(timer);
        };

        let cleanup: (() => void) | undefined;
        boot().then((result) => { cleanup = result; });

        return () => {
            active = false;
            cleanup?.();
        };
    }, [navigation]);

    return (
        <LinearGradient colors={COLORS.backgroundGradient} style={styles.container}>
            <View style={styles.content}>
                <LinearGradient
                    colors={['rgba(255,255,255,0.68)', 'rgba(255,255,255,0.30)']}
                    style={styles.iconGlow}
                >
                    <MaterialCommunityIcons name="handshake" size={110} color={COLORS.primary} />
                </LinearGradient>

                <Text style={styles.title}>2gether</Text>
                <Text style={styles.subtitle}>Achieve More Together</Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        backgroundColor: COLORS.glassBg,
        borderWidth: 1.5,
        borderColor: COLORS.glassBorder,
        borderRadius: 36,
        paddingHorizontal: 44,
        paddingVertical: 48,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.20,
        shadowRadius: 36,
        elevation: 12,
    },
    iconGlow: {
        width: 180,
        height: 180,
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
        borderWidth: 1.5,
        borderColor: COLORS.glassBorderStrong,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 8,
    },
    title: {
        fontSize: 52,
        fontWeight: 'bold',
        color: COLORS.text,
        letterSpacing: 1,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 17,
        color: COLORS.text,
        fontWeight: '500',
        letterSpacing: 0.4,
        opacity: 0.75,
    },
});

export default LaunchScreen;
