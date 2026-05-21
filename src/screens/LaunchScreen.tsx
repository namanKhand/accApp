import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/RootNavigator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Launch'>;

const LaunchScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { loading } = useApp();
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);

    useEffect(() => {
        if (loading) return;
        const timer = setTimeout(() => {
            navigation.replace('Onboarding');
        }, 2500);
        return () => clearTimeout(timer);
    }, [loading, navigation]);

    return (
        <View style={styles.container}>
            <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFillObject} />
            <View style={styles.content}>
                <View style={styles.imagePlaceholder}>
                    <MaterialCommunityIcons name="handshake" size={120} color={colors.primary} />
                </View>
                <Text style={styles.title}>2gether</Text>
                <Text style={styles.subtitle}>Achieve More Together</Text>
            </View>
        </View>
    );
};

const makeStyles = (colors: ReturnType<typeof import('../context/ThemeContext').useTheme>['colors']) =>
    StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
    content: { alignItems: 'center' },
    imagePlaceholder: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 48, fontWeight: 'bold', color: colors.text, marginBottom: 10 },
    subtitle: { fontSize: 18, color: colors.text, fontWeight: '500' },
});

export default LaunchScreen;
