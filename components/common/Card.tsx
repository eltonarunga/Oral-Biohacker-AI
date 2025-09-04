import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, icon }) => {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:scale-[1.02] hover:border-cyan-400/50 ${className}`}>
      {title && (
        <div className="flex items-center mb-4">
          {icon && <div className="mr-3 text-cyan-400">{icon}</div>}
          <h2 className="text-xl font-bold text-gray-100">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
};
