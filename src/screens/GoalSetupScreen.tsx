import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../constants/colors';
import { RootStackParamList } from '../navigation/RootNavigator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Calendar } from 'react-native-calendars';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GoalSetup'>;

const GoalSetupScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { addGoal, user } = useApp();
    const [step, setStep] = useState(0);

    // Goal State
    const [action, setAction] = useState('');
    const [frequency, setFrequency] = useState<string[]>([]);
    const [motivation, setMotivation] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        } else {
            // Finish
            handleFinish();
        }
    };

    const handleFinish = async () => {
        // Create goal object
        if (!user) return;

        await addGoal({
            id: Math.random().toString(), // Will be ignored by service
            ownerId: user.id,
            title: `I want to ${action}`,
            description: motivation,
            cadence: 'custom',
            customSchedule: frequency.join(','),
            startDate: new Date().toISOString(),
            endDate: deadline,
            streak: 0,
            partnerId: '', // To be invited later
            status: 'active'
        });
        navigation.replace('InviteFriend');
    };

    const toggleDay = (day: string) => {
        if (frequency.includes(day)) {
            setFrequency(frequency.filter(d => d !== day));
        } else {
            setFrequency([...frequency, day]);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 0: // Intro
                return (
                    <View style={styles.stepContainer}>
                        <Text style={styles.title}>Let's Get Started</Text>
                        <Text style={styles.description}>
                            If you haven't created a goal yet, let's take some time to generate one now!
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={handleNext}>
                            <Text style={styles.buttonText}>Start</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.replace('Main')}>
                            <Text style={styles.skipButtonText}>Skip for Now (e.g. I just want to keep a friend accountable)</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 1: // Action
                return (
                    <View style={styles.stepContainer}>
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={() => setStep(step - 1)}>
                                <MaterialCommunityIcons name="chevron-left" size={30} color={COLORS.text} />
                            </TouchableOpacity>
                            <Text style={styles.stepTitle}>Action Input</Text>
                            <View style={{ width: 30 }} />
                        </View>
                        <Text style={styles.label}>This is the habit or activity you want to commit to:</Text>
                        <View style={styles.madLibContainer}>
                            <Text style={styles.madLibText}>I want to...</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="type here (e.g. workout for 47 minutes)"
                                placeholderTextColor={COLORS.secondary}
                                value={action}
                                onChangeText={setAction}
                                multiline
                                returnKeyType="done"
                                blurOnSubmit={true}
                                onSubmitEditing={() => Keyboard.dismiss()}
                            />
                        </View>
                        <TouchableOpacity style={styles.button} onPress={handleNext}>
                            <Text style={styles.buttonText}>Next {'>'}</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 2: // Frequency
                return (
                    <View style={styles.stepContainer}>
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={() => setStep(step - 1)}>
                                <MaterialCommunityIcons name="chevron-left" size={30} color={COLORS.text} />
                            </TouchableOpacity>
                            <Text style={styles.stepTitle}>Frequency Input</Text>
                            <View style={{ width: 30 }} />
                        </View>
                        <Text style={styles.label}>Choose a frequency that works best for you:</Text>
                        <View style={styles.daysContainer}>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                <TouchableOpacity
                                    key={day}
                                    style={styles.checkboxRow}
                                    onPress={() => toggleDay(day)}
                                >
                                    <MaterialCommunityIcons
                                        name={frequency.includes(day) ? "checkbox-marked" : "checkbox-blank-outline"}
                                        size={24}
                                        color={COLORS.text}
                                    />
                                    <Text style={styles.dayText}>{day}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.button} onPress={handleNext}>
                            <Text style={styles.buttonText}>Next {'>'}</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 3: // Motivation
                return (
                    <View style={styles.stepContainer}>
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={() => setStep(step - 1)}>
                                <MaterialCommunityIcons name="chevron-left" size={30} color={COLORS.text} />
                            </TouchableOpacity>
                            <Text style={styles.stepTitle}>Motivation Input</Text>
                            <View style={{ width: 30 }} />
                        </View>
                        <Text style={styles.label}>This helps your partner understand what matters to you:</Text>
                        <View style={styles.madLibContainer}>
                            <Text style={styles.madLibText}>so I can...</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="type here (e.g. lose 10 lbs)"
                                placeholderTextColor={COLORS.secondary}
                                value={motivation}
                                onChangeText={setMotivation}
                                multiline
                                returnKeyType="done"
                                blurOnSubmit={true}
                                onSubmitEditing={() => Keyboard.dismiss()}
                            />
                        </View>
                        <TouchableOpacity style={styles.button} onPress={handleNext}>
                            <Text style={styles.buttonText}>Next {'>'}</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 4: // Deadline
                return (
                    <View style={styles.stepContainer}>
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={() => setStep(step - 1)}>
                                <MaterialCommunityIcons name="chevron-left" size={30} color={COLORS.text} />
                            </TouchableOpacity>
                            <Text style={styles.stepTitle}>Deadline Input</Text>
                            <View style={{ width: 30 }} />
                        </View>
                        <Text style={styles.label}>This is optional. Give yourself a target date:</Text>

                        <View style={styles.calendarContainer}>
                            <Calendar
                                onDayPress={(day: any) => setDeadline(day.dateString)}
                                minDate={new Date().toISOString().split('T')[0]}
                                markedDates={{
                                    [deadline]: { selected: true, disableTouchEvent: true, selectedColor: COLORS.primary }
                                }}
                                theme={{
                                    backgroundColor: '#ffffff',
                                    calendarBackground: '#ffffff',
                                    textSectionTitleColor: '#b6c1cd',
                                    selectedDayBackgroundColor: COLORS.primary,
                                    selectedDayTextColor: '#ffffff',
                                    todayTextColor: COLORS.primary,
                                    dayTextColor: '#2d4150',
                                    textDisabledColor: '#d9e1e8',
                                    dotColor: '#00adf5',
                                    selectedDotColor: '#ffffff',
                                    arrowColor: COLORS.primary,
                                    monthTextColor: COLORS.text,
                                    indicatorColor: 'blue',
                                    textDayFontFamily: 'System',
                                    textMonthFontFamily: 'System',
                                    textDayHeaderFontFamily: 'System',
                                    textDayFontWeight: '300',
                                    textMonthFontWeight: 'bold',
                                    textDayHeaderFontWeight: '300',
                                    textDayFontSize: 16,
                                    textMonthFontSize: 16,
                                    textDayHeaderFontSize: 16
                                }}
                            />
                        </View>

                        <TouchableOpacity style={styles.skipCheckbox} onPress={() => setDeadline('')}>
                            <MaterialCommunityIcons
                                name={deadline === '' ? "checkbox-marked" : "checkbox-blank-outline"}
                                size={24}
                                color={COLORS.text}
                            />
                            <Text style={styles.skipCheckboxText}>Skip for now</Text>
                        </TouchableOpacity>

                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryText}>
                                I want to <Text style={styles.bold}>{action || '...'}</Text> every <Text style={styles.bold}>{frequency.length > 0 ? frequency.join(' and ') : '...'}</Text>, so I can <Text style={styles.bold}>{motivation || '...'}</Text>.
                            </Text>
                            <Text style={styles.summaryText}>
                                {deadline ? `by ${deadline}` : ''}
                            </Text>
                            <Text style={styles.summarySubtext}>
                                This is a great goal! Let's find you an accountability partner!
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleFinish}>
                            <Text style={styles.buttonText}>Next {'>'}</Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.progressBar}>
                {/* Simple progress bar */}
                <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                {renderStepContent()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    progressBar: {
        height: 5,
        backgroundColor: '#E0E0E0',
        width: '100%',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    content: {
        flexGrow: 1,
        padding: 20,
    },
    stepContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    description: {
        fontSize: 16,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    label: {
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    madLibContainer: {
        width: '100%',
        backgroundColor: COLORS.surface,
        padding: 20,
        borderRadius: 15,
        marginBottom: 30,
    },
    madLibText: {
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: COLORS.surface,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: COLORS.text,
        borderWidth: 1,
        borderColor: COLORS.secondary,
        width: '100%',
        marginBottom: 20,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginTop: 20,
    },
    buttonText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: 'bold',
    },
    skipButton: {
        marginTop: 20,
    },
    skipButtonText: {
        color: COLORS.text,
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    daysContainer: {
        width: '100%',
        backgroundColor: COLORS.surface,
        padding: 20,
        borderRadius: 15,
        marginBottom: 30,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    dayText: {
        marginLeft: 10,
        fontSize: 16,
        color: COLORS.text,
    },
    calendarContainer: {
        width: '100%',
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
    },
    skipCheckbox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: 15,
        borderRadius: 10,
        width: '100%',
        marginBottom: 20,
    },
    skipCheckboxText: {
        marginLeft: 10,
        color: COLORS.text,
        fontSize: 16,
    },
    summaryCard: {
        backgroundColor: COLORS.surface,
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        width: '100%',
    },
    summaryText: {
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 10,
    },
    summarySubtext: {
        fontSize: 14,
        color: COLORS.text,
        textAlign: 'center',
        marginTop: 10,
    },
    bold: {
        fontWeight: 'bold',
    },
});

export default GoalSetupScreen;
