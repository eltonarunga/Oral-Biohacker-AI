import React from 'react';
import { calculateStreak, getDateString } from '../utils/habits';

interface HabitTrackerProps {
    habitId: string;
    habitHistory: Record<string, string[]>;
}

// Helper to get completion status for the last 7 days.
// The last item in the array is today.
const getLast7DaysStatus = (habitId: string, history: Record<string, string[]>): boolean[] => {
    const status: boolean[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = getDateString(date);
        status.push(history[dateStr]?.includes(habitId) ?? false);
    }
    return status;
};

const WeeklyDots: React.FC<{ status: boolean[] }> = ({ status }) => {
    const completions = status.filter(Boolean).length;
    return (
        <div className="flex items-center gap-2" title={`${completions}/7 completions in the last 7 days`}>
            <div className="flex gap-1">
                {status.map((completed, index) => (
                    <div
                        key={index}
                        className={`w-2 h-4 rounded-sm ${completed ? 'bg-primary' : 'bg-subtle-light/20 dark:bg-subtle-dark/20'}`}
                    />
                ))}
            </div>
            <span className="text-xs font-bold text-foreground-light dark:text-foreground-dark">{completions}/7</span>
        </div>
    );
};

const HabitTracker: React.FC<HabitTrackerProps> = ({ habitId, habitHistory }) => {
    const { streak } = calculateStreak(habitId, habitHistory);
    const last7Days = getLast7DaysStatus(habitId, habitHistory);
    const last7DaysCompletions = last7Days.filter(Boolean).length;

    if (streak === 0 && last7DaysCompletions === 0) {
        return null; // Render nothing if there's no data to show
    }

    return (
        <div className="flex items-center gap-4">
            {last7DaysCompletions > 0 && <WeeklyDots status={last7Days} />}
            
            {streak > 0 && (
                <div
                    className={`flex items-center gap-1 text-orange-500 dark:text-orange-400 font-bold ${streak > 2 ? 'animate-pulse-bright' : ''}`}
                    title={`Current streak: ${streak} days`}
                >
                    <span className="material-symbols-outlined text-xl leading-none">local_fire_department</span>
                    <span className="text-base leading-none font-black tracking-tight">{streak}</span>
                </div>
            )}
        </div>
    );
};

export default HabitTracker;