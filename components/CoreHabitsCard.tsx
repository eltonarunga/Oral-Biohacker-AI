
import React from 'react';
import { Habit } from '../types';
import { Card } from './common/Card';
import { getDateString } from '../utils/habits';

// ==================== TYPES ====================

interface CoreHabitsCardProps {
    habits: Habit[];
    habitHistory: Record<string, string[]>;
    onToggleHabit: (id: string) => void;
}

// ==================== MAIN COMPONENT ====================

const CoreHabitsCard: React.FC<CoreHabitsCardProps> = ({ habits, habitHistory, onToggleHabit }) => {
    const today = getDateString(new Date());
    const todaysCompletions = habitHistory[today] || [];

    const brushingAM = habits.find(h => h.id === 'h-brush-am');
    const brushingPM = habits.find(h => h.id === 'h-brush-pm');
    const flossing = habits.find(h => h.id === 'h-floss');

    const isBrushingAMCompleted = brushingAM ? todaysCompletions.includes(brushingAM.id) : false;
    const isBrushingPMCompleted = brushingPM ? todaysCompletions.includes(brushingPM.id) : false;
    const isFlossingCompleted = flossing ? todaysCompletions.includes(flossing.id) : false;

    return (
        <Card title="Core Dental Care" icon={<span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>health_and_safety</span>}>
            <div className="space-y-4">
                {/* Brushing Section */}
                {brushingAM && brushingPM && (
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <span className="material-symbols-outlined text-3xl">toothbrush</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-foreground-light dark:text-foreground-dark">Brush Teeth</h3>
                            <p className="text-sm text-subtle-light dark:text-subtle-dark">Twice daily for optimal health</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onToggleHabit(brushingAM.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${isBrushingAMCompleted ? 'bg-primary text-white' : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20'}`}
                                aria-label="Toggle morning brushing"
                            >
                                <span className="material-symbols-outlined text-base">{brushingAM.icon}</span>
                                Morning
                                {isBrushingAMCompleted && <span className="material-symbols-outlined text-base">check</span>}
                            </button>
                             <button
                                onClick={() => onToggleHabit(brushingPM.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${isBrushingPMCompleted ? 'bg-primary text-white' : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20'}`}
                                aria-label="Toggle evening brushing"
                            >
                                <span className="material-symbols-outlined text-base">{brushingPM.icon}</span>
                                Evening
                                {isBrushingPMCompleted && <span className="material-symbols-outlined text-base">check</span>}
                            </button>
                        </div>
                    </div>
                )}

                {/* Divider */}
                <div className="border-t border-border-light dark:border-border-dark !my-2"></div>
                
                {/* Flossing Section */}
                {flossing && (
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                             <span className="material-symbols-outlined text-3xl">cleaning_services</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-foreground-light dark:text-foreground-dark">Floss</h3>
                            <p className="text-sm text-subtle-light dark:text-subtle-dark">Once a day to prevent gum issues</p>
                        </div>
                        <button
                            onClick={() => onToggleHabit(flossing.id)}
                            className={`size-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isFlossingCompleted ? 'bg-primary border-primary scale-110' : 'border-subtle-light dark:border-subtle-dark'}`}
                            aria-label="Toggle flossing"
                        >
                            {isFlossingCompleted && <span className="material-symbols-outlined text-xl text-white animate-check-grow">check</span>}
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default CoreHabitsCard;
