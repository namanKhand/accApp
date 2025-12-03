import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SettingsScreen = () => {
    const { user, setUser } = useApp();
    const navigation = useNavigation<NavigationProp>();

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: () => {
                        setUser(null);
                        // Navigation will automatically handle this via RootNavigator logic
                    }
                }
            ]
        );
    };

    const SettingItem = ({ icon, title, onPress, value }: { icon: any, title: string, onPress?: () => void, value?: string }) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
            <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name={icon} size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.settingTitle}>{title}</Text>
            </View>
            <View style={styles.settingRight}>
                {value && <Text style={styles.settingValue}>{value}</Text>}
                {onPress && <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.secondary} />}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionHeader}>Account</Text>
                <View style={styles.section}>
                    <SettingItem
                        icon="account-circle-outline"
                        title="Name"
                        value={user?.displayName || 'User'}
                    />
                    <SettingItem
                        icon="email-outline"
                        title="Email"
                        value={user?.email || 'user@example.com'}
                    />
                </View>

                <Text style={styles.sectionHeader}>Preferences</Text>
                <View style={styles.section}>
                    <SettingItem
                        icon="bell-outline"
                        title="Notifications"
                        onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon!')}
                    />
                    <SettingItem
                        icon="theme-light-dark"
                        title="Appearance"
                        value="Light"
                        onPress={() => Alert.alert('Coming Soon', 'Dark mode is coming soon!')}
                    />
                </View>

                <Text style={styles.sectionHeader}>Support</Text>
                <View style={styles.section}>
                    <SettingItem
                        icon="help-circle-outline"
                        title="Help & Feedback"
                        onPress={() => navigation.navigate('ContactUs')}
                    />
                    <SettingItem
                        icon="information-outline"
                        title="About"
                        onPress={() => Alert.alert('About', '2gether App v1.0.0')}
                    />
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0</Text>
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
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: 20,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 10,
        textTransform: 'uppercase',
    },
    section: {
        backgroundColor: COLORS.surface,
        borderRadius: 15,
        marginBottom: 20,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 30,
        alignItems: 'center',
        marginRight: 10,
    },
    settingTitle: {
        fontSize: 16,
        color: COLORS.text,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValue: {
        fontSize: 14,
        color: COLORS.secondary,
        marginRight: 5,
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#FFE5E5',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    logoutText: {
        color: COLORS.error,
        fontWeight: 'bold',
        fontSize: 16,
    },
    versionText: {
        textAlign: 'center',
        color: COLORS.secondary,
        marginTop: 20,
        fontSize: 12,
    },
});

export default SettingsScreen;
