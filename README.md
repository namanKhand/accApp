# do2gether

A social accountability app for building habits. You set a goal, check in every day with photo proof, and an accountability partner you invite sees your streak and nudges you when you miss a day. Built with React Native, Expo, and TypeScript.

## The idea

Habit trackers are easy to abandon because nobody notices when you stop. do2gether puts a real person on the other side of the streak: check-ins are visible to a partner, and a missed day triggers a nudge from that partner rather than another push notification from an app.

## Features

| Area | What it does |
| --- | --- |
| Onboarding | Guided first-run flow with profile setup |
| Accounts | Sign up, log in, password reset, and account recovery screens |
| Goals | Structured goal creation with cadence and target |
| Partners | Invite a partner by link, plus an accept-invite and waiting-for-partner flow |
| Check-ins | Daily check-in with a photo taken or picked from the device |
| Streaks | Home dashboard and a calendar view of streak history |
| Nudges | Inbox of nudges received and a sender for nudging a partner |
| Settings | Theme, profile, support contact, and sign-out |

## Architecture

One Expo React Native project written entirely in TypeScript.

| Layer | Location | Contents |
| --- | --- | --- |
| Screens | `src/screens` | Fourteen screens spanning onboarding, auth, goal setup, invites, home, friends, and settings |
| Components | `src/components` | Reusable UI including goal cards, check-in cards, the streak calendar, and the nudge button |
| Navigation | `src/navigation` | A root stack wrapping a bottom-tab navigator |
| State | `src/context` | Application state and theming through React context |
| Services | `src/services` | Auth, goals, check-ins, invites, notifications, and Firebase configuration |

Every data operation goes through a module in `src/services`, so the UI has no knowledge of the backend behind it. The current build ships in-memory mock services, which means the whole app is explorable with no backend running; switching to Firebase means changing those service files and nothing else.

## Status

The interface, navigation, and all flows listed above are working against the mock services. Firebase credentials belong in `src/services/firebase.ts`, and `docs/firebase_implementation_plan.md` sets out the migration from mocks to live data.

## Running it locally

Node 18 or newer is recommended. Install dependencies with `npm install`, start the Expo dev server with `npm start`, then open the app in Expo Go on a physical device or launch a simulator from the Expo CLI output. The icons and splash art in `assets` are placeholders.

## Documentation

The `docs` folder contains the product and engineering write-ups behind the build: product vision, feature scope, architecture, data models, user flows, UI screens, competitive analysis, and the project plan.

## Tech

React Native, Expo, TypeScript, React Navigation, React Context, ESLint, EAS Build, Firebase (planned).


## Team

Built by [@shreyakoli18](https://github.com/shreyakoli18), [@namanKhand](https://github.com/namanKhand), and [@Taran132g](https://github.com/Taran132g).
