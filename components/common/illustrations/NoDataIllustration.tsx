import React from 'react';

export const NoDataIllustration: React.FC<{ className?: string }> = ({ className = 'w-40 h-40' }) => (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="noDataGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(200, 100%, 50%)" />
                <stop offset="100%" stopColor="hsl(200, 100%, 30%)" />
            </linearGradient>
        </defs>
        <rect x="30" y="30" width="140" height="140" rx="20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.1"/>
        <path d="M70 60 L 130 140 M 130 60 L 70 140" stroke="url(#noDataGrad)" strokeWidth="6" strokeLinecap="round" opacity="0.3"/>
        <circle cx="100" cy="100" r="10" fill="url(#noDataGrad)"/>
    </svg>
);