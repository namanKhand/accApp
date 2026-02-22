# Setting Up Firebase for iOS Development

This guide outlines the steps needed to configure your React Native / Expo app with the native Firebase iOS SDK. While the app currently uses the Firebase JavaScript Web SDK (which works fine in Expo Go and web), if you decide to build a native iOS app (using `npx expo prebuild` or bare React Native), you will need to complete these steps to enable native features like Push Notifications.

## 1. Add iOS App to Firebase Console

1. Go to the [Firebase Console](https://console.firebase.google.com/project/accapp-bd7a0)
2. Click the **Project Overview** gear icon ⚙️ → **Project settings**
3. Scroll down to "Your apps" and click the **Add app** button
4. Select the **iOS** icon
5. Enter your **iOS bundle ID**. You can find or set this in your `app.json` under `ios.bundleIdentifier` (e.g., `com.yourname.accapp`).
6. (Optional) Enter the App nickname (e.g., "AccApp iOS") and App Store ID.
7. Click **Register app**

## 2. Download Configuration File

1. After registering, click **Download GoogleService-Info.plist**
2. Important: Move `GoogleService-Info.plist` into the root of your Expo project (the directory containing `app.json` and `package.json`).

## 3. Configure Expo

In your `app.json`, add the reference to the `GoogleService-Info.plist` file inside the `ios` configuration object:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourname.accapp",
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

## 4. Install Native Firebase Packages (If switching from Web SDK)

If you decide to switch entirely to the native Firebase SDK (`@react-native-firebase/*`) instead of the web SDK, you'll need to install the core package and any modules you use:

```bash
npx expo install @react-native-firebase/app
npx expo install @react-native-firebase/auth
npx expo install @react-native-firebase/firestore
npx expo install @react-native-firebase/storage
```

*Note: If you do this, you will have to rewrite your `src/services/firebase.ts` and update the imports in your services. The `@react-native-firebase` packages have slightly different APIs than the web SDK used currently.*

## 5. Build for iOS

Since you are adding custom native code (via the GoogleService-Info file or native firebase modules), you can no longer solely rely on the standard Expo Go app. You must build a custom development build.

```bash
# Install the expo-dev-client
npx expo install expo-dev-client

# Run on iOS simulator (this will trigger a native build)
npx expo run:ios
```

## Push Notifications Note

If you intend to implement Push Notifications (which requires the native SDK setup):
1. In the Apple Developer Portal, enable Push Notifications for your App ID.
2. Create an APNs Auth Key and upload it to the **Cloud Messaging** tab in Firebase Project Settings.
