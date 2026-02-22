# do2gether: App Summary & Store Readiness Report

## 1. App Summary
**do2gether** is a social habit-building (accountability) application built with React Native and Expo. It transforms habit tracking from a solitary activity into a shared commitment between a user and an accountability partner.

### Core Capabilities
- **Goal Management**: Users can create structured goals with specific frequencies and deadlines.
- **Proof-Based Check-ins**: Daily check-ins require photo proof, ensuring "proof beats promises."
- **Social Accountability**: Users invite a partner (friend/colleague) who acts as a "co-pilot," receiving nudges and monitoring progress.
- **Streak Visualization**: A visual streak bar and calendar help users maintain consistency.
- **Nudge System**: Partners can trigger reminders if a user misses a check-in, creating a social pressure loop.

---

## 2. Certificates, Identifiers & Profiles (App Store Requirements)

To successfully submit do2gether to the Apple App Store (and Google Play Store), several technical assets must be configured in the Apple Developer Portal.

### Identifiers
- **App ID (Bundle Identifier)**: A unique string (e.g., `com.acc.2gether`) that identifies the app globally. 
  - *Current Status*: Updated in `app.json` as `com.acc.2gether`.
- **Services IDs**: Required for features like **Sign-in with Apple** (if implemented) or backend integrations.
- **Push Notification Key**: Essential for the "Nudge" feature to work on real devices.

### Certificates
- **Distribution Certificate**: Required to sign the app for submission to TestFlight or the App Store.
- **Development Certificate**: Used by the team during local testing on physical devices.
- **Push Notification Certificate/Key**: Allows your server (Firebase) to send nudges to the Apple Push Notification service (APNs).

### Profiles (Provisioning Profiles)
- These "bridge" the Certificates and Identifiers. They tell Apple that *this* specific app signed with *this* certificate is allowed to run on *these* devices (or any device for App Store distribution).

---

## 3. Play Store Requirements (Android)
While Apple uses the term "Profiles," Android uses:
- **Package Name**: Same role as Bundle ID (e.g., `com.acc.2gether`).
- **Upload Key/Keystore**: A digital signature used to sign the Android App Bundle (.aab).
- **Service Account Key**: Required if you want to automate deployments via CI/CD.

---

## 4. Submission Roadmap

| Phase | Milestone | Action Items |
| :--- | :--- | :--- |
| **I. Setup** | Accounts | Enroll in Apple Developer Program ($99/yr) & Google Play Console ($25 one-time). |
| **II. Branding** | Assets | Replace placeholder `icon.png` and `splash.png`. Generate App Store screenshots. |
| **III. Legal** | Compliance | Draft a **Privacy Policy** (required for all apps) and **Terms of Service**. |
| **IV. Integration** | Backend | Replace mock services with live **Firebase** instances for Auth, DB, and Storage. |
| **V. Verification** | Testing | Distribute via **TestFlight** (iOS) and **Internal Testing** (Android) to real users. |

> [!IMPORTANT]
> Since do2gether is a social app with user-generated content (photo proof), Apple requires a clear mechanism to **report/block abusive users** and a commitment to removing offensive content within 24 hours.
