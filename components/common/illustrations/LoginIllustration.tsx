import React from 'react';

export const LoginIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 500 500" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="loginGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(200, 100%, 50%)" />
        <stop offset="100%" stopColor="hsl(200, 100%, 30%)" />
      </linearGradient>
      <linearGradient id="loginGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="hsl(200, 100%, 80%)" />
        <stop offset="100%" stopColor="hsl(200, 100%, 50%)" />
      </linearGradient>
       <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
        <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="250" cy="250" r="200" fill="url(#loginGrad1)" opacity="0.1" filter="url(#glow)" />
    
    <path d="M150 150 Q250 50, 350 150 T150 350 Q250 450, 350 350 T150 150 Z" fill="none" stroke="url(#loginGrad1)" strokeWidth="2" />
    
    <path d="M100,250 C100,167.157 167.157,100 250,100" fill="none" stroke="url(#loginGrad2)" strokeWidth="20" strokeLinecap="round" transform="rotate(45 250 250)" />
    <path d="M400,250 C400,332.843 332.843,400 250,400" fill="none" stroke="url(#loginGrad1)" strokeWidth="20" strokeLinecap="round" transform="rotate(45 250 250)" />
    
    <circle cx="120" cy="180" r="15" fill="url(#loginGrad2)" />
    <circle cx="380" cy="320" r="15" fill="url(#loginGrad1)" />
    
    <g transform="translate(250, 250)">
        <path d="M-50 -20 Q0 -70, 50 -20" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="-25" cy="-35" r="8" fill="white" />
        <circle cx="25" cy="-35" r="8" fill="white" />
    </g>
  </svg>
);