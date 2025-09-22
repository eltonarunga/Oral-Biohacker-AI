

// Fix: Export the 'getDateString' function so it can be imported by other modules.
export const getDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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