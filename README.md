# One-Liner: Social Accountability App

A social habit-building platform that helps people stay consistent with their personal goals by involving accountability partners. Users set structured goals, check in daily with photo proof, build streaks, and rely on partners to nudge them when they miss a check-in.

## Repo Contents
- `docs/` — product vision, feature scope, architecture, plans, and flows.
- `src/` — React Native (Expo) source for the mobile app.
- `assets/` — placeholder assets (replace with your exported icons and splash art).

## Running the app
1. Install dependencies (Node 18+ recommended):
   ```bash
   npm install
   ```
2. Start the Expo dev server:
   ```bash
   npm start
   ```
3. Launch on a device or simulator from the Expo CLI output.

## Firebase configuration
Set your Firebase credentials in `src/services/firebase.ts`. The current build uses mock in-memory services for auth, goals, check-ins, and nudges so you can explore the UI without a backend. Replace the mock services with Firebase SDK calls once your project is configured.

## Included flows
- Onboarding
- Phone login (mocked) and profile context
- Goal creation
- Partner invite placeholder
- Home dashboard with streak progress and nudge shortcuts
- Check-in with photo upload (local picker)
- Streak calendar visualization
- Nudge inbox and reminder sender
- Profile screen with sign-out

See the `docs/` folder for detailed plans and specifications.
