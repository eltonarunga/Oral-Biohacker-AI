import React from 'react';
import { Habit } from '../types';
import { getDateString } from '../utils/habits';
import HabitTracker from './HabitTracker';

interface HabitHistoryProps {
    habits: Habit[];
    habitHistory: Record<string, string[]>;
}

const HabitCalendar: React.FC<{ habit: Habit, history: Record<string, string[]> }> = ({ habit, history }) => {
    const today = new Date();
    const currentDate = new Date(); // Using current date for the calendar
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: startDayOfWeek });

    const todayDateString = getDateString(new Date());
    
    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                     <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">{habit.name}</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400">{monthName} {year}</p>
                </div>
                <HabitTracker habitId={habit.id} habitHistory={history} />
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 dark:text-gray-400">
                {/* Weekday Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="font-semibold p-1">{day}</div>)}
                
                {/* Empty cells for padding */}
                {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
                
                {/* Day cells */}
                {days.map(day => {
                    const date = new Date(year, month, day);
                    const dateStr = getDateString(date);
                    const isCompleted = history[dateStr]?.includes(habit.id);
                    const isToday = dateStr === todayDateString;
                    
                    // A simple check to see if the date is in the future.
                    // We compare year, month, and day to avoid timezone issues.
                    const isFuture = date.getFullYear() > today.getFullYear() ||
                                  (date.getFullYear() === today.getFullYear() && date.getMonth() > today.getMonth()) ||
                                  (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() > today.getDate());

                    let cellClasses = "w-full aspect-square flex items-center justify-center rounded-full text-sm transition-colors";
                    
                    if (isFuture) {
                        cellClasses += " text-gray-400 dark:text-gray-600";
                    } else {
                         if (isCompleted) {
                            cellClasses += " bg-green-500 text-white font-bold";
                         } else {
                            cellClasses += " bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
                         }
                    }

                    if (isToday) {
                        cellClasses += " ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-800";
                    }
                    
                    return (
                        <div key={day} className={cellClasses} aria-label={`Day ${day}, ${isCompleted ? 'completed' : 'not completed'}`}>
                            {day}
                        </div>
                    );
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
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {sortedHabits.map(habit => (
                <HabitCalendar key={habit.id} habit={habit} history={habitHistory} />
            ))}
        </div>
    );
};

export default HabitHistory;