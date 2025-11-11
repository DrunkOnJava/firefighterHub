/**
 * Spinner Component
 * 
 * Loading spinner with multiple variants and sizes.
 * Respects prefers-reduced-motion (shows static indicator).
 * Migrated to use Loader2 icon and semantic colors.
 * 
 * Usage:
 * ```tsx
 * <Spinner size="md" variant="primary" />
 * <Spinner size="lg" variant="border" label="Loading..." />
 * ```
 */

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'border' | 'dots' | 'pulse';
  color?: string;
  label?: string;
  className?: string;
  fullScreen?: boolean;
  /** @deprecated No longer needed - uses Tailwind dark: variants */
  isDarkMode?: boolean;
}

export function Spinner({
  size = 'md',
  variant = 'primary',
  color,
  label,
  className = '',
  fullScreen = false,
}: SpinnerProps) {
  const prefersReducedMotion = useReducedMotion();

  const sizeConfig = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const variantClasses = {
    primary: 'text-primary',
    secondary: 'text-muted-foreground',
    border: 'text-foreground',
    dots: 'bg-primary',
    pulse: 'bg-primary',
  };

  const spinnerColor = color || variantClasses[variant];

  if (variant === 'border' || variant === 'primary' || variant === 'secondary') {
    const spinner = (
      <Loader2
        className={cn(
          sizeConfig[size],
          spinnerColor,
          !prefersReducedMotion ? 'animate-spin' : 'opacity-60',
          className
        )}
        role="status"
        aria-label={label || 'Loading'}
      >
        <span className="sr-only">{label || 'Loading...'}</span>
      </Loader2>
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
        className={cn('flex items-center gap-1.5', className)}
        role="status"
        aria-label={label || 'Loading'}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              dotSizes[size],
              'rounded-full',
              spinnerColor,
              !prefersReducedMotion ? 'animate-pulse' : 'opacity-60'
            )}
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

  if (variant === 'pulse') {
    return (
      <div
        className={cn(
          sizeConfig[size],
          'rounded-full',
          spinnerColor,
          !prefersReducedMotion ? 'animate-pulse' : 'opacity-60',
          className
        )}
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
  /** @deprecated No longer needed - uses Tailwind dark: variants */
  isDarkMode?: boolean;
}

export function SpinnerOverlay({
  isOpen,
  label = 'Loading...',
  size = 'lg',
}: SpinnerOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-card text-card-foreground rounded-xl p-8 flex flex-col items-center gap-4 shadow-2xl">
        <Spinner size={size} variant="primary" />
        {label && (
          <p className="text-sm font-medium">{label}</p>
        )}
      </div>
    </div>
  );
}
