/**
 * PulseLoader Component
 * 
 * Lightweight inline loading indicator with pulse animation.
 * Perfect for text-based loading states.
 * Migrated to use semantic colors instead of hardcoded values.
 * 
 * Usage:
 * ```tsx
 * <PulseLoader />
 * <PulseLoader size="sm" color="success" />
 * <PulseLoader size="lg" dots={5} />
 * ```
 */

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface PulseLoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'destructive' | 'muted' | 'white';
  dots?: number;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
  inline?: boolean;
}

export function PulseLoader({
  size = 'md',
  color = 'primary',
  dots = 3,
  speed = 'normal',
  className = '',
  inline = false,
}: PulseLoaderProps) {
  const prefersReducedMotion = useReducedMotion();

  const sizeConfig = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const gapConfig = {
    xs: 'gap-0.5',
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  };

  const colorConfig = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    destructive: 'bg-destructive',
    muted: 'bg-muted-foreground',
    white: 'bg-white',
  };

  const speedConfig = {
    slow: '1.4s',
    normal: '1s',
    fast: '0.6s',
  };

  const animationDuration = speedConfig[speed];

  return (
    <div
      className={cn(
        'flex items-center',
        gapConfig[size],
        inline && 'inline-flex',
        className
      )}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: dots }).map((_, index) => (
        <div
          key={index}
          className={cn(
            sizeConfig[size],
            colorConfig[color],
            'rounded-full',
            !prefersReducedMotion ? 'animate-pulse' : 'opacity-60'
          )}
          style={
            !prefersReducedMotion
              ? {
                  animationDuration,
                  animationDelay: `${index * 150}ms`,
                }
              : undefined
          }
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * BarLoader Component
 * Horizontal bar loading indicator using semantic colors
 */
interface BarLoaderProps {
  width?: number | string;
  height?: number;
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
  /** @deprecated No longer needed - uses Tailwind dark: variants */
  isDarkMode?: boolean;
}

export function BarLoader({
  width = '100%',
  height = 4,
  color,
  speed = 'normal',
  className = '',
}: BarLoaderProps) {
  const prefersReducedMotion = useReducedMotion();

  const defaultColor = color || 'hsl(var(--primary))';

  const speedConfig = {
    slow: '2s',
    normal: '1.5s',
    fast: '1s',
  };

  return (
    <div
      className={cn('relative overflow-hidden rounded-full bg-primary/20', className)}
      style={{
        width,
        height,
      }}
      role="status"
      aria-label="Loading"
    >
      {!prefersReducedMotion ? (
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: '50%',
            backgroundColor: defaultColor,
            animation: `progress-indeterminate ${speedConfig[speed]} ease-in-out infinite`,
          }}
        />
      ) : (
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: '50%',
            left: '25%',
            backgroundColor: defaultColor,
            opacity: 0.6,
          }}
        />
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * ClockLoader Component
 * Spinning clock hand loader using semantic colors
 */
interface ClockLoaderProps {
  size?: number;
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export function ClockLoader({
  size = 40,
  color,
  speed = 'normal',
  className = '',
}: ClockLoaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const defaultColor = color || 'hsl(var(--primary))';

  const speedConfig = {
    slow: '2s',
    normal: '1s',
    fast: '0.6s',
  };

  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      <div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: `${defaultColor}40` }}
      />

      <div
        className={cn(
          'absolute top-1/2 left-1/2 origin-left',
          !prefersReducedMotion && 'animate-spin'
        )}
        style={{
          width: size / 2 - 4,
          height: 2,
          backgroundColor: defaultColor,
          transformOrigin: '0% 50%',
          animation: !prefersReducedMotion ? `spin ${speedConfig[speed]} linear infinite` : 'none',
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 6,
          height: 6,
          backgroundColor: defaultColor,
        }}
      />

      <span className="sr-only">Loading...</span>
    </div>
  );
}
