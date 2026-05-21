import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { useTheme, ThemeMode, THEME_LABELS } from '../context/ThemeContext';
import { authService } from '../services/authService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const THEME_ICONS: Record<ThemeMode, string> = {
    'light':        'white-balance-sunny',
    'warm-night':   'weather-night',
    'midnight':     'moon-waning-crescent',
    'deep-purple':  'star-four-points',
};

const SettingsScreen = () => {
    const { user } = useApp();
    const { mode, setMode, colors } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const styles = useMemo(() => makeStyles(colors), [colors]);

    const handleLogout = () => {
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log Out', style: 'destructive', onPress: () => authService.signOut() },
        ]);
    };

    const SettingItem = ({ icon, title, onPress, value }: {
        icon: string; title: string; onPress?: () => void; value?: string;
    }) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
            <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name={icon as any} size={24} color={colors.primary} />
                </View>
                <Text style={styles.settingTitle}>{title}</Text>
            </View>
            <View style={styles.settingRight}>
                {value ? <Text style={styles.settingValue}>{value}</Text> : null}
                {onPress ? <MaterialCommunityIcons name="chevron-right" size={24} color={colors.secondary} /> : null}
            </View>
        </TouchableOpacity>
    );

    const ThemePicker = () => (
        <View style={styles.themePickerContainer}>
            <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="palette-outline" size={24} color={colors.primary} />
                </View>
                <Text style={styles.settingTitle}>Theme</Text>
            </View>
            <View style={styles.themeOptions}>
                {(['light', 'warm-night', 'midnight', 'deep-purple'] as ThemeMode[]).map(m => (
                    <TouchableOpacity
                        key={m}
                        style={[styles.themeChip, mode === m && styles.themeChipActive]}
                        onPress={() => setMode(m)}
                    >
                        <MaterialCommunityIcons
                            name={THEME_ICONS[m] as any}
                            size={14}
                            color={mode === m ? colors.surface : colors.secondary}
                        />
                        <Text style={[styles.themeChipText, mode === m && styles.themeChipTextActive]}>
                            {THEME_LABELS[m]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={colors.backgroundGradient} style={StyleSheet.absoluteFillObject} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionHeader}>Account</Text>
                <View style={styles.section}>
                    <SettingItem icon="account-circle-outline" title="Name" value={user?.displayName || 'User'} />
                    <SettingItem icon="email-outline" title="Email" value={user?.email || 'user@example.com'} />
                </View>

                <Text style={styles.sectionHeader}>Preferences</Text>
                <View style={styles.section}>
                    <SettingItem
                        icon="bell-outline"
                        title="Notifications"
                        onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon!')}
                    />
                    <ThemePicker />
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

const makeStyles = (colors: ReturnType<typeof import('../context/ThemeContext').useTheme>['colors']) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        header: {
            padding: 20, alignItems: 'center', borderBottomWidth: 1,
            borderBottomColor: colors.glassBorder,
        },
        headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, letterSpacing: 0.3 },
        content: { padding: 20 },
        sectionHeader: {
            fontSize: 12, fontWeight: 'bold', color: colors.secondary,
            marginBottom: 8, marginTop: 10, marginLeft: 4,
            textTransform: 'uppercase', letterSpacing: 1,
        },
        section: {
            backgroundColor: colors.glassBg,
            borderWidth: 1.5, borderColor: colors.glassBorder,
            borderRadius: 20, marginBottom: 20, overflow: 'hidden',
            shadowColor: colors.primaryDark, shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12, shadowRadius: 16, elevation: 4,
        },
        settingItem: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            padding: 16, borderBottomWidth: 1, borderBottomColor: colors.glassBorder,
        },
        settingLeft: { flexDirection: 'row', alignItems: 'center' },
        iconContainer: { width: 30, alignItems: 'center', marginRight: 10 },
        settingTitle: { fontSize: 16, color: colors.text },
        settingRight: { flexDirection: 'row', alignItems: 'center' },
        settingValue: { fontSize: 14, color: colors.secondary, marginRight: 5 },

        // Theme picker
        themePickerContainer: {
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.glassBorder,
        },
        themeOptions: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginTop: 14,
            marginLeft: 40,
        },
        themeChip: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            paddingHorizontal: 12,
            paddingVertical: 7,
            borderRadius: 20,
            borderWidth: 1.5,
            borderColor: colors.glassBorder,
            backgroundColor: colors.glassBg,
        },
        themeChipActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        themeChipText: { fontSize: 12, fontWeight: '600', color: colors.secondary },
        themeChipTextActive: { color: colors.surface },

        logoutButton: {
            marginTop: 20,
            backgroundColor: 'rgba(176,0,32,0.08)',
            borderWidth: 1.5,
            borderColor: 'rgba(176,0,32,0.18)',
            padding: 15,
            borderRadius: 16,
            alignItems: 'center',
        },
        logoutText: { color: colors.error, fontWeight: 'bold', fontSize: 16 },
        versionText: { textAlign: 'center', color: colors.secondary, marginTop: 20, fontSize: 12 },
    });

export default SettingsScreen;
