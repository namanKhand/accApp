import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { getCountdown } from '../utils/dateUtils';
import { calculateCurrentStreak, calculateLongestStreak } from '../utils/streakUtils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
    const { user, goals, checkIns, recordCheckIn } = useApp();
    const navigation = useNavigation<NavigationProp>();
    const currentGoal = goals[goals.length - 1];
    const [checkInImage, setCheckInImage] = useState<string | null>(null);
    const [checkOutImage, setCheckOutImage] = useState<string | null>(null);
    const [checkInTime, setCheckInTime] = useState<string | null>(null);
    const [checkOutTime, setCheckOutTime] = useState<string | null>(null);

    const countdown = currentGoal ? getCountdown(currentGoal.endDate) : null;

    // Calculate streaks from check-ins
    const goalCheckIns = useMemo(() =>
        currentGoal ? checkIns.filter(ci => ci.goalId === currentGoal.id) : [],
        [checkIns, currentGoal]
    );

    const currentStreak = useMemo(() =>
        calculateCurrentStreak(goalCheckIns),
        [goalCheckIns]
    );

    const longestStreak = useMemo(() =>
        calculateLongestStreak(goalCheckIns),
        [goalCheckIns]
    );

    const handleCheckIn = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
            });

            if (!result.canceled) {
                const timestamp = new Date().toISOString();
                setCheckInImage(result.assets[0].uri);
                setCheckInTime(timestamp);
                Alert.alert('Success', 'Check-in complete! Go crush your goal!');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while taking the photo.');
            console.error(error);
        }
    };

    const handleCheckOut = async () => {
        if (!checkInImage || !checkInTime) {
            Alert.alert('Error', 'Please check in first!');
            return;
        }

        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
            });

            if (!result.canceled && currentGoal && user) {
                const checkOutTimestamp = new Date().toISOString();
                setCheckOutImage(result.assets[0].uri);
                setCheckOutTime(checkOutTimestamp);

                // Save check-in record with both photos and timestamps
                await recordCheckIn({
                    userId: user.id,
                    goalId: currentGoal.id,
                    date: new Date().toISOString(),
                    checkInAt: checkInTime,
                    checkOutAt: checkOutTimestamp,
                    photoUri: checkInImage,
                    checkOutPhotoUri: result.assets[0].uri,
                    verifiedByPartner: false,
                });

                Alert.alert('Success', 'Check-out complete! Great job today!');

                // Reset for next check-in
                setCheckInImage(null);
                setCheckOutImage(null);
                setCheckInTime(null);
                setCheckOutTime(null);
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while checking out.');
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logoText}>2gether</Text>
                <Text style={styles.headerTitle}>ME</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* My Goal Card */}
                <View style={styles.card}>
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
                            <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.primary} />
                            <Text style={styles.countdownText}>{countdown}</Text>
                        </View>
                    )}
                </View>

                {/* Streaks */}
                <View style={styles.streaksRow}>
                    <View style={styles.streakContainer}>
                        <Text style={styles.streakLabel}>Current Streak:</Text>
                        <Text style={styles.streakValue}>{currentStreak} days 🔥</Text>
                    </View>
                    <View style={styles.streakContainer}>
                        <Text style={styles.streakLabel}>Longest Streak:</Text>
                        <Text style={styles.streakValue}>{longestStreak} days 🏆</Text>
                    </View>
                </View>

                {/* Check-In */}
                <View style={styles.actionCard}>
                    <Text style={styles.actionTitle}>Check-In:</Text>
                    <View style={styles.iconContainer}>
                        {checkInImage ? (
                            <Image source={{ uri: checkInImage }} style={styles.checkInImage} />
                        ) : (
                            <MaterialCommunityIcons name="camera-outline" size={50} color={COLORS.text} />
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
                </View>

                {/* Check-Out */}
                <View style={styles.actionCard}>
                    <Text style={styles.actionTitle}>Check-Out:</Text>
                    <View style={styles.iconContainer}>
                        {checkOutImage ? (
                            <Image source={{ uri: checkOutImage }} style={styles.checkInImage} />
                        ) : (
                            <MaterialCommunityIcons name="camera-off-outline" size={50} color={COLORS.text} />
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
                </View>

                <Text style={styles.hintText}>Take a photo before and after you start your action!</Text>

                {/* Accountability Partner */}
                <View style={styles.partnerCard}>
                    <Text style={styles.partnerTitle}>Who's Keeping You Accountable:</Text>
                    {user?.partnerId ? (
                        <>
                            <Text style={styles.partnerName}>Partner Name</Text>
                            <TouchableOpacity style={styles.editButtonSmall} onPress={() => navigation.navigate('InviteFriend')}>
                                <Text style={styles.editButtonTextSmall}>Edit</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity onPress={() => navigation.navigate('InviteFriend')}>
                            <Text style={[styles.partnerName, { textDecorationLine: 'underline', color: COLORS.primary }]}>
                                Add a Partner
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
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
        marginBottom: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    editButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 15,
    },
    editButtonText: {
        color: COLORS.surface,
        fontSize: 12,
        fontWeight: 'bold',
    },
    goalText: {
        fontSize: 14,
        color: COLORS.text,
        lineHeight: 20,
        textAlign: 'center',
    },
    bold: {
        fontWeight: 'bold',
    },
    countdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.secondary + '40',
    },
    countdownText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    streaksRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        gap: 10,
    },
    streakContainer: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    streakLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 5,
        textAlign: 'center',
    },
    streakValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
    },
    actionCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        alignItems: 'center',
    },
    actionTitle: {
        alignSelf: 'flex-start',
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    iconContainer: {
        marginBottom: 15,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkInImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    timestampText: {
        fontSize: 12,
        color: COLORS.text,
        marginBottom: 10,
    },
    actionButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: COLORS.secondary,
        opacity: 0.5,
    },
    actionButtonText: {
        color: COLORS.surface,
        fontWeight: 'bold',
        fontSize: 14,
    },
    hintText: {
        textAlign: 'center',
        color: COLORS.text,
        fontSize: 12,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    partnerCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
    },
    partnerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 5,
    },
    partnerName: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 10,
    },
    editButtonSmall: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 15,
    },
    editButtonTextSmall: {
        color: COLORS.surface,
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
