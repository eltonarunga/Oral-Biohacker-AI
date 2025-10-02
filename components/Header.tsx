
import React from 'react';
import { Page } from '../types';

interface HeaderProps {
    page: Page;
    onNavigate: (page: Page) => void;
    onToggleSidebar: () => void;
}

const pageTitles: Record<Page, string> = {
    'dashboard': 'Dashboard',
    'plan': 'Your Biohacking Plan',
    'symptom-checker': 'Symptom Checker',
    'education': 'Education',
    'find-dentist': 'Find a Dentist',
    'smile-design-studio': 'Smile Design Studio',
    'profile': 'Profile',
    'habit-history': 'Habit History'
};

const Header: React.FC<HeaderProps> = ({ page, onNavigate, onToggleSidebar }) => {
  const title = pageTitles[page] || 'Dashboard';
  const showBackButton = ['habit-history'].includes(page);
  const showMenuButton = !showBackButton;

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex w-12 items-center">
            {showBackButton && (
                <button onClick={() => onNavigate('dashboard')} className="flex h-12 w-12 items-center justify-center rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" aria-label="Go back">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
            )}
             {showMenuButton && (
                <button 
                  onClick={onToggleSidebar}
                  className="flex h-12 w-12 items-center justify-center rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white lg:hidden"
                  aria-label="Open menu"
                >
                    <span className="material-symbols-outlined"> menu </span>
                </button>
            )}
        </div>
        <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-gray-50">{title}</h1>
        <div className="flex w-12 items-center justify-end">
            {/* Right side of header is kept for potential future icons like notifications */}
        </div>
      </div>
    </header>
  );
};

export default Header;