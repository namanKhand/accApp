import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { goalService } from '../services/goalService';
import { Goal } from '../types';

const AcceptInviteScreen = () => {
    const { receivedInvites, acceptInvite } = useApp();
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const [loading, setLoading] = useState(false);
    const [partnerGoal, setPartnerGoal] = useState<Goal | null>(null);

    const pendingInvite = receivedInvites[0];

    useEffect(() => {
        if (pendingInvite?.goalId) {
            goalService.getGoalById(pendingInvite.goalId).then(setPartnerGoal);
        }
    }, [pendingInvite?.goalId]);

    const handleAccept = async () => {
        if (!pendingInvite) return;
        setLoading(true);
        try {
            await acceptInvite(pendingInvite);
        } catch (error) {
            console.error('Error accepting invite:', error);
            Alert.alert('Error', 'Failed to accept invitation. Please try again.');
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await authService.signOut();
    };

    if (!pendingInvite) {
        return (
            <SafeAreaView style={styles.container}>
                <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFillObject} />
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFillObject} />
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Text style={styles.emoji}>🤝</Text>
                </View>

                <Text style={styles.title}>You've Been Invited!</Text>

                <View style={styles.card}>
                    <Text style={styles.description}>
                        <Text style={styles.bold}>{pendingInvite.senderName}</Text> wants you to be their accountability partner.
                    </Text>

                    <View style={styles.divider} />

                    <Text style={styles.subtitle}>Their Goal:</Text>
                    <Text style={styles.goalTitle}>
                        {partnerGoal ? partnerGoal.title : 'Loading goal...'}
                    </Text>
                    {partnerGoal?.description ? (
                        <Text style={styles.goalDescription}>{partnerGoal.description}</Text>
                    ) : null}

                    <View style={styles.divider} />

                    <Text style={styles.description}>
                        By accepting, you commit to checking in and keeping each other accountable for this goal.
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.acceptButton, loading && styles.disabledButton]}
                    onPress={handleAccept}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.surface} />
                    ) : (
                        <Text style={styles.acceptButtonText}>Accept Invitation</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const makeStyles = (colors: ReturnType<typeof import('../context/ThemeContext').useTheme>['colors']) =>
    StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
    iconContainer: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: colors.surface,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
    },
    emoji: { fontSize: 40 },
    title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 30, textAlign: 'center' },
    card: {
        backgroundColor: colors.surface, padding: 25, borderRadius: 15,
        width: '100%', alignItems: 'center', marginBottom: 30,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
    },
    description: { fontSize: 16, color: colors.text, textAlign: 'center', lineHeight: 24 },
    divider: { height: 1, backgroundColor: '#EEEEEE', width: '100%', marginVertical: 15 },
    subtitle: { fontSize: 14, color: colors.secondary, marginBottom: 5 },
    goalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, textAlign: 'center' },
    goalDescription: { fontSize: 14, color: colors.secondary, textAlign: 'center', marginTop: 6 },
    bold: { fontWeight: 'bold' },
    acceptButton: {
        backgroundColor: colors.primary, paddingVertical: 15, paddingHorizontal: 40,
        borderRadius: 10, width: '100%', alignItems: 'center',
        shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 5, elevation: 4,
    },
    disabledButton: { opacity: 0.7 },
    acceptButtonText: { color: colors.surface, fontSize: 18, fontWeight: 'bold' },
    logoutButton: { marginTop: 20, padding: 10 },
    logoutText: { color: colors.secondary, fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' },
});

export default AcceptInviteScreen;
