// Fix: Export the 'getDateString' function so it can be imported by other modules.
export const getDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Calculates habit statistics: consecutive day streak and current week completions.
 * If the habit is not completed today, it calculates the streak ending yesterday.
 * @param habitId The ID of the habit.
 * @param history A record of completed habit IDs by date.
 * @returns An object with streak and weekCompletions count.
 */
export const calculateStreak = (habitId: string, history: Record<string, string[]>): { streak: number; weekCompletions: number } => {
    // --- Streak Calculation ---
    let streak = 0;
    const streakDate = new Date();
    const todayStr = getDateString(streakDate);

    // If the habit is not completed today, start checking from yesterday.
    if (!history[todayStr]?.includes(habitId)) {
        streakDate.setDate(streakDate.getDate() - 1);
    }
    
    // Loop backwards from the starting date (today or yesterday)
    while (true) {
        const dateStr = getDateString(streakDate);
        if (history[dateStr]?.includes(habitId)) {
            streak++;
            streakDate.setDate(streakDate.getDate() - 1);
        } else {
            // The streak is broken, stop counting.
            break;
        }
    }

    // --- Week Completions Calculation ---
    let weekCompletions = 0;
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, etc.
    
    // Iterate from Sunday (start of the week) to today
    for (let i = 0; i <= dayOfWeek; i++) {
        const date = new Date();
        date.setDate(today.getDate() - (dayOfWeek - i));
        const dateStr = getDateString(date);

        if (history[dateStr]?.includes(habitId)) {
            weekCompletions++;
        }
    }
    
    return { streak, weekCompletions };
};
