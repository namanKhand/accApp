import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { COLORS } from '../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

const FriendsScreen = () => {
    const { user, goals, checkIns } = useApp();

    // Get partner's goal (for now, just use the first goal)
    const partnerGoal = goals[0];

    // Get partner's check-ins
    const partnerCheckIns = useMemo(() => {
        if (!partnerGoal) return [];
        // In a real app, filter by partner's userId
        // For now, show all check-ins for the goal
        return checkIns
            .filter(ci => ci.goalId === partnerGoal.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5); // Show last 5 check-ins
    }, [checkIns, partnerGoal]);

    const hasPartner = partnerGoal && partnerCheckIns.length > 0;

    if (!hasPartner) {
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
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logoText}>2gether</Text>
                <Text style={styles.headerTitle}>YOU & ME</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Partner Goal Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Partner's Goal:</Text>
                    <Text style={styles.goalText}>{partnerGoal.title}</Text>
                    {partnerGoal.description && (
                        <Text style={styles.goalDescription}>{partnerGoal.description}</Text>
                    )}
                </View>

                {/* Recent Check-Ins */}
                <Text style={styles.sectionTitle}>Recent Activity</Text>

                {partnerCheckIns.map((checkIn) => (
                    <View key={checkIn.id} style={styles.checkInCard}>
                        <View style={styles.checkInHeader}>
                            <MaterialCommunityIcons name="calendar-check" size={20} color={COLORS.primary} />
                            <Text style={styles.checkInDate}>
                                {new Date(checkIn.date).toLocaleDateString()}
                            </Text>
                        </View>

                        <View style={styles.photosRow}>
                            {/* Check-In Photo */}
                            <View style={styles.photoContainer}>
                                <Text style={styles.photoLabel}>Check-In</Text>
                                {checkIn.photoUri ? (
                                    <Image source={{ uri: checkIn.photoUri }} style={styles.photo} />
                                ) : (
                                    <View style={styles.photoPlaceholder}>
                                        <MaterialCommunityIcons name="camera-outline" size={30} color={COLORS.secondary} />
                                    </View>
                                )}
                                {checkIn.checkInAt && (
                                    <Text style={styles.photoTime}>
                                        {new Date(checkIn.checkInAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Text>
                                )}
                            </View>

                            {/* Check-Out Photo */}
                            <View style={styles.photoContainer}>
                                <Text style={styles.photoLabel}>Check-Out</Text>
                                {checkIn.checkOutPhotoUri ? (
                                    <Image source={{ uri: checkIn.checkOutPhotoUri }} style={styles.photo} />
                                ) : (
                                    <View style={styles.photoPlaceholder}>
                                        <MaterialCommunityIcons name="camera-off-outline" size={30} color={COLORS.secondary} />
                                    </View>
                                )}
                                {checkIn.checkOutAt && (
                                    <Text style={styles.photoTime}>
                                        {new Date(checkIn.checkOutAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Text>
                                )}
                            </View>
                        </View>

                        {checkIn.notes && (
                            <Text style={styles.notes}>"{checkIn.notes}"</Text>
                        )}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    logoText: {
        position: 'absolute',
        left: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    goalText: {
        fontSize: 16,
        color: COLORS.text,
        fontWeight: '600',
        marginBottom: 5,
    },
    goalDescription: {
        fontSize: 14,
        color: COLORS.text,
        opacity: 0.8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 15,
    },
    checkInCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    checkInHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    checkInDate: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginLeft: 8,
    },
    photosRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    photoContainer: {
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    photoLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 10,
        marginBottom: 5,
    },
    photoPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 10,
        backgroundColor: COLORS.secondary + '40',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    photoTime: {
        fontSize: 11,
        color: COLORS.text,
        opacity: 0.7,
    },
    notes: {
        fontSize: 13,
        color: COLORS.text,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.secondary + '40',
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
        backgroundColor: '#EAE0D5',
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
