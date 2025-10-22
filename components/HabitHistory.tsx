import React, { useState, useMemo } from 'react';
import { Habit, Page } from '../types';
import { getDateString } from '../utils/habits';
import HabitTracker from './HabitTracker';
import { NoDataIllustration } from './common/illustrations/NoDataIllustration';
import { Card } from './common/Card';

interface HabitHistoryProps {
    habits: Habit[];
    habitHistory: Record<string, string[]>;
    onNavigate: (page: Page) => void;
}

/**
 * Calculates the weekly completion count for each day of a given month for a specific habit.
 * This is optimized to calculate each week's summary only once.
 * @param habitId The ID of the habit.
 * @param history A record of completed habit IDs by date.
 * @param year The year of the month to calculate for.
 * @param month The month (0-indexed) to calculate for.
 * @returns A Map where the key is a date string 'YYYY-MM-DD' and the value is the completion count for that week.
 */
const calculateWeeklySummaries = (
  habitId: string,
  history: Record<string, string[]>,
  year: number,
  month: number
): Map<string, number> => {
  const dailySummaries = new Map<string, number>();
  const weeklyCache = new Map<string, number>(); // Cache for weekly counts, key is start-of-week date string

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const currentDateStr = getDateString(currentDate);

    const dayOfWeek = currentDate.getDay(); // 0 for Sunday
    const startOfWeekDate = new Date(currentDate);
    startOfWeekDate.setDate(currentDate.getDate() - dayOfWeek);
    const startOfWeekStr = getDateString(startOfWeekDate);

    let weeklyCount: number;

    if (weeklyCache.has(startOfWeekStr)) {
      weeklyCount = weeklyCache.get(startOfWeekStr)!;
    } else {
      // Calculate for the new week
      let count = 0;
      for (let i = 0; i < 7; i++) {
        const dayInWeek = new Date(startOfWeekDate);
        dayInWeek.setDate(startOfWeekDate.getDate() + i);
        const dayInWeekStr = getDateString(dayInWeek);
        if (history[dayInWeekStr]?.includes(habitId)) {
          count++;
        }
      }
      weeklyCount = count;
      weeklyCache.set(startOfWeekStr, weeklyCount);
    }

    dailySummaries.set(currentDateStr, weeklyCount);
  }
  return dailySummaries;
};


const HabitCalendar: React.FC<{ habit: Habit, history: Record<string, string[]> }> = ({ habit, history }) => {
    const [displayDate, setDisplayDate] = useState(new Date());
    const today = new Date();

    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const monthName = displayDate.toLocaleString('default', { month: 'long' });

    const weeklySummaries = useMemo(
        () => calculateWeeklySummaries(habit.id, history, year, month),
        [habit.id, history, year, month]
    );
    
    const handlePrevMonth = () => {
        setDisplayDate(current => new Date(current.getFullYear(), current.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setDisplayDate(current => new Date(current.getFullYear(), current.getMonth() + 1, 1));
    };

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: startDayOfWeek });

    const todayDateString = getDateString(new Date());
    
    return (
        <div className="bg-black/5 dark:bg-white/5 p-4 sm:p-6 rounded-xl border border-black/10 dark:border-white/10 shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div>
                     <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark">{habit.name}</h3>
                </div>
                <HabitTracker habitId={habit.id} habitHistory={history} />
            </div>

            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-subtle-light/10 dark:hover:bg-subtle-dark/10" aria-label="Previous month">
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <p className="font-semibold text-foreground-light dark:text-foreground-dark">{monthName} {year}</p>
                 <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-subtle-light/10 dark:hover:bg-subtle-dark/10" aria-label="Next month">
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-subtle-light dark:text-subtle-dark">
                {/* Weekday Headers */}
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day} className="font-semibold p-1">{day}</div>)}
                
                {/* Empty cells for padding */}
                {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
                
                {/* Day cells */}
                {days.map(day => {
                    const date = new Date(year, month, day);
                    const dateStr = getDateString(date);
                    const isCompleted = history[dateStr]?.includes(habit.id);
                    const isToday = dateStr === todayDateString;
                    
                    const isFuture = date.getFullYear() > today.getFullYear() ||
                                  (date.getFullYear() === today.getFullYear() && date.getMonth() > today.getMonth()) ||
                                  (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() > today.getDate());

                    let dayContainerClasses = "w-full aspect-square flex flex-col items-center justify-center p-1 rounded-lg text-sm transition-colors relative";
                    let dayNumberClasses = "";
                    const weeklyCount = weeklySummaries.get(dateStr) || 0;

                    if (isToday) {
                        dayContainerClasses += " bg-primary/20";
                        dayNumberClasses += " text-primary font-bold";
                    } else if (isCompleted && !isFuture) {
                        dayContainerClasses += " bg-primary/10 dark:bg-primary/20";
                    } else {
                        dayContainerClasses += " hover:bg-black/5 dark:hover:bg-white/10";
                    }

                    if (isFuture) {
                        dayNumberClasses += " text-subtle-light/50 dark:text-subtle-dark/50";
                    } else if (!isToday) {
                        dayNumberClasses += " text-foreground-light dark:text-foreground-dark";
                    }
                    
                    return (
                        <div key={day} className={dayContainerClasses} aria-label={`Day ${day}, ${isCompleted ? `completed, ${weeklyCount} of 7 this week` : 'not completed'}`}>
                            <span className={dayNumberClasses}>{day}</span>
                            {isCompleted && !isFuture && weeklyCount > 0 && (
                                <div
                                    className="w-full h-1.5 bg-subtle-light/20 dark:bg-subtle-dark/20 rounded-full mt-1 overflow-hidden"
                                    title={`${weeklyCount} of 7 completions this week`}
                                >
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-300"
                                        style={{ width: `${(weeklyCount / 7) * 100}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const HabitHistory: React.FC<HabitHistoryProps> = ({ habits, habitHistory, onNavigate }) => {
    // Sort habits to show clinically proven ones first
    const sortedHabits = [...habits].sort((a, b) => {
        if (a.category === 'Clinically Proven' && b.category !== 'Clinically Proven') return -1;
        if (a.category !== 'Clinically Proven' && b.category === 'Clinically Proven') return 1;
        return a.name.localeCompare(b.name);
    });

    if (habits.length === 0) {
        return (
            <Card>
                <div className="text-center py-8">
                    <NoDataIllustration className="w-32 h-32 mx-auto text-subtle-light dark:text-subtle-dark" />
                    <h3 className="mt-4 text-lg font-bold text-foreground-light dark:text-foreground-dark">No Habits to Track</h3>
                    <p className="text-subtle-light dark:text-subtle-dark mt-2 mb-6 max-w-sm mx-auto">
                        You haven't added any habits yet. Go to the habit management page to create your first one.
                    </p>
                    <button 
                        onClick={() => onNavigate('habit-management')}
                        className="bg-primary hover:opacity-90 text-white font-bold py-2 px-5 rounded-lg transition duration-200"
                    >
                        Manage Habits
                    </button>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {sortedHabits.map(habit => (
                <HabitCalendar key={habit.id} habit={habit} history={habitHistory} />
            ))}
        </div>
    );
};

export default HabitHistory;