import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Linking, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const ContactUsScreen = () => {
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSend = async () => {
        if (!name || !email || !message) {
            Alert.alert('Missing Information', 'Please fill in all fields.');
            return;
        }
        const subject = `Contact Us - ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        const mailtoUrl = `mailto:Skim@2seans.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        try {
            if (await Linking.canOpenURL(mailtoUrl)) {
                await Linking.openURL(mailtoUrl);
            } else {
                Alert.alert('Error', 'No email client available.');
            }
        } catch {
            Alert.alert('Error', 'Could not open email client.');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFillObject} />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.description}>
                    Have questions or feedback? Send us a message and we'll get back to you as soon as possible.
                </Text>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input} placeholder="Your Name"
                        placeholderTextColor={colors.placeholder}
                        value={name} onChangeText={setName}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input} placeholder="Your Email"
                        placeholderTextColor={colors.placeholder}
                        value={email} onChangeText={setEmail}
                        keyboardType="email-address" autoCapitalize="none"
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="How can we help?"
                        placeholderTextColor={colors.placeholder}
                        value={message} onChangeText={setMessage}
                        multiline numberOfLines={5} textAlignVertical="top"
                    />
                </View>
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendButtonText}>Send Message</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const makeStyles = (colors: ReturnType<typeof import('../context/ThemeContext').useTheme>['colors']) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        content: { padding: 20 },
        description: { fontSize: 16, color: colors.text, marginBottom: 30, lineHeight: 22 },
        inputGroup: { marginBottom: 20 },
        label: { fontSize: 14, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
        input: {
            backgroundColor: colors.inputBackground, borderRadius: 10, padding: 15,
            fontSize: 16, color: colors.text, borderWidth: 1, borderColor: colors.glassBorder,
        },
        textArea: { height: 120 },
        sendButton: { backgroundColor: colors.primary, paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
        sendButtonText: { color: colors.surface, fontSize: 16, fontWeight: 'bold' },
    });

export default ContactUsScreen;
