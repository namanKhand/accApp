import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../constants/colors';
import { RootStackParamList } from '../navigation/RootNavigator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'InviteFriend'>;

const InviteFriendScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { user, goals } = useApp();
    const [step, setStep] = useState(0);
    const [friendName, setFriendName] = useState('');
    const [friendEmail, setFriendEmail] = useState('');

    const currentGoal = goals[goals.length - 1]; // Assuming the last created goal is the current one

    const handleSend = () => {
        // Simulate sending invite
        navigation.replace('Main');
    };

    const renderContent = () => {
        if (step === 0) {
            return (
                <View style={styles.content}>
                    <Text style={styles.title}>Invite a Friend</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Friend's Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="First Name Last Name"
                            placeholderTextColor={COLORS.secondary}
                            value={friendName}
                            onChangeText={setFriendName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Friend's Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="email@example.com"
                            placeholderTextColor={COLORS.secondary}
                            value={friendEmail}
                            onChangeText={setFriendEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={() => setStep(1)}>
                        <Text style={styles.buttonText}>Next {'>'}</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={styles.content}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity onPress={() => setStep(0)}>
                            <MaterialCommunityIcons name="chevron-left" size={30} color={COLORS.text} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Send Invitation</Text>
                        <View style={{ width: 30 }} />
                    </View>

                    <Text style={styles.label}>Here's what we plan on sending:</Text>

                    <View style={styles.previewCard}>
                        <Text style={styles.previewText}>
                            Hi <Text style={styles.bold}>{friendName || 'Friend'}</Text>,
                            {'\n\n'}
                            Studies show that accountability can increase the likelihood of achieving your goals to as high as 95%!
                            {'\n\n'}
                            I recently created a goal and want you to keep me accountable: {currentGoal?.title || 'I want to...'}
                            {'\n\n'}
                            Help me on: <Text style={styles.bold}>2gether App Download Link.</Text>
                            {'\n\n'}
                            Your friend,
                            {'\n'}
                            <Text style={styles.bold}>{user?.displayName || 'Me'}</Text>
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSend}>
                        <Text style={styles.buttonText}>Send!</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {renderContent()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        width: '100%',
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
        marginBottom: 30,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 8,
        fontWeight: '500',
        alignSelf: 'flex-start',
    },
    input: {
        backgroundColor: COLORS.surface,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: COLORS.text,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
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
    previewCard: {
        backgroundColor: COLORS.surface,
        padding: 20,
        borderRadius: 15,
        width: '100%',
        marginBottom: 20,
    },
    previewText: {
        fontSize: 14,
        color: COLORS.text,
        lineHeight: 20,
    },
    bold: {
        fontWeight: 'bold',
    },
});

export default InviteFriendScreen;
