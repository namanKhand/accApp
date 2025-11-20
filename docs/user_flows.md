# User Flows

## Onboarding & Authentication
1. User opens app → onboarding slides (4-step intro to accountability concept).
2. Enter phone number → receive OTP → verify → create profile (name, photo optional, timezone).
3. Land on empty state prompting first goal creation.

## Goal Creation (Mad-lib Style)
1. Select template and fill: "I will [action] [frequency] until [date] so that [motivation]."
2. Choose accountability partner (select existing or invite new contact).
3. Set reminders and preferred check-in time.
4. Preview goal summary → confirm → goal created → invite sent.

## Partner Invite & Acceptance
1. Invite sent via SMS/link with partner responsibilities highlighted.
2. Partner taps link → accepts → creates/links account.
3. Partner sees shared goal card and nudge controls; user sees partner status as accepted.

## Daily Check-In
1. Home shows today’s goal status (pending/complete/missed) and streak bar.
2. User taps check-in → camera or gallery → attach photo + optional note.
3. Upload to Storage; Firestore records check-in + updates streak.
4. Success toast; partner notified of completion.

## Missed Check-In & Nudging
1. If user misses check-in by cutoff time, app flags goal as "needs nudge." 
2. Partner receives prompt to nudge via push/SMS; partner sends nudge message.
3. User receives nudge notification; quick action to open check-in screen.

## Streak & Progress View
1. User opens streak view; sees calendar with completed/missed days and current/longest streak.
2. Partner can view same data for accountability.

## Profile & Settings
1. Update name/photo/timezone.
2. Manage notification preferences and partner links.
3. Logout / delete account (future).
