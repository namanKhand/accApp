import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../constants/colors';
import { RootStackParamList } from '../navigation/RootNavigator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getHasSeenOnboarding } from '../utils/onboarding';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Launch'>;

const LaunchScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        let active = true;

        const boot = async () => {
            const hasSeenOnboarding = await getHasSeenOnboarding();

            const timer = setTimeout(() => {
                if (!active) {
                    return;
                }
                navigation.replace(hasSeenOnboarding ? 'LoginSignup' : 'Onboarding');
            }, 1800);

            return () => clearTimeout(timer);
        };

        let cleanup: (() => void) | undefined;
        boot().then((result) => {
            cleanup = result;
        });

        return () => {
            active = false;
            cleanup?.();
        };
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Placeholder for Fist Bump Illustration */}
                <View style={styles.imagePlaceholder}>
                    <MaterialCommunityIcons name="handshake" size={120} color={COLORS.primary} />
                </View>

                <Text style={styles.title}>2gether</Text>
                <Text style={styles.subtitle}>Achieve More Together</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.38)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.45)',
        borderRadius: 28,
        paddingHorizontal: 36,
        paddingVertical: 40,
        shadowColor: COLORS.text,
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
    },
    imagePlaceholder: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        // In a real app, this would be an Image component
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: COLORS.text,
        fontWeight: '500',
    },
});

export default LaunchScreen;
