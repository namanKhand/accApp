import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/authService';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WaitingForPartnerScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);

    const handleLogout = async () => {
        await authService.signOut();
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFillObject} />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Main')}>
                    <MaterialCommunityIcons name="chevron-left" size={26} color={colors.text} />
                    <Text style={styles.backText}>Continue to App</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <LinearGradient
                    colors={[colors.glassBgStrong, colors.glassBg]}
                    style={styles.iconRing}
                >
                    <ActivityIndicator size="large" color={colors.primary} />
                </LinearGradient>

                <Text style={styles.title}>Waiting for Partner</Text>

                <LinearGradient
                    colors={[colors.glassBgStrong, colors.glassBg]}
                    style={styles.card}
                >
                    <View style={styles.row}>
                        <MaterialCommunityIcons name="check-circle-outline" size={22} color={colors.primary} style={styles.rowIcon} />
                        <Text style={styles.description}>You have successfully sent an invite to your accountability partner.</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <MaterialCommunityIcons name="download-circle-outline" size={22} color={colors.primary} style={styles.rowIcon} />
                        <Text style={styles.description}>Once your partner downloads the app and signs up using the email you invited, they will be asked to join your goal.</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <MaterialCommunityIcons name="bell-ring-outline" size={22} color={colors.primary} style={styles.rowIcon} />
                        <Text style={styles.description}>We'll let you in as soon as they accept!</Text>
                    </View>
                </LinearGradient>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const makeStyles = (colors: ReturnType<typeof import('../context/ThemeContext').useTheme>['colors']) =>
    StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 4,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: colors.glassBg,
        borderWidth: 1.5,
        borderColor: colors.glassBorder,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 14,
        shadowColor: colors.primaryDark,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 3,
    },
    backText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 2,
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconRing: {
        width: 88,
        height: 88,
        borderRadius: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
        borderWidth: 1.5,
        borderColor: colors.glassBorder,
        shadowColor: colors.primaryDark,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 28,
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    card: {
        borderWidth: 1.5,
        borderColor: colors.glassBorder,
        borderRadius: 24,
        padding: 24,
        width: '100%',
        shadowColor: colors.primaryDark,
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.16,
        shadowRadius: 28,
        elevation: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 4,
    },
    rowIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    description: {
        flex: 1,
        fontSize: 15,
        color: colors.text,
        lineHeight: 23,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.60)',
        marginVertical: 14,
    },
    logoutButton: {
        marginTop: 36,
        paddingVertical: 10,
        paddingHorizontal: 24,
    },
    logoutText: {
        color: colors.secondary,
        fontSize: 15,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});

export default WaitingForPartnerScreen;

