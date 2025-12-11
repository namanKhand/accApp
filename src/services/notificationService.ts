import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// Request notification permissions and get push token
export async function registerForPushNotificationsAsync(): Promise<string | null> {
    let token = null;

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return null;
        }

        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Push token:', token);
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

// Schedule a local notification for missed check-in
export async function scheduleMissedCheckInNotification(goalTitle: string, delaySeconds: number = 60) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Don't forget your goal! 🎯",
            body: `Time to check in for: ${goalTitle}`,
            data: { type: 'missed_checkin', goalTitle },
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: delaySeconds,
        },
    });
}

// Send immediate nudge notification (simulated - in production would use push API)
export async function sendNudgeNotification(partnerName: string, goalTitle: string) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: `${partnerName} sent you a nudge! 👋`,
            body: `They're checking on your progress for: ${goalTitle}`,
            data: { type: 'partner_nudge', partnerName, goalTitle },
            sound: true,
        },
        trigger: null, // Send immediately
    });
}

// Cancel all scheduled notifications
export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

// Cancel specific notification by identifier
export async function cancelNotification(identifier: string) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
}

// Schedule daily reminder at specific time
export async function scheduleDailyReminder(hour: number, minute: number, goalTitle: string) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Time to check in! ⏰",
            body: `Don't forget: ${goalTitle}`,
            data: { type: 'daily_reminder', goalTitle },
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            hour,
            minute,
            repeats: true,
        },
    });
}

// Listen for notification responses (when user taps notification)
export function addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
) {
    return Notifications.addNotificationResponseReceivedListener(callback);
}

// Listen for notifications received while app is in foreground
export function addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
) {
    return Notifications.addNotificationReceivedListener(callback);
}
