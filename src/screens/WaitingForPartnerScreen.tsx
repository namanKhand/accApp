import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { authService } from '../services/authService';

const WaitingForPartnerScreen = () => {
    // The AppContext constantly listens for invites in the background.
    // If an invite is accepted and a partner joins the goal, RootNavigator
    // will automatically unmount this screen and mount MainTabs.

    const handleLogout = async () => {
        await authService.signOut();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
                <Text style={styles.title}>Waiting for Partner</Text>

                <View style={styles.card}>
                    <Text style={styles.description}>
                        You have successfully sent an invite to your accountability partner.
                    </Text>
                    <Text style={styles.description}>
                        Once your partner downloads the app and signs up using the email you invited, they will be asked to join your goal.
                    </Text>
                    <Text style={styles.description}>
                        We'll let you in as soon as they accept!
                    </Text>
                </View>

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
    spinner: {
        marginBottom: 30,
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
        marginBottom: 15,
        lineHeight: 24,
    },
    logoutButton: {
        marginTop: 40,
        padding: 10,
    },
    logoutText: {
        color: COLORS.secondary,
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default WaitingForPartnerScreen;
