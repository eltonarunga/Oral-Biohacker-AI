import React from 'react';

export const NoPlanIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-48' }) => (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="noPlanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(200, 100%, 50%)" />
                <stop offset="100%" stopColor="hsl(200, 100%, 30%)" />
            </linearGradient>
            <filter id="noPlanGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <rect x="40" y="30" width="120" height="150" rx="15" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.1"/>
        <path d="M60 60h80 M60 85h80 M60 110h50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.1"/>

        <circle cx="100" cy="110" r="40" fill="url(#noPlanGrad)" opacity="0.1" filter="url(#noPlanGlow)"/>
        
        <g transform="translate(100 110)">
            <path d="M-20 -20 L 20 20 M20 -20 L -20 20" stroke="url(#noPlanGrad)" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
            <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="90 0 0" dur="4s" repeatCount="indefinite" />
        </g>
        
        <circle cx="100" cy="110" r="30" fill="url(#noPlanGrad)"/>
        <path d="M90 110 L110 110 M100 100 L100 120" stroke="white" strokeWidth="5" strokeLinecap="round"/>
    </svg>
);