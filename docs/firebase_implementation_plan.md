# Implementation Plan: Live Firebase Integration

## Goal Description
The objective is to replace the current mock services (in-memory data) with a live, production-ready Firebase backend. This will enable real user authentication, data persistence for goals and check-ins, and live push notifications for nudges.

## User Review Required
> [!IMPORTANT]
> This transition requires a **live Firebase Project**. You must create a project in the Firebase Console (https://console.firebase.google.com/) and provide the new `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) or the web configuration object.

## Proposed Changes

### [Component] Backend Services
I will update the following files to use the Firebase SDK instead of mock classes.

#### [MODIFY] [firebase.ts](file:///c:/Users/naman/accApp-2/src/services/firebase.ts)
- Replace placeholder credentials with the user-provided production config.
- Ensure `auth`, `db` (Firestore), and `storage` are correctly initialized.

#### [MODIFY] [authService.ts](file:///c:/Users/naman/accApp-2/src/services/authService.ts)
- Transition from mock login/signup to `firebase.auth().signInWithEmailAndPassword` and `createUserWithEmailAndPassword`.
- Implement `onAuthStateChanged` to handle persistent sessions.

#### [MODIFY] [goalService.ts](file:///c:/Users/naman/accApp-2/src/services/goalService.ts)
- Implement Firestore CRUD operations for goals.
- Link goals to the `userId` of the logged-in user.

#### [MODIFY] [notificationService.ts](file:///c:/Users/naman/accApp-2/src/services/notificationService.ts)
- Integrate backend-triggered push notifications via Firebase Cloud Functions (or a simpler client-side nudge trigger for MVP).

---

## Verification Plan

### Automated Tests
- Run `npm test` (if unit tests exist) to ensure no regressions in business logic.
- Verify `firebase.auth()` mocks in local environment if setup.

### Manual Verification
1. **User Sign-up**: Attempt to create a new account and verify the user appears in the Firebase Console Auth tab.
2. **Goal Creation**: Create a goal and verify a document is created in the `goals` collection in Firestore.
3. **Photo Upload**: Upload a check-in photo and verify the file appears in Firebase Storage.
4. **Partner Nudge**: Trigger a nudge from one account and verify the push notification arrives on a second device.
