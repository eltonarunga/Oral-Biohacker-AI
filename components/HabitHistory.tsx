
import React from 'react';
import { Habit } from '../types';
import { calculateStreak, getDateString } from '../utils/habits';

interface HabitHistoryProps {
    habits: Habit[];
    habitHistory: Record<string, string[]>;
}

const DaySquare: React.FC<{ completed: boolean, isToday: boolean }> = ({ completed, isToday }) => {
    const baseClasses = "h-5 w-5 rounded";
    const completedClasses = "bg-green-500";
    const incompleteClasses = "bg-gray-200 dark:bg-gray-700";
    const todayClasses = "ring-2 ring-offset-1 ring-blue-500 dark:ring-offset-slate-900";

    return (
        <div 
            className={`${baseClasses} ${completed ? completedClasses : incompleteClasses} ${isToday ? todayClasses : ''}`} 
            aria-label={completed ? 'Habit completed' : 'Habit not completed'}
        />
    );
};

const HabitHistoryRow: React.FC<{ habit: Habit, history: Record<string, string[]> }> = ({ habit, history }) => {
    const streak = calculateStreak(habit.id, history);
    
    // Create an array of the last 30 dates, ending with today
    const dates = Array.from({ length: 30 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return d;
    });

    const todayStr = getDateString(new Date());

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">{habit.name}</h3>
                {streak > 0 && (
                    <div className="flex items-center gap-1 text-sm font-medium text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/50 rounded-full px-2 py-0.5">
                       <span className="material-symbols-outlined text-base">local_fire_department</span>
                       <span>{streak} day streak</span>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-30 gap-1.5">
                {dates.map((date, i) => {
                    const dateStr = getDateString(date);
                    const isCompleted = history[dateStr]?.includes(habit.id) ?? false;
                    const isToday = todayStr === dateStr;
                    return <DaySquare key={i} completed={isCompleted} isToday={isToday} />;
                })}
            </div>
        </div>
    );
};

const HabitHistory: React.FC<HabitHistoryProps> = ({ habits, habitHistory }) => {
    // Sort habits to show clinically proven ones first
    const sortedHabits = [...habits].sort((a, b) => {
        if (a.category === 'Clinically Proven' && b.category !== 'Clinically Proven') return -1;
        if (a.category !== 'Clinically Proven' && b.category === 'Clinically Proven') return 1;
        return a.name.localeCompare(b.name);
    });

    return (
        <div className="p-4 space-y-4">
            {sortedHabits.map(habit => (
                <HabitHistoryRow key={habit.id} habit={habit} history={habitHistory} />
            ))}
        </div>
    );
};

export default HabitHistory;
