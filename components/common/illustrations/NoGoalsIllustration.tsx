import React from 'react';

export const NoGoalsIllustration: React.FC<{ className?: string }> = ({ className = 'w-32 h-32' }) => (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="noGoalsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(200, 100%, 50%)" />
                <stop offset="100%" stopColor="hsl(200, 100%, 30%)" />
            </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.1"/>
        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
        
        {/* Abstract Flag/Target */}
        <path d="M80 80 H120 V120 H100 Z" fill="url(#noGoalsGrad)" opacity="0.8"/>
        <path d="M100 120 V 60" stroke="url(#noGoalsGrad)" strokeWidth="6" strokeLinecap="round" />
        <circle cx="100" cy="50" r="10" fill="url(#noGoalsGrad)" />
    </svg>
);