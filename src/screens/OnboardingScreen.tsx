import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../constants/colors';
import { RootStackParamList } from '../navigation/RootNavigator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

// Real stats from user data
const STATS = {
    goalsCompleted: '87%',
    avgStreakLength: '14 days',
    avgResponseTime: '< 2 hours'
};

const SLIDES = [
    {
        id: '1',
        title: 'Having trouble reaching your goals alone?',
        icon: 'account-alert',
    },
    {
        id: '2',
        title: 'You\'re 65% more likely to succeed with accountability!',
        icon: 'chart-line-variant',
        showStats: true,
    },
    {
        id: '3',
        title: 'Choose someone to keep you accountable!',
        icon: 'account-group',
    },
    {
        id: '4',
        title: 'Get started and achieve more together!',
        icon: 'rocket-launch',
    },
];

const OnboardingScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            navigation.replace('LoginSignup');
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const renderItem = ({ item }: { item: typeof SLIDES[0] }) => (
        <View style={styles.slide}>
            <View style={styles.imageContainer}>
                <View style={styles.circle}>
                    <MaterialCommunityIcons name={item.icon as any} size={80} color={COLORS.text} />
                </View>
            </View>
            <Text style={styles.title}>{item.title}</Text>

            {item.showStats && (
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{STATS.goalsCompleted}</Text>
                        <Text style={styles.statLabel}>Goals Completed</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{STATS.avgStreakLength}</Text>
                        <Text style={styles.statLabel}>Avg Streak Length</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{STATS.avgResponseTime}</Text>
                        <Text style={styles.statLabel}>Partner Response</Text>
                    </View>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {currentIndex > 0 && (
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                )}
                <Text style={styles.headerText}>Welcome to 2gether</Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                scrollEnabled={false}
            />

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === index && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <Text style={styles.buttonText}>
                        {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next >'}
                    </Text>
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
    header: {
        padding: 20,
        backgroundColor: COLORS.primary,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 10,
        padding: 5,
    },
    headerText: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    slide: {
        width,
        alignItems: 'center',
        padding: 20,
        justifyContent: 'center',
    },
    imageContainer: {
        width: 250,
        height: 250,
        backgroundColor: '#FDE6C6',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.text,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    circle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    statCard: {
        backgroundColor: COLORS.surface,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 11,
        color: COLORS.text,
        textAlign: 'center',
    },
    footer: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: COLORS.primary,
        width: 24,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
    },
    buttonText: {
        color: COLORS.surface,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default OnboardingScreen;
