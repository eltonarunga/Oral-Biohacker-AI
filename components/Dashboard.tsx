

import React, { useMemo } from 'react';
import { UserProfile, Habit, Page } from '../types';
import HabitTracker from './HabitTracker';
import PersonalizedInsights from './PersonalizedInsights';
import Goals from './Goals';
import { Card } from './common/Card';
import CoreHabitsCard from './CoreHabitsCard';
// FIX: Imported the missing 'getDateString' utility function.
import { getDateString } from '../utils/habits';

// ==================== TYPES ====================

interface DashboardProps {
    profile: UserProfile;
    onNavigate: (page: Page) => void;
    habits: Habit[];
    habitHistory: Record<string, string[]>;
    onToggleHabit: (id: string) => void;
}

// ==================== SUB-COMPONENTS ====================

const SupplementalHabitItem: React.FC<{
    habit: Habit;
    onToggle: (id: string) => void;
    isCompleted: boolean;
    habitHistory: Record<string, string[]>;
}> = ({ habit, onToggle, isCompleted, habitHistory }) => (
    <div className="flex items-center justify-between p-3 transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/10">
        <div className="flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined">{habit.icon}</span>
            </div>
            <div>
                <h3 className="font-semibold text-foreground-light dark:text-foreground-dark">{habit.name}</h3>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">{habit.time}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <HabitTracker habitId={habit.id} habitHistory={habitHistory} />
            <button
                onClick={() => onToggle(habit.id)}
                className={`size-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 flex-shrink-0 ${isCompleted ? 'bg-primary border-primary scale-110' : 'border-subtle-light dark:border-subtle-dark'}`}
                aria-label={`Mark habit ${habit.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
            >
                {isCompleted && <span className="material-symbols-outlined text-base text-white animate-check-grow">check</span>}
            </button>
        </div>
    </div>
);

const ActionCard: React.FC<{
    page: Page;
    title: string;
    description: string;
    icon: string;
    onNavigate: (page: Page) => void;
}> = ({ page, title, description, icon, onNavigate }) => (
    <button onClick={() => onNavigate(page)} className="glass-card p-4 rounded-xl w-full text-left transition-transform hover:scale-105">
        <div className="flex items-start gap-4">
            <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <span className="material-symbols-outlined text-primary">{icon}</span>
            </div>
            <div className="flex-1">
                <h3 className="font-semibold text-foreground-light dark:text-foreground-dark">{title}</h3>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">{description}</p>
            </div>
        </div>
    </button>
);


// ==================== MAIN COMPONENT ====================

const Dashboard: React.FC<DashboardProps> = ({ 
    profile, 
    onNavigate, 
    habits, 
    habitHistory, 
    onToggleHabit,
}) => {
    const { coreHabits, supplementalHabits } = useMemo(() => {
        const coreHabitIds = ['h-brush-am', 'h-brush-pm', 'h-floss'];
        return {
            coreHabits: habits.filter(h => coreHabitIds.includes(h.id)),
            supplementalHabits: habits.filter(h => !coreHabitIds.includes(h.id)),
        };
    }, [habits]);

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
                <img src={profile.avatarUrl} alt={`${profile.name}'s avatar`} className="bg-cover rounded-full size-20 object-cover" />
                <div className="flex flex-col justify-center">
                    <h1 className="text-foreground-light dark:text-foreground-dark text-2xl md:text-3xl font-bold leading-tight tracking-tight">Welcome back, {profile.name.split(' ')[0]}!</h1>
                    <p className="text-subtle-light dark:text-subtle-dark text-base font-normal leading-normal">Let's make today a great day for your health.</p>
                </div>
            </div>

            {/* AI Insight Section */}
            <PersonalizedInsights profile={profile} habitHistory={habitHistory} />
            
            {/* Core Habits Section */}
            <CoreHabitsCard
                habits={coreHabits}
                habitHistory={habitHistory}
                onToggleHabit={onToggleHabit}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Supplemental Habit Tracking */}
                    {supplementalHabits.length > 0 && (
                        <Card title="Supplemental Habits">
                            <div className="space-y-2 -m-2">
                                {supplementalHabits.map((habit) => (
                                    <SupplementalHabitItem 
                                        key={habit.id} 
                                        habit={habit} 
                                        onToggle={onToggleHabit} 
                                        isCompleted={(habitHistory[getDateString(new Date())] || []).includes(habit.id)}
                                        habitHistory={habitHistory}
                                    />
                                ))}
                            </div>
                        </Card>
                    )}
                    
                    {/* Explore Section */}
                    <section>
                         <h2 className="mb-4 text-xl font-bold text-foreground-light dark:text-foreground-dark">Explore</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ActionCard 
                                page="plan"
                                title="Your Biohacking Plan"
                                description="Access your AI-generated health plan."
                                icon="assignment"
                                onNavigate={onNavigate}
                            />
                            <ActionCard 
                                page="education"
                                title="Learn & Grow"
                                description="Browse educational articles and AI insights."
                                icon="school"
                                onNavigate={onNavigate}
                            />
                            <ActionCard 
                                page="symptom-checker"
                                title="Symptom Checker"
                                description="Analyze symptoms with our AI."
                                icon="medical_services"
                                onNavigate={onNavigate}
                            />
                             <ActionCard 
                                page="diet-log"
                                title="Diet Log"
                                description="Track meals and get oral health insights."
                                icon="restaurant"
                                onNavigate={onNavigate}
                            />
                         </div>
                    </section>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Goals Card */}
                    <Goals goals={profile.goals} onNavigate={onNavigate} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;