import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Keyboard, ActivityIndicator, Alert } from 'react-native';
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
    const { user, goals, sendInvite } = useApp();
    const [step, setStep] = useState(0);
    const [friendName, setFriendName] = useState('');
    const [friendEmail, setFriendEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const currentGoal = goals[goals.length - 1]; // Assuming the last created goal is the current one

    const handleSend = async () => {
        if (!user || !currentGoal) return;

        setLoading(true);
        try {
            await sendInvite({
                senderId: user.id,
                senderName: user.displayName || 'Your Friend',
                recipientEmail: friendEmail.trim(),
                goalId: currentGoal.id,
            });
            // The RootNavigator will automatically detect we have a sent invite and redirect us to WaitingForPartner
        } catch (error) {
            console.error('Error sending invite:', error);
            Alert.alert('Error', 'Failed to send invite. Please try again.');
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (step === 0) {
            return (
                <View style={styles.content}>
                    <Text style={styles.title}>Invite a Partner</Text>

                    <Text style={styles.description}>
                        You need an accountability partner to use this app. Enter their details below to send them an invite.
                    </Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Partner's Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="First Name"
                            placeholderTextColor={COLORS.secondary}
                            value={friendName}
                            onChangeText={setFriendName}
                            returnKeyType="done"
                            blurOnSubmit={true}
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Partner's Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="email@example.com"
                            placeholderTextColor={COLORS.secondary}
                            value={friendEmail}
                            onChangeText={setFriendEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            returnKeyType="done"
                            blurOnSubmit={true}
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />
                        <Text style={styles.helperText}>
                            They must sign up using this exact email address to link to your goal.
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, (!friendName.trim() || !friendEmail.trim()) && styles.disabledButton]}
                        onPress={() => setStep(1)}
                        disabled={!friendName.trim() || !friendEmail.trim()}
                    >
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
                        <Text style={styles.title}>Confirm Invite</Text>
                        <View style={{ width: 30 }} />
                    </View>

                    <Text style={styles.label}>Here's the goal details we will share with {friendName}:</Text>

                    <View style={styles.previewCard}>
                        <Text style={styles.previewText}>
                            Hi <Text style={styles.bold}>{friendName || 'Friend'}</Text>,
                            {'\n\n'}
                            Studies show that accountability can increase the likelihood of achieving your goals to as high as 95%!
                            {'\n\n'}
                            I recently created a goal and want you to keep me accountable: <Text style={styles.bold}>{currentGoal?.title || 'I want to...'}</Text>
                            {'\n\n'}
                            Please download the 2gether app and sign up with: <Text style={styles.bold}>{friendEmail}</Text> to join me.
                            {'\n\n'}
                            Your friend,
                            {'\n'}
                            <Text style={styles.bold}>{user?.displayName || 'Me'}</Text>
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.sendButton, loading && styles.disabledButton]}
                        onPress={handleSend}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.surface} />
                        ) : (
                            <Text style={styles.buttonText}>Send Invite!</Text>
                        )}
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
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: COLORS.secondary,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 25,
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
    helperText: {
        fontSize: 12,
        color: COLORS.secondary,
        marginTop: 8,
        fontStyle: 'italic',
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginTop: 20,
    },
    sendButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 10,
        marginTop: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    disabledButton: {
        opacity: 0.5,
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
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    previewText: {
        fontSize: 15,
        color: COLORS.text,
        lineHeight: 22,
    },
    bold: {
        fontWeight: 'bold',
    },
});

export default InviteFriendScreen;
