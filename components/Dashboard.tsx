import React, { useMemo } from 'react';
import { UserProfile, Habit, Page } from '../types';

interface DashboardProps {
    profile: UserProfile;
    onNavigate: (page: Page) => void;
    habits: Habit[];
    habitStreak: number;
    onToggleHabit: (id: string) => void;
}

interface HabitItemProps {
    habit: Habit;
    onToggle: (id: string) => void;
    isLast: boolean;
}
const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggle, isLast }) => (
    <div className={`flex items-center gap-4 bg-white px-4 py-3 justify-between ${!isLast ? 'border-b border-gray-200' : ''}`}>
        <div className="flex items-center gap-4">
            <div className="text-blue-600 flex items-center justify-center rounded-lg bg-blue-100 shrink-0 size-12">
                <span className="material-symbols-outlined">{habit.icon}</span>
            </div>
            <div className="flex flex-col justify-center">
                <p className="text-gray-900 text-base font-medium leading-normal line-clamp-1">{habit.name}</p>
                <p className="text-gray-500 text-sm font-normal leading-normal line-clamp-2">{habit.time}</p>
            </div>
        </div>
        <div className="shrink-0">
            <div className="flex size-7 items-center justify-center">
                <input 
                    className="h-6 w-6 rounded-md border-gray-300 border-2 bg-transparent text-blue-600 checked:bg-blue-600 checked:border-blue-600 checked:bg-[image:var(--checkbox-tick-svg)] focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none" 
                    type="checkbox"
                    checked={habit.completed}
                    onChange={() => onToggle(habit.id)}
                    aria-label={`Mark habit ${habit.name} as ${habit.completed ? 'incomplete' : 'complete'}`}
                />
            </div>
        </div>
    </div>
);

const ShortcutCard: React.FC<{ icon: string; title: string; description: string; onClick: () => void; }> = ({ icon, title, description, onClick }) => (
    <a onClick={onClick} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
        <div className="text-blue-600 flex items-center justify-center rounded-lg bg-blue-100 shrink-0 size-12">
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="flex flex-col justify-center">
            <p className="text-gray-900 text-base font-medium leading-normal line-clamp-1">{title}</p>
            <p className="text-gray-500 text-sm font-normal leading-normal line-clamp-2">{description}</p>
        </div>
        <div className="ml-auto text-gray-400">
            <span className="material-symbols-outlined">chevron_right</span>
        </div>
    </a>
);


const Dashboard: React.FC<DashboardProps> = ({ profile, onNavigate, habits, habitStreak, onToggleHabit }) => {

    const completedCount = useMemo(() => habits.filter(h => h.completed).length, [habits]);
    const totalCount = habits.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <>
            <div className="flex p-4">
                <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex items-center gap-4">
                        <img src={profile.avatarUrl} alt={`${profile.name}'s avatar`} className="aspect-square bg-cover rounded-full h-20 w-20 object-cover" />
                        <div className="flex flex-col justify-center">
                            <p className="text-gray-900 text-[22px] font-bold leading-tight tracking-[-0.015em]">{profile.name}</p>
                            <p className="text-gray-500 text-base font-normal leading-normal">{profile.bio}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 pt-5 pb-3">
                <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-[-0.015em]">Your Biohacking Plan</h2>
            </div>
            <div className="px-4">
                <div className="flex flex-col items-stretch justify-start rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                    <img src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2138&auto=format&fit=crop" alt="Doctor reviewing a health plan on a tablet" className="w-full h-auto aspect-video object-cover" />
                    <div className="flex w-full flex-col items-stretch justify-center gap-1 p-4">
                        <p className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em]">Personalized Oral Biohacking</p>
                        <p className="text-gray-500 text-base font-normal leading-normal">Unlock your peak performance with a tailored plan.</p>
                    </div>
                </div>
            </div>
            
            <div className="px-4 pt-8 pb-3">
                <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-[-0.015em]">Daily Habits</h2>
            </div>
            <div className="flex flex-col gap-3 px-4 pb-6">
                <div className="flex gap-6 justify-between items-center">
                    <div className="flex items-center gap-2">
                        <p className="text-gray-900 text-base font-medium leading-normal">Habit Completion</p>
                        {habitStreak > 0 && (
                            <div className="flex items-center gap-1 text-sm font-medium text-orange-600 bg-orange-100 rounded-full px-2 py-0.5">
                               <span className="material-symbols-outlined text-base">local_fire_department</span>
                               <span>{habitStreak} day streak</span>
                            </div>
                        )}
                    </div>
                    <p className="text-gray-500 text-sm font-normal leading-normal">{completedCount}/{totalCount} completed</p>
                </div>
                <div className="rounded-full bg-gray-200 h-2.5">
                    <div className="h-2.5 rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>
            <div className="flex flex-col mt-4">
                {habits.map((habit, index) => (
                    <HabitItem key={habit.id} habit={habit} onToggle={onToggleHabit} isLast={index === habits.length - 1} />
                ))}
            </div>
        </>
    );
};

export default Dashboard;