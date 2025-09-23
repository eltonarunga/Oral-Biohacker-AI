import React from 'react';
import { calculateStreak } from '../utils/habits';

interface HabitTrackerProps {
    habitId: string;
    habitHistory: Record<string, string[]>;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habitId, habitHistory }) => {
    const streak = calculateStreak(habitId, habitHistory);

    if (streak === 0) {
        return null;
    }

    // This component is specifically for displaying the streak count.
    // The visual indication of whether a habit is completed *today* is handled by UI elements
    // in the parent component (e.g., a checkbox on the dashboard or a colored square in history).
    return (
        <div className="flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/50 rounded-full px-1.5 py-0.5">
            <span className="material-symbols-outlined text-sm">local_fire_department</span>
            <span>{streak} day streak</span>
        </div>
    );
};

export default HabitTracker;
