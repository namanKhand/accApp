# Data Models (Draft)

## User
- `id`
- `phone`
- `name`
- `photoUrl`
- `timezone`
- `notificationPreferences`: { push: boolean, sms: boolean }
- `partnerIds`: string[]

## Goal
- `id`
- `ownerId`
- `title`
- `description`
- `cadence`: daily | weekly | custom
- `startDate`
- `endDate`
- `reminderTimes`: string[] (HH:mm with timezone)
- `partnerId`
- `status`: active | paused | completed | cancelled
- `streak`: { current: number, longest: number, lastCheckInDate: string }
- `visibility`: private | sharedWithPartner

## CheckIn
- `id`
- `goalId`
- `userId`
- `photoUrl`
- `note`
- `createdAt`
- `status`: on-time | late | missed (override)

## Invite
- `id`
- `inviterId`
- `goalId`
- `inviteeContact`
- `deliveryChannel`: sms | push
- `status`: pending | accepted | declined | expired
- `expiresAt`

## Nudge
- `id`
- `senderId`
- `recipientId`
- `goalId`
- `type`: reminder | encouragement
- `message`
- `createdAt`
