import React from 'react';
import { Goal, Page } from '../types';
import { Card } from './common/Card';
import { NoGoalsIllustration } from './common/illustrations/NoGoalsIllustration';

interface GoalsProps {
    goals: Goal[];
    onNavigate: (page: Page) => void;
}

const Goals: React.FC<GoalsProps> = ({ goals, onNavigate }) => {
    const completedCount = goals.filter(g => g.isCompleted).length;
    const totalCount = goals.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const activeGoals = goals.filter(g => !g.isCompleted);

    return (
        <Card title="Your Health Goals">
            <div className="space-y-4">
                {totalCount > 0 && (
                     <div>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-foreground-light dark:text-foreground-dark text-sm font-medium">Overall Progress</p>
                            <p className="text-subtle-light dark:text-subtle-dark text-xs font-medium">{completedCount}/{totalCount} completed</p>
                        </div>
                        <div className="rounded-full bg-black/10 dark:bg-white/10 h-2">
                            <div className="h-2 rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                )}

                {/* Active Goals List */}
                {activeGoals.length > 0 ? (
                    <ul className="space-y-2">
                        {activeGoals.slice(0, 3).map(goal => ( // Show up to 3 active goals
                            <li key={goal.id} className="flex items-center gap-3">
                                <div className="flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-subtle-light dark:text-subtle-dark shrink-0 size-6">
                                    <span className="material-symbols-outlined text-base">radio_button_unchecked</span>
                                </div>
                                <p className="text-foreground-light dark:text-foreground-dark text-sm">{goal.text}</p>
                            </li>
                        ))}
                    </ul>
                ) : totalCount > 0 ? (
                     <p className="text-green-600 dark:text-green-400 text-sm font-semibold text-center py-2">All goals completed! Great job!</p>
                ) : (
                    <div className="text-center py-4">
                        <NoGoalsIllustration className="w-24 h-24 mx-auto text-primary" />
                        <p className="text-subtle-light dark:text-subtle-dark text-sm mt-2">Add a new goal from your profile to get started.</p>
                    </div>
                )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                 <button
                    onClick={() => onNavigate('profile')}
                    className="w-full text-center py-2 px-3 bg-black/5 hover:bg-black/10 text-foreground-light dark:bg-white/5 dark:hover:bg-white/10 dark:text-foreground-dark font-semibold rounded-lg transition-colors text-sm"
                >
                    Manage All Goals
                </button>
            </div>
        </Card>
    );
};

export default Goals;