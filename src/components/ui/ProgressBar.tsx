/**
 * ProgressBar Component
 * 
 * Progress indicator with determinate and indeterminate modes.
 * Smooth animation with reduced-motion support.
 * Migrated to shadcn Progress with semantic colors.
 * 
 * Usage:
 * ```tsx
 * // Determinate (known progress)
 * <ProgressBar value={75} max={100} label="Uploading..." />
 * 
 * // Indeterminate (unknown progress)
 * <ProgressBar indeterminate label="Processing..." />
 * ```
 */

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useEffect, useState } from 'react';
import { Progress } from './progress';
import { cn } from '@/lib/utils';
import '../../styles/animations.css';

interface ProgressBarProps {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  /** @deprecated No longer needed - uses Tailwind dark: variants */
  isDarkMode?: boolean;
}

export function ProgressBar({
  value = 0,
  max = 100,
  indeterminate = false,
  label,
  showPercentage = false,
  size = 'md',
  variant = 'default',
  className = '',
}: ProgressBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  // Smooth animation for value changes
  useEffect(() => {
    if (indeterminate || prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    const duration = 300;
    const steps = 30;
    const stepValue = (value - displayValue) / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue((prev) => prev + stepValue);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [value, indeterminate, prefersReducedMotion, displayValue]);

  const percentage = Math.min(Math.max((displayValue / max) * 100, 0), 100);

  const sizeConfig = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: '[&>*]:bg-primary',
    success: '[&>*]:bg-green-600',
    warning: '[&>*]:bg-yellow-600',
    danger: '[&>*]:bg-destructive',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-foreground">
              {label}
            </span>
          )}
          {showPercentage && !indeterminate && (
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {indeterminate ? (
        <div
          className={cn(
            'w-full rounded-full overflow-hidden bg-primary/20',
            sizeConfig[size]
          )}
          role="progressbar"
          aria-label={label}
        >
          <div className="progress-indeterminate h-full relative">
            <div
              className={cn(
                'absolute inset-y-0 left-0 w-1/3',
                variant === 'success' && 'bg-green-600',
                variant === 'warning' && 'bg-yellow-600',
                variant === 'danger' && 'bg-destructive',
                variant === 'default' && 'bg-primary',
                !prefersReducedMotion && 'animate-progress-indeterminate'
              )}
              style={
                !prefersReducedMotion
                  ? { animation: 'progress-indeterminate 1.5s ease-in-out infinite' }
                  : { left: '33%' }
              }
            />
          </div>
        </div>
      ) : (
        <Progress
          value={percentage}
          className={cn(
            sizeConfig[size],
            variantClasses[variant]
          )}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        />
      )}
    </div>
  );
}

/**
 * CircularProgress Component
 * Circular progress indicator using semantic colors
 */
interface CircularProgressProps {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  indeterminate?: boolean;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  /** @deprecated No longer needed - uses Tailwind dark: variants */
  isDarkMode?: boolean;
}

export function CircularProgress({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  indeterminate = false,
  showPercentage = true,
  variant = 'default',
  className = '',
}: CircularProgressProps) {
  const prefersReducedMotion = useReducedMotion();
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const variantColors = {
    default: 'hsl(var(--primary))',
    success: '#10b981',
    warning: '#f59e0b',
    danger: 'hsl(var(--destructive))',
  };

  const strokeColor = variantColors[variant];

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className={!prefersReducedMotion && indeterminate ? 'animate-spin' : ''}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />

        {!indeterminate && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className={!prefersReducedMotion ? 'transition-all duration-300 ease-out' : ''}
          />
        )}

        {indeterminate && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference * 0.75}
            strokeLinecap="round"
          />
        )}
      </svg>

      {showPercentage && !indeterminate && (
        <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}
