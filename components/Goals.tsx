import React from 'react';
import { Goal, Page } from '../types';

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
        <div className="px-4 pt-4 pb-1">
            <h2 className="text-gray-900 dark:text-gray-50 text-xl font-bold leading-tight tracking-[-0.015em] mb-3">Your Health Goals</h2>
            <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-4 space-y-4">
                {/* Progress Section */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-gray-900 dark:text-gray-50 text-sm font-medium leading-normal">Overall Progress</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-normal">{completedCount}/{totalCount} completed</p>
                    </div>
                    <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-2">
                        <div className="h-2 rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>

                {/* Active Goals List */}
                {activeGoals.length > 0 ? (
                    <ul className="space-y-2">
                        {activeGoals.slice(0, 3).map(goal => ( // Show up to 3 active goals
                            <li key={goal.id} className="flex items-center gap-3">
                                <div className="flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 shrink-0 size-6">
                                    <span className="material-symbols-outlined text-base">radio_button_unchecked</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">{goal.text}</p>
                            </li>
                        ))}
                    </ul>
                ) : totalCount > 0 ? (
                     <p className="text-green-600 dark:text-green-400 text-sm font-semibold text-center py-2">All goals completed! Great job!</p>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-2">Add a new goal from your profile to get started.</p>
                )}

                {/* Action Button */}
                <button
                    onClick={() => onNavigate('profile')}
                    className="w-full text-center py-2 px-3 bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-blue-300 font-semibold rounded-lg transition-colors text-sm"
                >
                    Manage All Goals
                </button>
            </div>
        </div>
    );
};

export default Goals;
