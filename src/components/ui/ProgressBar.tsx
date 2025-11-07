/**
 * ProgressBar Component
 * 
 * Progress indicator with determinate and indeterminate modes.
 * Smooth animation with reduced-motion support.
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
  isDarkMode = true,
}: ProgressBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  // Smooth animation for value changes
  useEffect(() => {
    if (indeterminate || prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    const duration = 300; // ms
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

  // Size configurations
  const sizeConfig = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  // Variant colors
  const variantColors = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label and Percentage */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span
              className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {label}
            </span>
          )}
          {showPercentage && !indeterminate && (
            <span
              className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Track */}
      <div
        className={`
          w-full
          ${sizeConfig[size]}
          ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}
          rounded-full
          overflow-hidden
        `}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        {indeterminate ? (
          // Indeterminate mode - sliding bar
          <div className="progress-indeterminate h-full relative">
            <div
              className={`
                absolute inset-y-0 left-0 w-1/3
                ${variantColors[variant]}
                ${!prefersReducedMotion ? 'animate-progress-indeterminate' : ''}
              `}
              style={
                !prefersReducedMotion
                  ? { animation: 'progress-indeterminate 1.5s ease-in-out infinite' }
                  : { left: '33%' }
              }
            />
          </div>
        ) : (
          // Determinate mode - progress fill
          <div
            className={`
              h-full
              ${variantColors[variant]}
              ${!prefersReducedMotion ? 'transition-all duration-300 ease-out' : ''}
              rounded-full
            `}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
}

/**
 * CircularProgress Component
 * Circular progress indicator
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
  isDarkMode = true,
}: CircularProgressProps) {
  const prefersReducedMotion = useReducedMotion();
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const variantColors = {
    default: '#3b82f6', // blue-600
    success: '#10b981', // green-600
    warning: '#f59e0b', // yellow-600
    danger: '#ef4444', // red-600
  };

  const strokeColor = variantColors[variant];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className={!prefersReducedMotion && indeterminate ? 'animate-spin' : ''}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isDarkMode ? '#374151' : '#e5e7eb'}
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
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

        {/* Indeterminate circle */}
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

      {/* Percentage text */}
      {showPercentage && !indeterminate && (
        <div
          className={`
            absolute inset-0 flex items-center justify-center
            text-lg font-bold
            ${isDarkMode ? 'text-white' : 'text-gray-900'}
          `}
        >
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}
