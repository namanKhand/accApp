import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Keyboard, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import emailjs from '@emailjs/react-native';
import { COLORS } from '../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

// ── EmailJS config ──────────────────────────────────────────────────────────
// Sign up at emailjs.com → add a Gmail service → create a template → paste IDs below
const EMAILJS_SERVICE_ID  = 'service_vwak5gi';
const EMAILJS_TEMPLATE_ID = 'template_4j2272a';
const EMAILJS_PUBLIC_KEY  = 'IVGtOgXEO_-HeKb7C';
// ────────────────────────────────────────────────────────────────────────────

const InviteFriendScreen = () => {
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
            // 1. Save invite to Firestore — this also updates sentInvites state
            // immediately so RootNavigator navigates to WaitingForPartner right away.
            await sendInvite({
                senderId: user.id,
                senderName: user.displayName || 'Your Friend',
                recipientEmail: friendEmail.trim(),
                goalId: currentGoal.id,
            });

            // 2. Fire-and-forget: send the email — don't block navigation on it.
            emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    to_name:      friendName,
                    to_email:     friendEmail.trim(),
                    from_name:    user.displayName || 'Your Friend',
                    goal_title:   currentGoal.title,
                    signup_email: friendEmail.trim(),
                },
                { publicKey: EMAILJS_PUBLIC_KEY },
            ).then(result => {
                console.log('[EmailJS] send result:', result.status, result.text);
            }).catch((error: any) => {
                console.error('[EmailJS] send failed — status:', error?.status, '| text:', error?.text, '| message:', error?.message);
                Alert.alert(
                    'Invite Saved',
                    `Your invite was saved but the email could not be sent (${error?.text || error?.message || 'unknown error'}). Ask your partner to sign up with: ${friendEmail.trim()}`,
                );
            });

            // RootNavigator detects sentInvites.length > 0 and switches to WaitingForPartner.
            // setLoading(false) intentionally omitted — component unmounts on navigation.
        } catch (error: any) {
            console.error('[sendInvite] failed:', error?.code, error?.message);
            Alert.alert('Error', `Could not save your invite: ${error?.message || 'unknown error'}. Please try again.`);
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
                            submitBehavior="blurAndSubmit"
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
                            submitBehavior="blurAndSubmit"
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
            <LinearGradient colors={COLORS.backgroundGradient} style={StyleSheet.absoluteFillObject} />
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
        backgroundColor: COLORS.glassBgStrong,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COLORS.glassBorderStrong,
        padding: 15,
        fontSize: 16,
        color: COLORS.text,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
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
        paddingVertical: 13,
        paddingHorizontal: 40,
        borderRadius: 14,
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.38)',
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 5,
    },
    sendButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 14,
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.38)',
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.38,
        shadowRadius: 10,
        elevation: 5,
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
        backgroundColor: COLORS.glassBg,
        borderWidth: 1.5,
        borderColor: COLORS.glassBorder,
        padding: 22,
        borderRadius: 20,
        width: '100%',
        marginBottom: 28,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.14,
        shadowRadius: 20,
        elevation: 5,
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
