const getDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

/**
 * Calculates the consecutive day streak for a habit.
 * If the habit is not completed today, it calculates the streak ending yesterday.
 * @param habitId The ID of the habit.
 * @param history A record of completed habit IDs by date.
 * @returns The number of consecutive days the habit was completed.
 */
export const calculateStreak = (habitId: string, history: Record<string, string[]>): number => {
    let streak = 0;
    const currentDate = new Date();
    const todayStr = getDateString(currentDate);

    // If the habit is not completed today, start checking from yesterday.
    if (!history[todayStr]?.includes(habitId)) {
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    // Loop backwards from the starting date (today or yesterday)
    while (true) {
        const dateStr = getDateString(currentDate);
        if (history[dateStr]?.includes(habitId)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            // The streak is broken, stop counting.
            break;
        }
    }
    return streak;
};
