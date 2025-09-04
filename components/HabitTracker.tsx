import React from 'react';
import { Card } from './common/Card';

interface HabitTrackerProps {
  streak: number;
  isLoggedToday: boolean;
  onLogHabit: () => void;
}

const FireIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.C14.05 1.5 15.5 1.5 16 3.5c.5 2 .5 4 .5 6.5A8 8 0 0117.657 18.657z" />
    </svg>
);


const HabitTracker: React.FC<HabitTrackerProps> = ({ streak, isLoggedToday, onLogHabit }) => {
    return (
        <Card title="Daily Habit Streak" icon={<FireIcon />}>
            <div className="text-center">
                <div className="flex items-center justify-center text-orange-400">
                     <p className="text-6xl font-bold">{streak}</p>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.83 2.25c.33-.24.77-.24 1.1 0 2.9 2.12 4.41 5.98 3.56 9.42-.45 1.79-1.5 3.36-2.91 4.52-1.42 1.16-3.19 1.81-5.08 1.81-1.61 0-3.13-.5-4.4-1.4-.4-.28-.55-.83-.3-1.23.25-.4.8-.55 1.2-.3 1.43.98 3.26 1.13 4.9.43 1.7-.73 2.8-2.38 2.8-4.3 0-1.83-1.07-3.41-2.78-4.22-.63-.3-1.3-.57-2-.78l-.32-.1c-.13-.04-.26-.09-.39-.13-.33-.12-.65-.26-.95-.43-.22-.12-.43-.26-.63-.41-.35-.25-.66-.54-.91-.88-.28-.37-.43-.81-.43-1.28 0-.58.26-1.12.7-1.48.18-.15.38-.27.59-.36.21-.09.43-.16.66-.22.45-.11.91-.17 1.39-.17.55 0 1.09.08 1.6.24.4.12.8.3 1.15.51z" />
                    </svg>
                </div>
                <p className="text-slate-400 mb-4">{streak > 0 ? `day streak!` : 'Log your first habit to start a streak!'}</p>
                
                {isLoggedToday ? (
                     <div className="bg-green-500/20 text-green-300 font-bold py-2 px-4 rounded-lg">
                        Habit logged for today! Great job!
                    </div>
                ) : (
                    <button 
                        onClick={onLogHabit} 
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
                    >
                        Log Daily Habit (e.g., Oil Pulling)
                    </button>
                )}
            </div>
        </Card>
    );
};

export default HabitTracker;
