import React, { useState, useMemo } from 'react';
import { DailyDietLog, MealLogItem, MealType } from '../types';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { getDateString } from '../utils/habits';
import { NoDataIllustration } from './common/illustrations/NoDataIllustration';

// ==================== TYPES ====================

interface DailyDietLogProps {
  dailyDietLog: DailyDietLog;
  isLoading: boolean; // For analysis
  error: string | null;
  onUpdateLog: (date: string, meal: MealType, item: MealLogItem) => void;
  onAnalyzeLog: (date: string) => void;
}

const MEAL_TYPES: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

// ==================== HELPERS ====================

const getFormattedDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
};

// ==================== SUB-COMPONENTS ====================

const MealCard: React.FC<{
    meal: MealType;
    items: MealLogItem[];
    onAddItem: (text: string) => void;
}> = ({ meal, items, onAddItem }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newItemText, setNewItemText] = useState('');

    const mealIcons: Record<string, string> = {
        Breakfast: 'free_breakfast',
        Lunch: 'lunch_dining',
        Dinner: 'dinner_dining',
        Snacks: 'bakery_dining',
    };

    const handleAddClick = () => {
        if (isAdding && newItemText.trim()) {
            onAddItem(newItemText.trim());
            setNewItemText('');
            // Keep the input open to add another item
        } else {
            setIsAdding(true);
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newItemText.trim()) {
            e.preventDefault();
            handleAddClick();
        } else if (e.key === 'Escape') {
            setIsAdding(false);
            setNewItemText('');
        }
    };

    return (
        <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-black/10 dark:border-white/10">
            <h4 className="font-semibold text-foreground-light dark:text-foreground-dark flex items-center mb-2">
                <span className="material-symbols-outlined mr-2 text-primary">{mealIcons[meal]}</span>
                {meal}
            </h4>
            <ul className="space-y-1 text-sm text-subtle-light dark:text-subtle-dark pl-8">
                {items.map(item => <li key={item.id}>- {item.text}</li>)}
            </ul>
            {isAdding && (
                <div className="pl-8 pt-2">
                    <input
                        type="text"
                        value={newItemText}
                        onChange={e => setNewItemText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., Apple slices"
                        className="w-full text-sm bg-background-light dark:bg-background-dark border border-black/10 dark:border-white/10 rounded-md p-2 text-foreground-light dark:text-foreground-dark focus:ring-primary focus:border-primary"
                        autoFocus
                    />
                </div>
            )}
            <div className="pl-8 pt-2">
                 <button onClick={handleAddClick} className="text-sm text-primary hover:underline font-medium">
                    {isAdding ? "Save Item" : "+ Add Item"}
                </button>
                {isAdding && (
                    <button onClick={() => setIsAdding(false)} className="ml-2 text-sm text-subtle-light dark:text-subtle-dark hover:underline">
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

const EmptyLogState: React.FC<{ onAddItem: (meal: MealType) => void }> = ({ onAddItem }) => (
    <div className="text-center py-8">
        <NoDataIllustration className="w-32 h-32 mx-auto text-subtle-light dark:text-subtle-dark" />
        <h3 className="mt-4 text-lg font-bold text-foreground-light dark:text-foreground-dark">No Meals Logged</h3>
        <p className="text-subtle-light dark:text-subtle-dark mt-2 mb-6 max-w-sm mx-auto">Log your meals to get AI-powered insights on how your diet affects your oral health.</p>
        <button onClick={() => onAddItem('Breakfast')} className="bg-primary/20 text-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary/30 transition-colors">
            + Log Breakfast
        </button>
    </div>
);


// ==================== MAIN COMPONENT ====================

const DailyDietLogComponent: React.FC<DailyDietLogProps> = ({ dailyDietLog, isLoading, error, onUpdateLog, onAnalyzeLog }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const selectedDateString = useMemo(() => getDateString(selectedDate), [selectedDate]);
    
    const currentDayLog = useMemo(() => {
        return dailyDietLog[selectedDateString] || { analysis: null };
    }, [dailyDietLog, selectedDateString]);

    const handleAddItem = (meal: MealType, text: string) => {
        const newItem: MealLogItem = {
            id: `${Date.now()}-${Math.random()}`,
            text
        };
        onUpdateLog(selectedDateString, meal, newItem);
    };
    
    const changeDay = (amount: number) => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + amount);
            return newDate;
        });
    };
    
    const hasAnyMeals = MEAL_TYPES.some(meal => currentDayLog[meal]?.length > 0);

    return (
        <div>
            <Card>
                {/* Date Navigator */}
                <div className="flex justify-between items-center mb-4 border-b border-subtle-light/20 dark:border-border-dark pb-4">
                    <button onClick={() => changeDay(-1)} aria-label="Previous day" className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"><span className="material-symbols-outlined">chevron_left</span></button>
                    <h3 className="font-bold text-lg text-center text-foreground-light dark:text-foreground-dark">{getFormattedDate(selectedDate)}</h3>
                    <button onClick={() => changeDay(1)} aria-label="Next day" className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"><span className="material-symbols-outlined">chevron_right</span></button>
                </div>
                
                {hasAnyMeals ? (
                    <div className="space-y-4">
                        {/* Meal Cards */}
                        {MEAL_TYPES.map(meal => (
                            <MealCard 
                                key={meal} 
                                meal={meal} 
                                items={currentDayLog[meal] || []}
                                onAddItem={(text) => handleAddItem(meal, text)}
                            />
                        ))}

                        {/* Analysis Section */}
                        <div className="pt-4 space-y-3">
                            {currentDayLog.analysis && !isLoading && (
                                <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-xl border border-primary/20 dark:border-primary/30">
                                    <h3 className="text-lg font-semibold mb-2 text-primary flex items-center">
                                        <span className="material-symbols-outlined mr-2">psychology</span>
                                        AI Analysis
                                    </h3>
                                    <p className="text-sm text-foreground-light dark:text-foreground-dark whitespace-pre-wrap">{currentDayLog.analysis}</p>
                                </div>
                            )}
                            
                            {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}
                            
                            {isLoading ? (
                                <div className="min-h-[50px] flex items-center justify-center">
                                    <Spinner label="Analyzing..." />
                                </div>
                            ) : (
                                <button 
                                    onClick={() => onAnalyzeLog(selectedDateString)} 
                                    disabled={!hasAnyMeals}
                                    className="w-full bg-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {currentDayLog.analysis ? 'Re-analyze Day\'s Meals' : 'Analyze Day\'s Meals'}
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <EmptyLogState onAddItem={(meal) => handleAddItem(meal, '')}/>
                )}
            </Card>
        </div>
    );
};

export default DailyDietLogComponent;