# Xcode Deployment Transition Plan

## Overview
We are transitioning from the managed Expo Go development workflow to a bare/prebuilt native workflow in order to deploy to the iOS App Store via Xcode. Do not run `expo go` anymore.

## 1. Fix the Entry Point
Before building, ensure the app entry point is explicitly registered in `App.tsx` so the native binary knows where to start.
Add these two lines to the bottom of `App.tsx`:
```tsx
import { registerRootComponent } from 'expo';
registerRootComponent(App);
```

## 2. Generate Native Directories
Run the following command to generate the `ios` and `android` directories using Expo's Continuous Native Generation (CNG):
```bash
npx expo prebuild
```
This will read from `app.json` and create an Xcode workspace configured with the bundle identifier (`com.acc.2gether`).

## 3. Configure Xcode for App Store
1. Open `ios/do2gether.xcworkspace` in Xcode.
2. In Xcode > Preferences > Accounts, sign in with the Apple Developer Account.
3. Click the root project folder (`do2gether`) in the left navigator.
4. Go to the **Signing & Capabilities** tab.
5. Check "Automatically manage signing" and select your Team.

## 4. Build and Archive
1. At the top of Xcode, change the destination/device simulator target to **Any iOS Device (arm64)**.
2. In the top OS menu bar, click **Product > Archive**.
3. Wait for the compilation to finish.

## 5. Submit to App Store Connect
1. When the Archive completes, the Xcode Organizer window will appear.
2. Click the blue **Distribute App** button on the right side.
3. Follow the sequence of prompts to upload the binary to App Store Connect/TestFlight.
