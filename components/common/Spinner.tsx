import React from 'react';

// ==================== TYPES ====================

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'white';

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  label?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

// ==================== STYLE CONFIGURATIONS ====================

const sizeStyles: Record<SpinnerSize, { spinner: string; text: string }> = {
  xs: { spinner: 'h-4 w-4 border-2', text: 'text-xs' },
  sm: { spinner: 'h-6 w-6 border-2', text: 'text-sm' },
  md: { spinner: 'h-8 w-8 border-2', text: 'text-base' },
  lg: { spinner: 'h-12 w-12 border-[3px]', text: 'text-lg' },
  xl: { spinner: 'h-16 w-16 border-4', text: 'text-xl' },
};

const variantStyles: Record<SpinnerVariant, string> = {
  primary: 'border-blue-600 dark:border-cyan-400 border-t-transparent',
  secondary: 'border-gray-600 dark:border-gray-400 border-t-transparent',
  success: 'border-green-600 dark:border-green-400 border-t-transparent',
  warning: 'border-yellow-600 dark:border-yellow-400 border-t-transparent',
  error: 'border-red-600 dark:border-red-400 border-t-transparent',
  white: 'border-white border-t-transparent',
};

// ==================== MAIN COMPONENT ====================

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className = '',
  label,
  fullScreen = false,
  overlay = false,
}) => {
  const spinnerClasses = [
    'animate-spin rounded-full',
    sizeStyles[size].spinner,
    variantStyles[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const spinnerElement = (
    <div
      className={spinnerClasses}
      role="status"
      aria-label={label || 'Loading'}
      aria-live="polite"
    >
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  );

  const fullScreenOrOverlayClasses =
    'fixed inset-0 z-50 flex items-center justify-center';

  if (fullScreen) {
    return (
      <div className={`${fullScreenOrOverlayClasses} bg-slate-900 flex-col gap-4`}>
        {spinnerElement}
        {label && <p className={`font-semibold text-white ${sizeStyles[size].text}`}>{label}</p>}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className={`${fullScreenOrOverlayClasses} bg-black/50 flex-col gap-4`}>
        {spinnerElement}
        {label && <p className={`font-semibold text-white ${sizeStyles[size].text}`}>{label}</p>}
      </div>
    );
  }

  if (label) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        {spinnerElement}
        <p className={`font-medium text-gray-700 dark:text-gray-300 ${sizeStyles[size].text}`}>{label}</p>
      </div>
    );
  }

  return spinnerElement;
};
