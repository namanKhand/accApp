import { CheckIn } from '../types';

// Calculate current streak from check-ins
export const calculateCurrentStreak = (checkIns: CheckIn[]): number => {
    if (checkIns.length === 0) return 0;

    // Sort check-ins by date (most recent first)
    const sortedCheckIns = [...checkIns].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if there's a check-in today or yesterday
    const mostRecentDate = new Date(sortedCheckIns[0].date);
    mostRecentDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));

    // Streak is broken if last check-in was more than 1 day ago
    if (daysDiff > 1) return 0;

    // Count consecutive days
    let currentDate = new Date(mostRecentDate);

    for (let i = 0; i < sortedCheckIns.length; i++) {
        const checkInDate = new Date(sortedCheckIns[i].date);
        checkInDate.setHours(0, 0, 0, 0);

        if (checkInDate.getTime() === currentDate.getTime()) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (checkInDate.getTime() < currentDate.getTime()) {
            // Gap in streak
            break;
        }
    }

    return streak;
};

// Calculate longest streak from check-ins
export const calculateLongestStreak = (checkIns: CheckIn[]): number => {
    if (checkIns.length === 0) return 0;

    // Sort check-ins by date
    const sortedCheckIns = [...checkIns].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedCheckIns.length; i++) {
        const prevDate = new Date(sortedCheckIns[i - 1].date);
        const currDate = new Date(sortedCheckIns[i].date);

        prevDate.setHours(0, 0, 0, 0);
        currDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
            // Consecutive day
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
        } else if (daysDiff > 1) {
            // Gap in streak
            currentStreak = 1;
        }
        // If daysDiff === 0, it's the same day, don't increment
    }

    return longestStreak;
};

// Get streak runs for calendar highlighting
export const getStreakRuns = (checkIns: CheckIn[]): string[][] => {
    if (checkIns.length === 0) return [];

    // Sort check-ins by date
    const sortedCheckIns = [...checkIns].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const runs: string[][] = [];
    let currentRun: string[] = [sortedCheckIns[0].date.split('T')[0]];

    for (let i = 1; i < sortedCheckIns.length; i++) {
        const prevDate = new Date(sortedCheckIns[i - 1].date);
        const currDate = new Date(sortedCheckIns[i].date);

        prevDate.setHours(0, 0, 0, 0);
        currDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
            // Consecutive day
            currentRun.push(sortedCheckIns[i].date.split('T')[0]);
        } else if (daysDiff > 1) {
            // Gap - save current run and start new one
            if (currentRun.length > 1) {
                runs.push([...currentRun]);
            }
            currentRun = [sortedCheckIns[i].date.split('T')[0]];
        }
    }

    // Add the last run if it has multiple days
    if (currentRun.length > 1) {
        runs.push(currentRun);
    }

    return runs;
};
