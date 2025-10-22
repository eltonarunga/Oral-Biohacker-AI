import React from 'react';

export const LocationSearchIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-48' }) => (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="locGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(200, 100%, 50%)" />
                <stop offset="100%" stopColor="hsl(200, 100%, 30%)" />
            </linearGradient>
             <filter id="locGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <path d="M50 80 C 50 30, 150 30, 150 80 C 150 120, 100 170, 100 170 C 100 170, 50 120, 50 80 Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
        <circle cx="100" cy="80" r="30" fill="url(#locGrad)" opacity="0.1" filter="url(#locGlow)" />
        <circle cx="100" cy="80" r="25" fill="url(#locGrad)"/>
        <circle cx="100" cy="80" r="10" fill="white"/>
    </svg>
);