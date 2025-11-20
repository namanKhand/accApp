# Project Plan

## Phase 0: Planning & Technical Foundation
- Finalize MVP scope (goal creation, photo check-ins, partner system, nudges, streaks).
- Draft product vision and feature list for collaborators.
- Select stack (React Native + Firebase) and libraries.
- Initialize repo and CI; add linting/prettier and commit hooks.
- Configure Firebase project and environment management.

## Phase 1: UI/UX Design
- Design key screens: onboarding slides, phone login/OTP, goal setup (mad-lib), partner invite, home, check-in (camera/gallery), streak viewer, nudges, profile/settings.
- Create design system: color palette (fall-inspired), typography, buttons, cards, alerts/toasts.
- Export assets (icons, background illustrations, logo, app icon) and handoff specs.

## Phase 2: MVP Front-End Development
- Set up navigation shell and context providers.
- Implement auth flow with Firebase phone OTP.
- Build goal setup flow with live preview and reminders.
- Implement partner invite/accept flows and partner status UI.
- Add daily check-in with camera/gallery upload, upload to Storage, metadata to Firestore.
- Build streak visualization (bar + calendar) and logic client-side.
- Add nudging actions and push notification hooks.
- Implement profile/settings and notification preferences.

## Phase 3: Testing & QA
- Unit tests for streak logic, reminder scheduling, and form validation.
- Integration tests for auth + goal creation + check-in happy path.
- Device testing on iOS; verify photo permissions and push notifications.
- Fix defects and polish UX copy.

## Phase 4: iOS Deployment
- Configure App Store assets and privacy strings.
- Set up TestFlight builds; capture release notes.
- Submit to App Store after beta feedback.

## Phase 5: V2 & Android Expansion
- Android support and device/performance validation.
- Ship messaging, analytics, group goals, and templates.
- Add web dashboard if needed.

## Milestones & Owners (example)
- Product/Design: finalize MVP specs and Figma by end of Phase 1.
- Engineering: functional MVP (auth, goals, check-ins, streaks, nudges) by end of Phase 2.
- QA: regression checklist ready before Phase 3.
- Release: TestFlight build + metrics instrumentation before Phase 4 submission.
