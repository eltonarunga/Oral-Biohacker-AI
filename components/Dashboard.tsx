

import React, { useMemo } from 'react';
import { UserProfile, Habit, Page } from '../types';
import { getDateString } from '../utils/habits';
import Goals from './Goals';
import HabitTracker from './HabitTracker';

interface DashboardProps {
    profile: UserProfile;
    onNavigate: (page: Page) => void;
    habits: Habit[];
    habitHistory: Record<string, string[]>;
    onToggleHabit: (id: string) => void;
}

interface HabitItemProps {
    habit: Habit;
    onToggle: (id: string) => void;
    isLast: boolean;
    isCompleted: boolean;
    habitHistory: Record<string, string[]>;
}
const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggle, isLast, isCompleted, habitHistory }) => (
    <div className={`flex items-center gap-4 bg-white dark:bg-slate-800 px-4 py-3 justify-between ${!isLast ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
        <div className="flex items-center gap-4">
            <div className="text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50 shrink-0 size-12">
                <span className="material-symbols-outlined">{habit.icon}</span>
            </div>
            <div className="flex flex-col justify-center">
                <p className="text-gray-900 dark:text-gray-50 text-base font-medium leading-normal line-clamp-1">{habit.name}</p>
                <div className="flex items-center gap-2">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">{habit.time}</p>
                    <HabitTracker habitId={habit.id} habitHistory={habitHistory} />
                </div>
            </div>
        </div>
        <div className="shrink-0">
            <div className="flex size-7 items-center justify-center">
                <input 
                    className="h-6 w-6 rounded-md border-gray-300 dark:border-gray-600 border-2 bg-transparent text-blue-600 checked:bg-blue-600 checked:border-blue-600 checked:bg-[image:var(--checkbox-tick-svg)] focus:ring-0 focus:ring-offset-0 focus:border-gray-300 dark:focus:border-gray-500 focus:outline-none" 
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggle(habit.id)}
                    aria-label={`Mark habit ${habit.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
                />
            </div>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ profile, onNavigate, habits, habitHistory, onToggleHabit }) => {
    const today = getDateString(new Date());
    const todaysCompletions = useMemo(() => habitHistory[today] || [], [habitHistory, today]);

    const completedCount = todaysCompletions.length;
    const totalCount = habits.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    
    const groupedHabits = useMemo(() => {
        const categories: ('Clinically Proven' | 'Biohacking')[] = ['Clinically Proven', 'Biohacking'];
        
        return categories
            .map(category => ({
                title: category,
                habits: habits.filter(h => h.category === category)
            }))
            .filter(group => group.habits.length > 0);
    }, [habits]);

    return (
        <>
            <div className="flex p-4">
                <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex items-center gap-4">
                        <img src={profile.avatarUrl} alt={`${profile.name}'s avatar`} className="aspect-square bg-cover rounded-full h-20 w-20 object-cover" />
                        <div className="flex flex-col justify-center">
                            <p className="text-gray-900 dark:text-gray-50 text-[22px] font-bold leading-tight tracking-[-0.015em]">{profile.name}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">{profile.bio}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Goals goals={profile.goals} onNavigate={onNavigate} />

            <div className="px-4 pt-5 pb-3">
                <h2 className="text-gray-900 dark:text-gray-50 text-xl font-bold leading-tight tracking-[-0.015em]">Your Biohacking Plan</h2>
            </div>
            <div className="px-4">
                <div className="flex flex-col items-stretch justify-start rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
                    <img src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2138&auto=format&fit=crop" alt="Doctor reviewing a health plan on a tablet" className="w-full h-auto aspect-video object-cover" />
                    <div className="flex w-full flex-col items-stretch justify-center gap-1 p-4">
                        <p className="text-gray-900 dark:text-gray-50 text-lg font-bold leading-tight tracking-[-0.015em]">Personalized Oral Biohacking</p>
                        <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Unlock your peak performance with a tailored plan.</p>
                    </div>
                </div>
            </div>
            
            <div className="px-4 pt-8 pb-3">
                <h2 className="text-gray-900 dark:text-gray-50 text-xl font-bold leading-tight tracking-[-0.015em]">Daily Habits</h2>
            </div>
            <div className="flex flex-col gap-3 px-4 pb-6">
                <div className="flex gap-6 justify-between items-center">
                    <div className="flex items-center gap-2">
                        <p className="text-gray-900 dark:text-gray-50 text-base font-medium leading-normal">Today's Progress</p>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">{completedCount}/{totalCount} completed</p>
                </div>
                <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-2.5">
                    <div className="h-2.5 rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>
             <div className="flex flex-col gap-6 px-4 pb-4">
                {groupedHabits.map(group => (
                    <div key={group.title}>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">{group.title}</h3>
                        <div className="flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            {group.habits.map((habit, index) => {
                                const isCompleted = todaysCompletions.includes(habit.id);
                                return (
                                    <HabitItem 
                                        key={habit.id} 
                                        habit={habit} 
                                        onToggle={onToggleHabit} 
                                        isLast={index === group.habits.length - 1} 
                                        isCompleted={isCompleted}
                                        habitHistory={habitHistory}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            <div className="px-4 pb-4">
                <button
                    onClick={() => onNavigate('habit-history')}
                    className="w-full text-center py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-200 font-semibold rounded-lg transition-colors"
                >
                    View Full History
                </button>
            </div>
        </>
    );
};

export default Dashboard;