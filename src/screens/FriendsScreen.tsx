import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const FriendsScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>You & Me</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.iconCircle}>
                    <MaterialCommunityIcons name="account-check-outline" size={40} color={COLORS.text} />
                </View>

                <Text style={styles.title}>No Partner Yet</Text>

                <Text style={styles.subtitle}>
                    No invites yet. Have your friend try again or check back later.
                </Text>

                <Text style={styles.description}>
                    Ask your friend to accept the invite, or switch to Partner's Perspective in Dev Mode to see how they view your goal.
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EAE0D5', // Slightly darker beige for circle
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    description: {
        fontSize: 14,
        color: COLORS.text,
        textAlign: 'center',
        lineHeight: 20,
        opacity: 0.8,
    },
});

export default FriendsScreen;
