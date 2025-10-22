import React, { useState } from 'react';
import { Habit } from '../types';
import { Card } from './common/Card';
import HabitForm from './HabitForm';

interface HabitManagementProps {
    habits: Habit[];
    onAddHabit: (habitData: Omit<Habit, 'id'>) => void;
    onUpdateHabit: (habit: Habit) => void;
    onDeleteHabit: (id: string) => void;
}

const HabitManagement: React.FC<HabitManagementProps> = ({ habits, onAddHabit, onUpdateHabit, onDeleteHabit }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);

    const handleOpenAddForm = () => {
        setHabitToEdit(null);
        setIsFormOpen(true);
    };

    const handleOpenEditForm = (habit: Habit) => {
        setHabitToEdit(habit);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setHabitToEdit(null);
    };
    
    const handleSaveHabit = (habitData: Habit | Omit<Habit, 'id'>) => {
        if ('id' in habitData) {
            onUpdateHabit(habitData);
        } else {
            onAddHabit(habitData);
        }
        handleCloseForm();
    };
    
    const handleDeleteClick = (id: string) => {
        if (window.confirm("Are you sure you want to delete this habit? This will not affect past history but cannot be undone.")) {
            onDeleteHabit(id);
        }
    }

    return (
        <>
            <Card
                title="Manage Your Habits"
                icon={<span className="material-symbols-outlined">checklist</span>}
                headerAction={
                    <button onClick={handleOpenAddForm} className="bg-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-1 text-sm">
                        <span className="material-symbols-outlined text-base">add</span>
                        Add Habit
                    </button>
                }
            >
                {habits.length > 0 ? (
                    <div className="space-y-3">
                        {habits.map(habit => (
                            <div key={habit.id} className="flex items-center gap-4 p-3 bg-background-light dark:bg-input-dark/50 rounded-lg border border-subtle-light/20 dark:border-subtle-dark/20">
                                <div className="relative flex-shrink-0">
                                    <div className="bg-primary/20 text-primary flex items-center justify-center rounded-lg size-11 shadow-md">
                                        <span className="material-symbols-outlined">{habit.icon}</span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-foreground-light dark:text-foreground-dark text-sm font-semibold truncate">{habit.name}</p>
                                    <p className="text-subtle-light dark:text-subtle-dark text-xs truncate">{habit.description}</p>
                                </div>
                                <div className="flex-shrink-0 flex items-center gap-2">
                                     <button onClick={() => handleOpenEditForm(habit)} className="p-2 text-subtle-light dark:text-subtle-dark hover:text-primary rounded-md" aria-label={`Edit ${habit.name}`}>
                                        <span className="material-symbols-outlined text-xl">edit</span>
                                    </button>
                                     <button onClick={() => handleDeleteClick(habit.id)} className="p-2 text-subtle-light dark:text-subtle-dark hover:text-red-500" aria-label={`Delete ${habit.name}`}>
                                        <span className="material-symbols-outlined text-xl">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-subtle-light dark:text-subtle-dark py-8">
                        No habits found. Add your first habit to get started!
                    </p>
                )}
            </Card>

            {isFormOpen && (
                <HabitForm
                    habitToEdit={habitToEdit}
                    onSave={handleSaveHabit}
                    onCancel={handleCloseForm}
                />
            )}
        </>
    );
};

export default HabitManagement;