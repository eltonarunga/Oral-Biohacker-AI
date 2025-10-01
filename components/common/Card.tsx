import React, { forwardRef } from 'react';

// ==================== TYPES ====================

type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';
type CardSize = 'sm' | 'md' | 'lg';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  hoverable?: boolean;
  onClick?: () => void;
  as?: 'div' | 'article' | 'section';
  role?: string;
  ariaLabel?: string;
}

// ==================== VARIANT STYLES ====================

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-sm',
  elevated: 'bg-white dark:bg-slate-800 border-0 shadow-lg',
  outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-600 shadow-none',
  flat: 'bg-gray-50 dark:bg-slate-800 border-0 shadow-none',
};

const sizeStyles: Record<CardSize, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const hoverStyles = 'transition-all duration-200 hover:shadow-md hover:scale-[1.01] cursor-pointer';

// ==================== COMPONENT ====================

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className = '',
      title,
      subtitle,
      icon,
      headerAction,
      variant = 'default',
      size = 'md',
      hoverable = false,
      onClick,
      as: Component = 'div',
      role,
      ariaLabel,
    },
    ref
  ) => {
    // FIX: Ensure `hasHeader` is a boolean to match the `CardContentProps` type.
    const hasHeader = !!(title || subtitle || icon || headerAction);
    const isInteractive = hoverable || onClick;

    const cardClasses = [
      'rounded-2xl',
      variantStyles[variant],
      sizeStyles[size],
      isInteractive && hoverStyles,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const cardProps = {
      ref,
      className: cardClasses,
      onClick: onClick,
      role: role || (onClick ? 'button' : undefined),
      'aria-label': ariaLabel,
      tabIndex: onClick ? 0 : undefined,
      onKeyDown:
        onClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined,
    };

    return (
      <Component {...cardProps}>
        {hasHeader && (
          <CardHeader
            title={title}
            subtitle={subtitle}
            icon={icon}
            headerAction={headerAction}
          />
        )}
        <CardContent hasHeader={hasHeader}>{children}</CardContent>
      </Component>
    );
  }
);

Card.displayName = 'Card';

// ==================== SUB-COMPONENTS ====================

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, icon, headerAction }) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-start flex-1 min-w-0">
        {icon && (
          <div className="mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {headerAction && <div className="ml-4 flex-shrink-0">{headerAction}</div>}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  hasHeader: boolean;
}

const CardContent: React.FC<CardContentProps> = ({ children, hasHeader }) => {
  return <div className={hasHeader ? '' : ''}>{children}</div>;
};

// ==================== ADDITIONAL CARD COMPONENTS ====================

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
};

interface CardSectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const CardSection: React.FC<CardSectionProps> = ({
  children,
  title,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {title && (
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

interface CardGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({ children, cols = 3, className = '' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return <div className={`grid ${gridCols[cols]} gap-4 ${className}`}>{children}</div>;
};

// ==================== EXAMPLE USAGE (for documentation) ====================

/*
// Basic usage
<Card title="My Card">
  <p>Card content</p>
</Card>

// With all features
<Card
  title="Advanced Card"
  subtitle="This is a subtitle"
  icon={<Icon />}
  headerAction={<button>Action</button>}
  variant="elevated"
  size="lg"
  hoverable
  onClick={() => console.log('clicked')}
>
  <p>Content</p>
  <CardFooter>
    <button>Footer Action</button>
  </CardFooter>
</Card>

// Grid layout
<CardGrid cols={3}>
  <Card title="Card 1">Content 1</Card>
  <Card title="Card 2">Content 2</Card>
  <Card title="Card 3">Content 3</Card>
</CardGrid>

// Sections within card
<Card title="Profile">
  <CardSection title="Personal Info">
    <p>Name: John Doe</p>
  </CardSection>
  <CardSection title="Contact">
    <p>Email: john@example.com</p>
  </CardSection>
</Card>
*/