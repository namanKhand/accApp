import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FriendsScreen = () => {
    const { user, partnerProfile, goals, checkIns } = useApp();
    const { colors } = useTheme();
    const navigation = useNavigation<NavigationProp>();

    // Partner's goal = goal NOT owned by me but where I'm the partner,
    // OR any active goal owned by the partner (via partnerId match on my goal)
    const partnerGoal = useMemo(() => {
        if (!user) return null;
        // Prefer: goal where I am the partner (ownerId is partner, partnerId is me)
        const asPartner = goals.find(g => g.ownerId !== user.id && g.partnerId === user.id);
        if (asPartner) return asPartner;
        // Fallback: goal owned by partner (ownerId matches user.partnerId)
        if (user.partnerId) return goals.find(g => g.ownerId === user.partnerId) ?? null;
        return null;
    }, [goals, user]);

    // Partner's check-ins (done by the partner, not me)
    const partnerCheckIns = useMemo(() => {
        if (!partnerGoal || !user) return [];
        return checkIns
            .filter(ci => ci.goalId === partnerGoal.id && ci.userId !== user.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
    }, [checkIns, partnerGoal, user]);

    const hasPartner = !!partnerGoal;
    const hasPartnerActivity = partnerCheckIns.length > 0;

    const styles = makeStyles(colors);

    if (!hasPartner) {
        const hasGoal = goals.length > 0;
        return (
            <SafeAreaView style={styles.container}>
                <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFillObject} />
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>You & Me</Text>
                </View>
                <View style={styles.content}>
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="account-plus-outline" size={40} color={colors.text} />
                    </View>
                    <Text style={styles.title}>No Partner Yet</Text>
                    <Text style={styles.subtitle}>
                        Accountability partners increase your chances of reaching a goal to 95%. Invite someone you trust!
                    </Text>
                    <TouchableOpacity
                        style={styles.inviteButton}
                        onPress={() => navigation.getParent()?.navigate(hasGoal ? 'InviteFriend' : 'GoalSetup')}
                    >
                        <MaterialCommunityIcons name="email-fast-outline" size={20} color={colors.surface} />
                        <Text style={styles.inviteButtonText}>Invite a Friend</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFillObject} />
            <View style={styles.header}>
                <Text style={styles.logoText}>2gether</Text>
                <Text style={styles.headerTitle}>YOU & ME</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Partner Info Card */}
                <LinearGradient colors={[colors.glassBgStrong, colors.glassBg]} style={styles.card}>
                    <View style={styles.partnerRow}>
                        <View style={styles.partnerAvatar}>
                            <MaterialCommunityIcons name="account-circle" size={40} color={colors.primary} />
                        </View>
                        <View style={styles.partnerInfo}>
                            <Text style={styles.partnerName}>
                                {partnerProfile?.displayName ?? 'Your Partner'}
                            </Text>
                            {partnerProfile?.email ? (
                                <Text style={styles.partnerEmail}>{partnerProfile.email}</Text>
                            ) : null}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.cardTitle}>Partner's Goal:</Text>
                    <Text style={styles.goalText}>{partnerGoal.title}</Text>
                    {partnerGoal.description ? (
                        <Text style={styles.goalDescription}>{partnerGoal.description}</Text>
                    ) : null}
                </LinearGradient>

                {/* Recent Check-Ins */}
                <Text style={styles.sectionTitle}>Recent Activity</Text>

                {!hasPartnerActivity && (
                    <Text style={styles.description}>Your partner hasn't checked in yet. Check back soon!</Text>
                )}
                {partnerCheckIns.map((checkIn) => (
                    <LinearGradient
                        key={checkIn.id}
                        colors={[colors.glassBgStrong, colors.glassBg]}
                        style={styles.checkInCard}
                    >
                        <View style={styles.checkInHeader}>
                            <MaterialCommunityIcons name="calendar-check" size={20} color={colors.primary} />
                            <Text style={styles.checkInDate}>
                                {new Date(checkIn.date).toLocaleDateString()}
                            </Text>
                        </View>

                        <View style={styles.photosRow}>
                            <View style={styles.photoContainer}>
                                <Text style={styles.photoLabel}>Check-In</Text>
                                {checkIn.photoUri ? (
                                    <Image source={{ uri: checkIn.photoUri }} style={styles.photo} />
                                ) : (
                                    <View style={styles.photoPlaceholder}>
                                        <MaterialCommunityIcons name="camera-outline" size={30} color={colors.secondary} />
                                    </View>
                                )}
                                {checkIn.checkInAt && (
                                    <Text style={styles.photoTime}>
                                        {new Date(checkIn.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.photoContainer}>
                                <Text style={styles.photoLabel}>Check-Out</Text>
                                {checkIn.checkOutPhotoUri ? (
                                    <Image source={{ uri: checkIn.checkOutPhotoUri }} style={styles.photo} />
                                ) : (
                                    <View style={styles.photoPlaceholder}>
                                        <MaterialCommunityIcons name="camera-off-outline" size={30} color={colors.secondary} />
                                    </View>
                                )}
                                {checkIn.checkOutAt && (
                                    <Text style={styles.photoTime}>
                                        {new Date(checkIn.checkOutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                )}
                            </View>
                        </View>

                        {checkIn.notes ? (
                            <Text style={styles.notes}>"{checkIn.notes}"</Text>
                        ) : null}
                    </LinearGradient>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const makeStyles = (colors: ReturnType<typeof import('../context/ThemeContext').useTheme>['colors']) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
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
            backgroundColor: colors.glassBg,
            borderWidth: 1.5,
            borderColor: colors.glassBorder,
        },
        logoText: {
            position: 'absolute',
            left: 20,
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
        },
        headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
        scrollContent: { padding: 20, paddingBottom: 100 },
        card: {
            borderRadius: 20,
            padding: 18,
            marginBottom: 20,
            borderWidth: 1.5,
            borderColor: colors.glassBorder,
            shadowColor: colors.primaryDark,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.14,
            shadowRadius: 18,
            elevation: 5,
        },
        partnerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
        partnerAvatar: { marginRight: 12 },
        partnerInfo: { flex: 1 },
        partnerName: { fontSize: 16, fontWeight: '700', color: colors.text },
        partnerEmail: { fontSize: 13, color: colors.secondary, marginTop: 2 },
        divider: { height: 1, backgroundColor: colors.glassBorder, marginVertical: 12 },
        cardTitle: { fontSize: 13, fontWeight: 'bold', color: colors.secondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
        goalText: { fontSize: 16, color: colors.text, fontWeight: '600', marginBottom: 4 },
        goalDescription: { fontSize: 14, color: colors.text, opacity: 0.8 },
        sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 15 },
        checkInCard: {
            borderRadius: 20,
            padding: 16,
            marginBottom: 15,
            borderWidth: 1.5,
            borderColor: colors.glassBorder,
            shadowColor: colors.primaryDark,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.13,
            shadowRadius: 18,
            elevation: 5,
        },
        checkInHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
        checkInDate: { fontSize: 14, fontWeight: '600', color: colors.text, marginLeft: 8 },
        photosRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
        photoContainer: { alignItems: 'center', flex: 1, marginHorizontal: 5 },
        photoLabel: { fontSize: 12, fontWeight: '600', color: colors.text, marginBottom: 8 },
        photo: { width: 120, height: 120, borderRadius: 10, marginBottom: 5 },
        photoPlaceholder: {
            width: 120,
            height: 120,
            borderRadius: 10,
            backgroundColor: colors.glassBg,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 5,
        },
        photoTime: { fontSize: 11, color: colors.text, opacity: 0.7 },
        notes: {
            fontSize: 13,
            color: colors.text,
            fontStyle: 'italic',
            textAlign: 'center',
            marginTop: 10,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: colors.secondary + '40',
        },
        content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
        iconCircle: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#EAE0D5',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
        },
        title: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 15 },
        subtitle: { fontSize: 16, color: colors.text, textAlign: 'center', marginBottom: 30, lineHeight: 24 },
        description: { fontSize: 14, color: colors.text, textAlign: 'center', lineHeight: 20, opacity: 0.8 },
        inviteButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: colors.primary,
            paddingVertical: 14,
            paddingHorizontal: 32,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.glassBorder,
        },
        inviteButtonText: { color: colors.surface, fontSize: 16, fontWeight: 'bold' },
    });

export default FriendsScreen;
