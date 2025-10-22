

import React from 'react';
import { Page } from '../types';

interface BottomNavProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: string }[] = [
    { page: 'dashboard', label: 'Home', icon: 'dashboard' },
    { page: 'symptom-checker', label: 'Checker', icon: 'medical_services' },
    { page: 'ai-assistant', label: 'Assistant', icon: 'mic' },
    { page: 'profile', label: 'Profile', icon: 'person' },
];

const NavItem: React.FC<{
    page: Page;
    label: string;
    icon: string;
    isActive: boolean;
    onClick: (page: Page) => void;
}> = ({ page, label, icon, isActive, onClick }) => {
    const activeClasses = 'text-primary';
    const inactiveClasses = 'text-subtle-light dark:text-subtle-dark hover:text-foreground-light dark:hover:text-foreground-dark';
    
    // Dynamically change icon style based on active state
    const iconStyle = {
      fontVariationSettings: `'FILL' ${isActive ? 1 : 0}, 'wght' 400`,
    };

    return (
        <button
            onClick={() => onClick(page)}
            className={`flex flex-col items-center justify-center flex-1 pt-2 pb-1 transition-colors ${isActive ? activeClasses : inactiveClasses}`}
            aria-current={isActive ? 'page' : undefined}
        >
            <span className="material-symbols-outlined" style={iconStyle}>{icon}</span>
            <span className="text-xs font-medium mt-1">{label}</span>
        </button>
    );
};

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-20 p-2 lg:hidden">
            <div className="glass-card flex justify-around h-16 rounded-xl">
                {navItems.map(item => (
                    <NavItem
                        key={item.page}
                        page={item.page}
                        label={item.label}
                        icon={item.icon}
                        isActive={currentPage === item.page}
                        onClick={onNavigate}
                    />
                ))}
            </div>
        </nav>
    );
};