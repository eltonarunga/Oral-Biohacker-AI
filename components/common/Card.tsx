import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, icon }) => {
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-2xl shadow-sm p-6 ${className}`}>
      {title && (
        <div className="flex items-center mb-4">
          {icon && <div className="mr-3 text-blue-600">{icon}</div>}
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
};