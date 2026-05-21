import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import * as ImagePicker from 'expo-image-picker';
import * as Device from 'expo-device';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { getCountdown } from '../utils/dateUtils';
import { calculateCurrentStreak, calculateLongestStreak } from '../utils/streakUtils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
    const { user, goals, checkIns, recordCheckIn } = useApp();
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const navigation = useNavigation<NavigationProp>();
    const currentGoal = goals
        .filter(g => g.ownerId === user?.id && g.status === 'active')
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0]
        ?? goals[goals.length - 1];
    const [checkInImage, setCheckInImage] = useState<string | null>(null);
    const [checkOutImage, setCheckOutImage] = useState<string | null>(null);
    const [checkInTime, setCheckInTime] = useState<string | null>(null);
    const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
    const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
        };
    }, []);

    const countdown = currentGoal ? getCountdown(currentGoal.endDate) : null;

    // Calculate streaks from my check-ins
    const goalCheckIns = useMemo(() =>
        currentGoal ? checkIns.filter(ci => ci.goalId === currentGoal.id && ci.userId === user?.id) : [],
        [checkIns, currentGoal, user]
    );

    const currentStreak = useMemo(() =>
        calculateCurrentStreak(goalCheckIns),
        [goalCheckIns]
    );

    const longestStreak = useMemo(() =>
        calculateLongestStreak(goalCheckIns),
        [goalCheckIns]
    );

    const openPhotoCapture = async () => {
        // Simulator has no camera — inform the developer; real builds always use camera
        if (!Device.isDevice) {
            Alert.alert(
                'Camera Required',
                'Check-ins require a live photo taken with your camera. This feature is only available on a physical device.',
            );
            return null;
        }

        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Camera Permission Required',
                'Please enable camera access in Settings so you can take your progress photo.',
            );
            return null;
        }

        try {
            return await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.6,
            });
        } catch (error) {
            console.error('Camera launch failed:', error);
            Alert.alert('Camera Error', 'Could not open the camera. Please try again.');
            return null;
        }
    };

    const handleCheckIn = async () => {
        try {
            const result = await openPhotoCapture();
            if (!result || result.canceled || !result.assets?.length) {
                return;
            }

            const timestamp = new Date().toISOString();
            setCheckInImage(result.assets[0].uri);
            setCheckInTime(timestamp);
            setCheckOutImage(null);
            setCheckOutTime(null);
            Alert.alert('Success', 'Check-in complete! Go crush your goal!');
        } catch (error) {
            Alert.alert('Error', 'An error occurred while capturing your check-in photo.');
            console.error(error);
        }
    };

    const handleCheckOut = async () => {
        if (!checkInImage || !checkInTime) {
            Alert.alert('Error', 'Please check in first!');
            return;
        }

        try {
            const result = await openPhotoCapture();

            if (!result || result.canceled) {
                return;
            }

            if (!result.assets || result.assets.length === 0) {
                Alert.alert('Error', 'No photo was captured');
                return;
            }

            const checkOutTimestamp = new Date().toISOString();
            const photoUri = result.assets[0].uri;

            // Set the photo and time immediately so user sees it
            setCheckOutImage(photoUri);
            setCheckOutTime(checkOutTimestamp);

            // Save check-in record with both photos and timestamps
            if (currentGoal && user) {
                try {
                    await recordCheckIn({
                        userId: user.id,
                        goalId: currentGoal.id,
                        date: new Date().toISOString(),
                        checkInAt: checkInTime,
                        checkOutAt: checkOutTimestamp,
                        photoUri: checkInImage,
                        checkOutPhotoUri: photoUri,
                        verifiedByPartner: false,
                    });

                    Alert.alert('Success', 'Check-out complete! Great job today!');

                    // Reset for next check-in
                    resetTimeoutRef.current = setTimeout(() => {
                        setCheckInImage(null);
                        setCheckOutImage(null);
                        setCheckInTime(null);
                        setCheckOutTime(null);
                    }, 2000); // Give user time to see the success message
                } catch (saveError) {
                    console.error('Error saving check-in:', saveError);
                    Alert.alert('Warning', 'Photo captured but failed to save. Please try again.');
                }
            }
        } catch (error: any) {
            if (error.message === 'permission_denied') {
                Alert.alert('Permission Denied', 'Camera or photo library permission is required.');
            } else {
                console.error('Check-out error:', error);
                Alert.alert('Error', 'An error occurred while checking out.');
            }
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFillObject} />
            <View style={[styles.header, { backgroundColor: colors.glassBg, borderColor: colors.glassBorder }]}>
                <Text style={styles.logoText}>2gether</Text>
                <Text style={styles.headerTitle}>ME</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* My Goal Card */}
                <LinearGradient colors={[colors.glassBgStrong, colors.glassBg]} style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>My Goal:</Text>
                        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('GoalSetup')}>
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.goalText}>
                        {currentGoal ? (
                            <>
                                I want to <Text style={styles.bold}>{currentGoal.title.replace('I want to ', '')}</Text>
                                {currentGoal.customSchedule ? ` every ${currentGoal.customSchedule.split(',').join(' and ')} ` : ''}
                                {currentGoal.description ? `, so I can ${currentGoal.description} ` : ''}.
                            </>
                        ) : (
                            'No goal set yet.'
                        )}
                    </Text>
                    {countdown && (
                        <View style={styles.countdownContainer}>
                            <MaterialCommunityIcons name="clock-outline" size={16} color={colors.primary} />
                            <Text style={styles.countdownText}>{countdown}</Text>
                        </View>
                    )}
                </LinearGradient>

                {/* Streaks */}
                <View style={styles.streaksRow}>
                    <LinearGradient colors={[colors.glassBgStrong, colors.glassBg]} style={styles.streakContainer}>
                        <Text style={styles.streakLabel}>Current Streak:</Text>
                        <Text style={styles.streakValue}>{currentStreak} days 🔥</Text>
                    </LinearGradient>
                    <LinearGradient colors={[colors.glassBgStrong, colors.glassBg]} style={styles.streakContainer}>
                        <Text style={styles.streakLabel}>Longest Streak:</Text>
                        <Text style={styles.streakValue}>{longestStreak} days 🏆</Text>
                    </LinearGradient>
                </View>

                {/* Check-In */}
                <LinearGradient colors={[colors.glassBgStrong, colors.glassBg]} style={styles.actionCard}>
                    <Text style={styles.actionTitle}>Check-In:</Text>
                    <View style={styles.iconContainer}>
                        {checkInImage ? (
                            <Image source={{ uri: checkInImage }} style={styles.checkInImage} />
                        ) : (
                            <MaterialCommunityIcons name="camera-outline" size={50} color={colors.text} />
                        )}
                    </View>
                    {checkInTime && (
                        <Text style={styles.timestampText}>
                            {new Date(checkInTime).toLocaleTimeString()}
                        </Text>
                    )}
                    <TouchableOpacity style={styles.actionButton} onPress={handleCheckIn}>
                        <Text style={styles.actionButtonText}>{checkInImage ? 'Retake Photo' : 'Take Photo'}</Text>
                    </TouchableOpacity>
                </LinearGradient>

                {/* Check-Out */}
                <LinearGradient colors={[colors.glassBgStrong, colors.glassBg]} style={styles.actionCard}>
                    <Text style={styles.actionTitle}>Check-Out:</Text>
                    <View style={styles.iconContainer}>
                        {checkOutImage ? (
                            <Image source={{ uri: checkOutImage }} style={styles.checkInImage} />
                        ) : (
                            <MaterialCommunityIcons name="camera-off-outline" size={50} color={colors.text} />
                        )}
                    </View>
                    {checkOutTime && (
                        <Text style={styles.timestampText}>
                            {new Date(checkOutTime).toLocaleTimeString()}
                        </Text>
                    )}
                    <TouchableOpacity
                        style={[styles.actionButton, !checkInImage && styles.disabledButton]}
                        onPress={handleCheckOut}
                        disabled={!checkInImage}
                    >
                        <Text style={styles.actionButtonText}>{checkOutImage ? 'Retake Photo' : 'Check-Out'}</Text>
                    </TouchableOpacity>
                </LinearGradient>

                <Text style={styles.hintText}>Take a photo before and after you start your action!</Text>

                {/* Accountability Partner */}
                <LinearGradient colors={[colors.glassBgStrong, colors.glassBg]} style={styles.partnerCard}>
                    <Text style={styles.partnerTitle}>Who's Keeping You Accountable:</Text>
                    {user?.partnerId ? (
                        <>
                            <Text style={styles.partnerName}>Your Partner</Text>
                            <TouchableOpacity style={styles.editButtonSmall} onPress={() => navigation.navigate('InviteFriend')}>
                                <Text style={styles.editButtonTextSmall}>Edit</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            style={styles.inviteButton}
                            onPress={() => navigation.getParent()?.navigate(currentGoal ? 'InviteFriend' : 'GoalSetup')}
                        >
                            <MaterialCommunityIcons name="email-fast-outline" size={18} color={colors.surface} />
                            <Text style={styles.inviteButtonText}>Invite a Friend</Text>
                        </TouchableOpacity>
                    )}
                </LinearGradient>
            </ScrollView>
        </SafeAreaView>
    );
};

const makeStyles = (colors: ReturnType<typeof import('../context/ThemeContext').useTheme>['colors']) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        header: {
            paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center',
            justifyContent: 'center', position: 'relative', height: 50,
            marginHorizontal: 20, marginTop: 8, borderRadius: 22,
            backgroundColor: colors.glassBg, borderWidth: 1, borderColor: colors.glassBorder,
        },
        logoText: { position: 'absolute', left: 20, fontSize: 18, fontWeight: 'bold', color: colors.text },
        headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
        scrollContent: { padding: 20, paddingBottom: 100 },
        card: {
            borderRadius: 15, padding: 15, marginBottom: 15,
            borderWidth: 1, borderColor: colors.glassBorder,
            shadowColor: colors.primaryDark, shadowOffset: { width: 0, height: 14 },
            shadowOpacity: 0.15, shadowRadius: 22, elevation: 7,
        },
        cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
        cardTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text },
        editButton: { backgroundColor: colors.primary, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15 },
        editButtonText: { color: colors.surface, fontSize: 12, fontWeight: 'bold' },
        goalText: { fontSize: 14, color: colors.text, lineHeight: 20, textAlign: 'center' },
        bold: { fontWeight: 'bold' },
        countdownContainer: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.secondary + '40',
        },
        countdownText: { fontSize: 14, color: colors.primary, fontWeight: 'bold', marginLeft: 5 },
        streaksRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, gap: 10 },
        streakContainer: {
            flex: 1, borderRadius: 15, padding: 15, alignItems: 'center',
            borderWidth: 1, borderColor: colors.glassBorder,
            shadowColor: colors.primaryDark, shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.12, shadowRadius: 20, elevation: 6,
        },
        streakLabel: { fontSize: 12, fontWeight: '600', color: colors.text, marginBottom: 5, textAlign: 'center' },
        streakValue: { fontSize: 18, fontWeight: 'bold', color: colors.primary, textAlign: 'center' },
        actionCard: {
            borderRadius: 15, padding: 15, marginBottom: 15, alignItems: 'center',
            borderWidth: 1, borderColor: colors.glassBorder,
            shadowColor: colors.primaryDark, shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.12, shadowRadius: 20, elevation: 6,
        },
        actionTitle: { alignSelf: 'flex-start', fontSize: 14, fontWeight: 'bold', color: colors.text, marginBottom: 10 },
        iconContainer: {
            marginBottom: 15, height: 60, justifyContent: 'center', alignItems: 'center',
            width: '100%', borderRadius: 14, backgroundColor: colors.glassBg,
        },
        checkInImage: { width: '100%', height: 180, borderRadius: 12 },
        timestampText: { fontSize: 12, color: colors.secondary, marginBottom: 10 },
        actionButton: {
            backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 30,
            borderRadius: 12, width: '100%', alignItems: 'center',
        },
        disabledButton: { backgroundColor: colors.secondary, opacity: 0.5 },
        actionButtonText: { color: colors.surface, fontWeight: 'bold', fontSize: 14 },
        hintText: { textAlign: 'center', color: colors.secondary, fontSize: 12, marginBottom: 20, paddingHorizontal: 20 },
        partnerCard: {
            borderRadius: 15, padding: 15, alignItems: 'center',
            borderWidth: 1, borderColor: colors.glassBorder,
            shadowColor: colors.primaryDark, shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.12, shadowRadius: 20, elevation: 6,
        },
        partnerTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text, marginBottom: 5 },
        partnerName: { fontSize: 14, color: colors.text, marginBottom: 10 },
        editButtonSmall: { backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 5, borderRadius: 15 },
        editButtonTextSmall: { color: colors.surface, fontSize: 12, fontWeight: 'bold' },
        inviteButton: {
            flexDirection: 'row', alignItems: 'center', gap: 8,
            backgroundColor: colors.primary, paddingVertical: 11, paddingHorizontal: 24,
            borderRadius: 14, marginTop: 8, borderWidth: 1, borderColor: colors.glassBorder,
            shadowColor: colors.primaryDark, shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.30, shadowRadius: 8, elevation: 4,
        },
        inviteButtonText: { color: colors.surface, fontSize: 14, fontWeight: 'bold' },
    });

export default HomeScreen;
