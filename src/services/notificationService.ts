import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

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
            Alert.alert('Notifications', 'Push notification permission was not granted.');
            return null;
        }

        try {
            token = (await Notifications.getExpoPushTokenAsync()).data;
        } catch (e) {
            console.warn('Could not get push token:', e);
        }
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

export async function scheduleMissedCheckInNotification(goalTitle: string, delaySeconds: number = 60) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Don't forget your goal!",
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

export async function sendNudgeNotification(partnerName: string, goalTitle: string) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: `${partnerName} sent you a nudge!`,
            body: `They're checking on your progress for: ${goalTitle}`,
            data: { type: 'partner_nudge', partnerName, goalTitle },
            sound: true,
        },
        trigger: null,
    });
}

export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function cancelNotification(identifier: string) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
}

export async function scheduleDailyReminder(hour: number, minute: number, goalTitle: string) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Time to check in!',
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

export function addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
) {
    return Notifications.addNotificationResponseReceivedListener(callback);
}

export function addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
) {
    return Notifications.addNotificationReceivedListener(callback);
}
