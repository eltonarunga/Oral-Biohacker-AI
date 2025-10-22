import React, { forwardRef } from 'react';

// ==================== TYPES ====================

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  as?: 'div' | 'article' | 'section';
  padding?: 'default' | 'none';
}

// ==================== COMPONENT ====================

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className = '',
      title,
      icon,
      headerAction,
      as: Component = 'div',
      padding = 'default',
    },
    ref
  ) => {
    const hasHeader = !!(title || icon || headerAction);
    const paddingClass = padding === 'default' ? 'p-4 sm:p-6' : '';

    const cardClasses = [
      'glass-card rounded-xl shadow-lg',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const cardProps = {
      ref,
      className: cardClasses,
    };

    return (
      <Component {...cardProps}>
        {hasHeader && (
          <CardHeader
            title={title}
            icon={icon}
            headerAction={headerAction}
          />
        )}
        <div className={paddingClass}>{children}</div>
      </Component>
    );
  }
);

Card.displayName = 'Card';

// ==================== SUB-COMPONENTS ====================

interface CardHeaderProps {
  title?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ title, icon, headerAction }) => {
  return (
    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border-light dark:border-border-dark">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="text-primary flex-shrink-0">
            {icon}
          </div>
        )}
        {title && (
          <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark truncate">
            {title}
          </h2>
        )}
      </div>
      {headerAction && <div className="ml-4 flex-shrink-0">{headerAction}</div>}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`mt-4 pt-4 border-t border-border-light dark:border-border-dark ${className}`}
    >
      {children}
    </div>
  );
};
