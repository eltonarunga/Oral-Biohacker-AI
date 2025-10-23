import React from 'react';
import { Page, UserProfile } from '../types';

interface HeaderProps {
    page: Page;
    onNavigate: (page: Page) => void;
    onToggleSidebar: () => void;
    user: UserProfile;
}

const pageTitles: Record<Page, string> = {
    'dashboard': 'Dashboard',
    'plan': 'Your Biohacking Plan',
    'symptom-checker': 'Symptom Checker',
    'education': 'Education',
    'find-dentist': 'Find a Dentist',
    'smile-design-studio': 'Smile Design Studio',
    'profile': 'Profile',
    'habit-history': 'Habit History',
    'diet-log': 'Daily Diet Log',
    'habit-management': 'Manage Habits',
    'ai-assistant': 'AI Assistant',
};

const Header: React.FC<HeaderProps> = ({ page, onNavigate, onToggleSidebar, user }) => {
  const title = pageTitles[page] || 'Dashboard';

  return (
    <header className="sticky top-0 z-10 p-2">
        <div className="glass-card flex h-14 items-center justify-between px-4 sm:px-6 rounded-lg">
            <div className="flex w-12 items-center">
                <button 
                  onClick={onToggleSidebar}
                  className="flex h-12 w-12 items-center justify-center rounded-full text-subtle-light dark:text-subtle-dark hover:text-foreground-light dark:hover:text-foreground-dark lg:hidden"
                  aria-label="Open menu"
                >
                    <span className="material-symbols-outlined"> menu </span>
                </button>
            </div>
            <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-foreground-light dark:text-foreground-dark">{title}</h1>
            <div className="flex min-w-12 items-center justify-end">
                <button 
                    onClick={() => onNavigate('profile')} 
                    className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    aria-label="View profile"
                >
                    <span className="hidden sm:block text-sm font-semibold text-foreground-light dark:text-foreground-dark">{user.name.split(' ')[0]}</span>
                    <img src={user.avatarUrl} alt={`${user.name}'s avatar`} className="size-8 rounded-full object-cover" />
                </button>
            </div>
      </div>
    </header>
  );
};

export default Header;