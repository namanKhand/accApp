import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FriendsScreen = () => {
    const { user, goals, checkIns } = useApp();
    const navigation = useNavigation<NavigationProp>();

    // Get the shared goal (one where we have an assigned partner)
    const partnerGoal = goals.find(g => g.partnerId && g.partnerId !== '');

    // Get partner's check-ins
    const partnerCheckIns = useMemo(() => {
        if (!partnerGoal || !user) return [];
        return checkIns
            .filter(ci => ci.goalId === partnerGoal.id && ci.userId !== user.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5); // Show last 5 check-ins
    }, [checkIns, partnerGoal, user]);

    const hasPartner = partnerGoal && partnerCheckIns.length > 0;

    if (!hasPartner) {
        const hasGoal = goals.length > 0;
        return (
            <SafeAreaView style={styles.container}>
                <LinearGradient colors={COLORS.backgroundGradient} style={StyleSheet.absoluteFillObject} />
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>You & Me</Text>
                </View>

                <View style={styles.content}>
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="account-plus-outline" size={40} color={COLORS.text} />
                    </View>

                    <Text style={styles.title}>No Partner Yet</Text>

                    <Text style={styles.subtitle}>
                        Accountability partners increase your chances of reaching a goal to 95%. Invite someone you trust!
                    </Text>

                    <TouchableOpacity
                        style={styles.inviteButton}
                        onPress={() => navigation.getParent()?.navigate(hasGoal ? 'InviteFriend' : 'GoalSetup')}
                    >
                        <MaterialCommunityIcons name="email-fast-outline" size={20} color={COLORS.surface} />
                        <Text style={styles.inviteButtonText}>Invite a Friend</Text>
                    </TouchableOpacity>
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
                <LinearGradient colors={['rgba(255,255,255,0.54)', 'rgba(255,255,255,0.22)']} style={styles.card}>
                    <Text style={styles.cardTitle}>Partner's Goal:</Text>
                    <Text style={styles.goalText}>{partnerGoal.title}</Text>
                    {partnerGoal.description && (
                        <Text style={styles.goalDescription}>{partnerGoal.description}</Text>
                    )}
                </LinearGradient>

                {/* Recent Check-Ins */}
                <Text style={styles.sectionTitle}>Recent Activity</Text>

                {partnerCheckIns.map((checkIn) => (
                    <LinearGradient key={checkIn.id} colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.18)']} style={styles.checkInCard}>
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
                    </LinearGradient>
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
        marginHorizontal: 20,
        marginTop: 8,
        borderRadius: 22,
        backgroundColor: COLORS.glassBg,
        borderWidth: 1.5,
        borderColor: COLORS.glassBorder,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 4,
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
        borderRadius: 20,
        padding: 18,
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: COLORS.glassBorder,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.14,
        shadowRadius: 18,
        elevation: 5,
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
        borderRadius: 20,
        padding: 16,
        marginBottom: 15,
        borderWidth: 1.5,
        borderColor: COLORS.glassBorder,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.13,
        shadowRadius: 18,
        elevation: 5,
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
        backgroundColor: 'rgba(255,255,255,0.26)',
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
    inviteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.38)',
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 5,
    },
    inviteButtonText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FriendsScreen;
