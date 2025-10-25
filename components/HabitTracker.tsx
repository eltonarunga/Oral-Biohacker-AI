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

// NEW: Replaced WeeklyDots with a more visual WeeklyBarChart to show progress.
const WeeklyBarChart: React.FC<{ status: boolean[] }> = ({ status }) => {
    const completions = status.filter(Boolean).length;
    return (
        <div className="flex items-center gap-2" title={`${completions}/7 completions in the last 7 days`}>
            <div className="flex items-end gap-1 h-5"> {/* Aligns bars to the bottom */}
                {status.map((completed, index) => (
                    <div
                        key={index}
                        className={`w-1.5 rounded-full transition-all duration-300 ${completed ? 'h-full bg-primary' : 'h-1/3 bg-subtle-light/20 dark:bg-subtle-dark/20'}`}
                    />
                ))}
            </div>
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
        <div className="flex items-center gap-3">
            {last7DaysCompletions > 0 && <WeeklyBarChart status={last7Days} />}
            
            {streak > 0 && (
                <div
                    className={`flex items-center gap-1 text-orange-500 dark:text-orange-400 font-bold ${streak > 2 ? 'animate-pulse-bright' : ''}`}
                    title={`Current streak: ${streak} days`}
                >
                    {/* ENHANCED: Made the icon and number larger for more visual impact. */}
                    <span className="material-symbols-outlined text-xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                    <span className="text-lg leading-none font-black tracking-tighter">{streak}</span>
                </div>
            )}
        </div>
    );
};

export default HabitTracker;