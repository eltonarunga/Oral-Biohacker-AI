import React from 'react';
import { Page } from '../types';

interface HeaderProps {
    page: Page;
    onNavigate: (page: Page) => void;
    onLogout: () => void;
}

const pageTitles: Record<Page, string> = {
    'dashboard': 'Dashboard',
    'plan': 'Your Biohacking Plan',
    'symptom-checker': 'Symptom Checker',
    'education': 'Education',
    'find-dentist': 'Find a Dentist',
    'smile-design-studio': 'Smile Design Studio',
    'profile': 'Profile'
};

const Header: React.FC<HeaderProps> = ({ page, onNavigate, onLogout }) => {
  const title = pageTitles[page] || 'Dashboard';

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center p-4 pb-2 justify-between">
        <div className="flex w-12 items-center">
            <button 
              onClick={onLogout}
              className="flex items-center justify-center rounded-xl h-12 text-gray-500 hover:text-gray-900"
              aria-label="Sign Out"
            >
                <span className="material-symbols-outlined"> logout </span>
            </button>
        </div>
        <h1 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">{title}</h1>
        <div className="flex w-12 items-center justify-end">
            <button 
              onClick={() => onNavigate('profile')}
              className="flex items-center justify-center rounded-xl h-12 text-gray-900"
              aria-label="Open settings"
            >
                <span className="material-symbols-outlined"> settings </span>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;