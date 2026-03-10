import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';

const AcceptInviteScreen = () => {
    const { receivedInvites, acceptInvite, user } = useApp();
    const [loading, setLoading] = useState(false);

    // We only show this screen if receivedInvites.length > 0 (handled by RootNavigator)
    const pendingInvite = receivedInvites[0];

    const handleAccept = async () => {
        if (!pendingInvite) return;

        setLoading(true);
        try {
            await acceptInvite(pendingInvite);
            // RootNavigator will automatically unmount this screen once the goal is set
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
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
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

                    <Text style={styles.subtitle}>Goal id:</Text>
                    <Text style={styles.goalTitle}>{pendingInvite.goalId}</Text>

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
                        <ActivityIndicator color={COLORS.surface} />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    emoji: {
        fontSize: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 30,
        textAlign: 'center',
    },
    card: {
        backgroundColor: COLORS.surface,
        padding: 25,
        borderRadius: 15,
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    description: {
        fontSize: 16,
        color: COLORS.text,
        textAlign: 'center',
        lineHeight: 24,
    },
    divider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        width: '100%',
        marginVertical: 15,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.secondary,
        marginBottom: 5,
    },
    goalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
    },
    bold: {
        fontWeight: 'bold',
    },
    acceptButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    disabledButton: {
        opacity: 0.7,
    },
    acceptButtonText: {
        color: COLORS.surface,
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutButton: {
        marginTop: 20,
        padding: 10,
    },
    logoutText: {
        color: COLORS.secondary,
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default AcceptInviteScreen;
