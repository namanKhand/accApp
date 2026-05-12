import { CheckIn } from '../types';

function uniqueDateStrings(checkIns: CheckIn[]): string[] {
    const seen = new Set<string>();
    for (const ci of checkIns) {
        seen.add(ci.date.split('T')[0]);
    }
    return Array.from(seen);
}

export const calculateCurrentStreak = (checkIns: CheckIn[]): number => {
    if (checkIns.length === 0) return 0;

    const dates = uniqueDateStrings(checkIns).sort((a, b) => b.localeCompare(a));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mostRecent = new Date(dates[0] + 'T00:00:00');
    const daysDiff = Math.floor((today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff > 1) return 0;

    let streak = 0;
    let current = new Date(mostRecent);

    for (const dateStr of dates) {
        const d = new Date(dateStr + 'T00:00:00');
        if (d.getTime() === current.getTime()) {
            streak++;
            current.setDate(current.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
};

export const calculateLongestStreak = (checkIns: CheckIn[]): number => {
    if (checkIns.length === 0) return 0;

    const dates = uniqueDateStrings(checkIns).sort((a, b) => a.localeCompare(b));

    let longest = 1;
    let current = 1;

    for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1] + 'T00:00:00');
        const curr = new Date(dates[i] + 'T00:00:00');
        const diff = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

        if (diff === 1) {
            current++;
            longest = Math.max(longest, current);
        } else if (diff > 1) {
            current = 1;
        }
    }

    return longest;
};

export const getStreakRuns = (checkIns: CheckIn[]): string[][] => {
    if (checkIns.length === 0) return [];

    const dates = uniqueDateStrings(checkIns).sort((a, b) => a.localeCompare(b));

    const runs: string[][] = [];
    let currentRun: string[] = [dates[0]];

    for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1] + 'T00:00:00');
        const curr = new Date(dates[i] + 'T00:00:00');
        const diff = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

        if (diff === 1) {
            currentRun.push(dates[i]);
        } else {
            runs.push([...currentRun]);
            currentRun = [dates[i]];
        }
    }
    runs.push(currentRun);

    return runs;
};
