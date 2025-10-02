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

    return (
        <div className="flex items-center gap-1 text-orange-500 dark:text-orange-400 font-bold">
            <span className="material-symbols-outlined text-lg leading-none">local_fire_department</span>
            <span className="text-sm leading-none">{streak}</span>
        </div>
    );
};

export default HabitTracker;