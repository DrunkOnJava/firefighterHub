/**
 * Spinner Component
 * 
 * Loading spinner with multiple variants and sizes.
 * Respects prefers-reduced-motion (shows static indicator).
 * 
 * Usage:
 * ```tsx
 * <Spinner size="md" variant="primary" />
 * <Spinner size="lg" variant="border" label="Loading..." />
 * ```
 */

import { useReducedMotion } from '../../hooks/useReducedMotion';
import '../../styles/animations.css';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'border' | 'dots' | 'pulse';
  color?: string;
  label?: string;
  className?: string;
  fullScreen?: boolean;
  isDarkMode?: boolean;
}

export function Spinner({
  size = 'md',
  variant = 'primary',
  color,
  label,
  className = '',
  fullScreen = false,
  isDarkMode = true,
}: SpinnerProps) {
  const prefersReducedMotion = useReducedMotion();

  // Size configurations
  const sizeConfig = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  // Default colors
  const defaultColors = {
    primary: isDarkMode ? 'border-blue-500' : 'border-blue-600',
    secondary: isDarkMode ? 'border-gray-400' : 'border-gray-500',
    border: isDarkMode ? 'border-white' : 'border-gray-900',
    dots: isDarkMode ? 'bg-blue-500' : 'bg-blue-600',
    pulse: isDarkMode ? 'bg-blue-500' : 'bg-blue-600',
  };

  const spinnerColor = color || defaultColors[variant];

  // Border spinner (default)
  if (variant === 'border' || variant === 'primary' || variant === 'secondary') {
    const spinner = (
      <div
        className={`
          ${sizeConfig[size]}
          rounded-full
          border-transparent
          ${spinnerColor}
          border-t-transparent
          ${!prefersReducedMotion ? 'animate-spin' : 'opacity-60'}
          ${className}
        `}
        role="status"
        aria-label={label || 'Loading'}
      >
        <span className="sr-only">{label || 'Loading...'}</span>
      </div>
    );

    if (fullScreen) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="flex flex-col items-center gap-3">
            {spinner}
            {label && (
              <p className="text-white text-sm font-medium">{label}</p>
            )}
          </div>
        </div>
      );
    }

    return spinner;
  }

  // Dots spinner
  if (variant === 'dots') {
    const dotSizes = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
    };

    return (
      <div
        className={`flex items-center gap-1.5 ${className}`}
        role="status"
        aria-label={label || 'Loading'}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`
              ${dotSizes[size]}
              rounded-full
              ${spinnerColor}
              ${
                !prefersReducedMotion
                  ? 'animate-pulse'
                  : 'opacity-60'
              }
            `}
            style={
              !prefersReducedMotion
                ? { animationDelay: `${i * 150}ms` }
                : undefined
            }
          />
        ))}
        <span className="sr-only">{label || 'Loading...'}</span>
      </div>
    );
  }

  // Pulse spinner
  if (variant === 'pulse') {
    return (
      <div
        className={`
          ${sizeConfig[size]}
          rounded-full
          ${spinnerColor}
          ${!prefersReducedMotion ? 'animate-pulse' : 'opacity-60'}
          ${className}
        `}
        role="status"
        aria-label={label || 'Loading'}
      >
        <span className="sr-only">{label || 'Loading...'}</span>
      </div>
    );
  }

  return null;
}

/**
 * SpinnerOverlay Component
 * Full-screen loading overlay with spinner
 */
interface SpinnerOverlayProps {
  isOpen: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isDarkMode?: boolean;
}

export function SpinnerOverlay({
  isOpen,
  label = 'Loading...',
  size = 'lg',
  isDarkMode = true,
}: SpinnerOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div
        className={`
          ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}
          rounded-xl p-8
          flex flex-col items-center gap-4
          shadow-2xl
        `}
      >
        <Spinner size={size} variant="primary" isDarkMode={isDarkMode} />
        {label && (
          <p className="text-sm font-medium">{label}</p>
        )}
      </div>
    </div>
  );
}
