import React from 'react';
import { calculateStreak } from '../utils/habits';

interface HabitTrackerProps {
    habitId: string;
    habitHistory: Record<string, string[]>;
}

const CircularProgress: React.FC<{ completions: number }> = ({ completions }) => {
    const size = 32;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = completions / 7;
    const offset = circumference - progress * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                <circle
                    className="text-subtle-light/20 dark:text-subtle-dark/20"
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className="text-primary"
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground-light dark:text-foreground-dark">
                {completions}
            </span>
        </div>
    );
};


const HabitTracker: React.FC<HabitTrackerProps> = ({ habitId, habitHistory }) => {
    const { streak, weekCompletions } = calculateStreak(habitId, habitHistory);

    if (streak === 0 && weekCompletions === 0) {
        return null; // Render nothing if there's no data to show
    }

    return (
        <div className="flex items-center gap-4">
            {weekCompletions > 0 && (
                <div title={`${weekCompletions} completions this week`}>
                    <CircularProgress completions={weekCompletions} />
                </div>
            )}
            {streak > 0 && (
                <div
                    className={`flex items-center gap-1 text-orange-500 dark:text-orange-400 font-bold ${streak > 2 ? 'animate-pulse-bright' : ''}`}
                    title={`Current streak: ${streak} days`}
                >
                    <span className="material-symbols-outlined text-lg leading-none">local_fire_department</span>
                    <span className="text-sm leading-none">{streak}</span>
                </div>
            )}
        </div>
    );
};

export default HabitTracker;