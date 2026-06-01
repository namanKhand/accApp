# App Store Submission Guide — do2gether

Follow these steps exactly to build and submit the app to App Store Connect.

---

## Before You Start

You will need:
- **Xcode** (latest version recommended, Xcode 15+)
- **Your paid Apple Developer account** signed in to Xcode (Apple ID → Accounts in Xcode preferences)
- **`GoogleService-Info.plist`** — get this file from Shreya/Naman and place it at:
  ```
  ios/do2gether/GoogleService-Info.plist
  ```
  The build will fail without it.

---

## Step 1 — Pull the Latest Code

```bash
git clone https://github.com/namanKhand/accApp.git
cd accApp
npm install
cd ios && pod install && cd ..
```

If you already have the repo cloned:
```bash
git pull origin main
npm install
cd ios && pod install && cd ..
```

---

## Step 2 — Place the Firebase Config File

Copy `GoogleService-Info.plist` (get from Shreya/Naman) into:
```
ios/do2gether/GoogleService-Info.plist
```

---

## Step 3 — Open in Xcode

```bash
open ios/do2gether.xcworkspace
```

> **Important:** Always open the `.xcworkspace` file, not `.xcodeproj`.

---

## Step 4 — Fix the Signing Team

1. In Xcode, click the **do2gether** project in the left panel (the blue icon at the very top)
2. Select the **do2gether** target
3. Go to the **Signing & Capabilities** tab
4. Check **"Automatically manage signing"** if it isn't already checked
5. Under **Team**, change from `Naman Khandelwal (Personal Team)` to **your paid Apple Developer team**
6. Xcode will auto-create the right provisioning profiles — any red signing errors should clear

---

## Step 5 — Register the App ID on App Store Connect (first time only)

If `com.acc.2gether` isn't already registered under your team:
1. Go to [developer.apple.com/account](https://developer.apple.com/account) → Identifiers
2. Click **+** → App IDs → App
3. Description: `do2gether`
4. Bundle ID (Explicit): `com.acc.2gether`
5. Enable: **Sign In with Apple**, **Push Notifications**
6. Register

Then in [appstoreconnect.apple.com](https://appstoreconnect.apple.com):
1. My Apps → **+** → New App
2. Platform: iOS, Name: `do2gether`, Bundle ID: `com.acc.2gether`, SKU: `do2gether`

---

## Step 6 — Set the Scheme to Release

In Xcode toolbar:
1. Click the scheme selector (next to the play/stop buttons)
2. Select the **do2gether** scheme
3. Then click the device selector and choose **"Any iOS Device (arm64)"** — not a simulator

---

## Step 7 — Archive the Build

1. In Xcode menu: **Product → Archive**
2. Wait for the build to complete (can take 5–15 minutes)
3. The **Organizer** window will open automatically when done

---

## Step 8 — Distribute to App Store Connect

In the Organizer window:
1. Select the archive you just created
2. Click **Distribute App**
3. Choose **App Store Connect** → Next
4. Choose **Upload** → Next
5. Leave all options checked (include bitcode, upload symbols) → Next
6. Let Xcode automatically manage signing → Next
7. Review the summary → **Upload**

Wait for the upload to finish (a few minutes).

---

## Step 9 — Submit on App Store Connect

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Open **do2gether** → **TestFlight** tab
3. Wait for the build to finish processing (usually 5–30 minutes; Apple will email you)
4. Once processed, go to the **App Store** tab → your version
5. Under **Build**, click the **+** and select your uploaded build
6. Fill in:
   - **What's New in This Version** (brief feature summary)
   - **Review Notes** (explain the app to the reviewer; include a demo account if needed)
7. Click **Add for Review** → **Submit to App Review**

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| "Personal teams don't support Sign In with Apple" | You're still on Naman's personal team — change team in Signing & Capabilities (Step 4) |
| "No signing certificate" | Make sure your Apple ID is added in Xcode → Preferences → Accounts and "Automatically manage signing" is on |
| Firebase build error | `GoogleService-Info.plist` is missing — see Step 2 |
| Pod install fails | Run `sudo gem install cocoapods` then retry |
| Archive greyed out | Device target must be "Any iOS Device", not a simulator (Step 6) |

---

## App Details

| Field | Value |
|-------|-------|
| App name | do2gether |
| Bundle ID | com.acc.2gether |
| Version | 1.0.0 |
| Min iOS | 15.1 |
| Capabilities | Camera, Microphone, Photo Library, Sign In with Apple, Push Notifications |
