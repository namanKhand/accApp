import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';

const ProfileScreen: React.FC = () => {
    const { user, goals } = useApp();
    const ownedGoals = goals.filter(g => g.ownerId === user?.id).length;

    const InfoRow = ({ icon, label, value }: { icon: any; label: string; value: string }) => (
        <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
                <MaterialCommunityIcons name={icon} size={22} color={COLORS.primary} />
            </View>
            <View style={styles.infoText}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={COLORS.backgroundGradient} style={StyleSheet.absoluteFillObject} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Avatar */}
                <LinearGradient
                    colors={['rgba(255,255,255,0.68)', 'rgba(255,255,255,0.30)']}
                    style={styles.avatar}
                >
                    <Text style={styles.avatarInitial}>
                        {user?.displayName?.charAt(0).toUpperCase() ?? '?'}
                    </Text>
                </LinearGradient>

                <Text style={styles.displayName}>{user?.displayName ?? 'Guest'}</Text>
                <Text style={styles.email}>{user?.email ?? ''}</Text>

                {/* Info card */}
                <LinearGradient
                    colors={['rgba(255,255,255,0.58)', 'rgba(255,255,255,0.28)']}
                    style={styles.card}
                >
                    <InfoRow icon="target" label="Goals Created" value={String(ownedGoals)} />
                    <View style={styles.divider} />
                    <InfoRow
                        icon="account-heart-outline"
                        label="Accountability Partner"
                        value={user?.partnerId ? 'Linked' : 'Not linked yet'}
                    />
                    <View style={styles.divider} />
                    <InfoRow
                        icon="identifier"
                        label="User ID"
                        value={user?.id ? user.id.slice(0, 12) + '...' : 'N/A'}
                    />
                </LinearGradient>

                <TouchableOpacity style={styles.signOutButton} onPress={() => authService.signOut()}>
                    <MaterialCommunityIcons name="logout" size={18} color={COLORS.error} style={{ marginRight: 8 }} />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: {
        alignItems: 'center',
        padding: 24,
        paddingBottom: 100,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: COLORS.glassBorderStrong,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.20,
        shadowRadius: 16,
        elevation: 6,
    },
    avatarInitial: {
        fontSize: 40,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    displayName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        letterSpacing: 0.3,
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: COLORS.text,
        opacity: 0.6,
        marginBottom: 32,
    },
    card: {
        width: '100%',
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: COLORS.glassBorder,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginBottom: 32,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.16,
        shadowRadius: 24,
        elevation: 6,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    infoIcon: {
        width: 36,
        alignItems: 'center',
        marginRight: 14,
    },
    infoText: { flex: 1 },
    infoLabel: {
        fontSize: 12,
        color: COLORS.secondary,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: COLORS.text,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.60)',
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(176,0,32,0.08)',
        borderWidth: 1.5,
        borderColor: 'rgba(176,0,32,0.18)',
        paddingVertical: 13,
        paddingHorizontal: 32,
        borderRadius: 14,
    },
    signOutText: {
        color: COLORS.error,
        fontSize: 15,
        fontWeight: '600',
    },
});

export default ProfileScreen;
