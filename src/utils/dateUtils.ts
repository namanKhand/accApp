// Calculate countdown to a deadline
export const getCountdown = (endDate: string | undefined): string | null => {
    if (!endDate) return null;

    const now = new Date();
    const deadline = new Date(endDate);
    const diffMs = deadline.getTime() - now.getTime();

    if (diffMs < 0) return 'Overdue';

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMonths > 0) {
        return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} left`;
    } else if (diffDays > 0) {
        return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} left`;
    } else if (diffHours > 0) {
        return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} left`;
    } else {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} left`;
    }
};

// Get today's date in YYYY-MM-DD format
export const getTodayString = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

// Check if a date is in the past
export const isPastDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
};
