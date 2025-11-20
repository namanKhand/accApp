# Technical Architecture

## Stack Choices
- **Mobile**: React Native (Expo optional; iOS first).
- **Auth**: Firebase Authentication (phone number + OTP).
- **Data**: Firebase Firestore for user profiles, goals, partners, check-ins, and streaks.
- **Storage**: Firebase Storage for photo uploads.
- **Notifications**: Firebase Cloud Messaging for push notifications; SMS via Twilio/FCM where applicable.
- **State**: React Context API initially; evaluate Zustand/Redux if complexity grows.

## High-Level Flows
1. **Onboarding & Auth**
   - Phone number entry → OTP verification → profile setup.
2. **Goal Setup**
   - Guided form (mad-lib style) to define goal, frequency, reminders, and partner invite.
3. **Partner Invite & Acceptance**
   - Send invite via SMS/link; partner accepts and becomes responsible for nudging.
4. **Daily Check-In**
   - Capture/upload photo → optional note → store in Firestore + Storage → update streak.
5. **Nudging**
   - Missed check-in triggers partner notification; partner can send a nudge (push/SMS).
6. **Streak Tracking**
   - Daily streak calculation stored per goal; reset on missed day; visualized in UI.

## Firestore Data Model (draft)
- `users/{userId}`
  - profile: name, phone, photo, timezone, notification preferences
  - partnerRefs: list of linked partner userIds
- `goals/{goalId}`
  - ownerId, title, description, cadence (daily/weekly/custom), startDate, endDate, reminderTimes, partnerId, status
  - streak: currentCount, longestCount, lastCheckInDate
  - visibility: private/sharedWithPartner
- `checkIns/{checkInId}`
  - goalId, userId, photoUrl, note, createdAt, status (on-time/late/missed override)
- `invites/{inviteId}`
  - inviterId, inviteeContact, goalId, status (pending/accepted/declined), expiresAt, deliveryChannel (sms/push)
- `nudges/{nudgeId}`
  - senderId, recipientId, goalId, type (reminder/encouragement), message, createdAt

## Storage Structure
- `checkins/{userId}/{goalId}/{date}.jpg`
- Thumbnails generated client-side or via Cloud Function.

## Security & Permissions (initial rules outline)
- Users can read/write their own profile.
- Users can read/write goals they own; partners get read access and write access to nudges.
- Check-ins readable by goal owner and partner; write only by owner.
- Invites readable/writeable by inviter; limited read for invitee via token.

## Cloud Functions (future)
- Enforce streak updates and resets on schedule.
- Send reminders for upcoming/missed check-ins.
- Handle invite token verification and partner linking.
- Generate thumbnails and clean up storage on goal deletion.

## Dependencies (planned)
- `react-native-firebase` modules for Auth, Firestore, Storage, Messaging.
- `react-navigation` for screen routing.
- `react-hook-form` for goal setup.
- `expo-image-picker` / native camera modules for photo capture.
- `dayjs` for timezone-aware date handling.
