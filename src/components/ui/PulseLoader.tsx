/**
 * PulseLoader Component
 * 
 * Lightweight inline loading indicator with pulse animation.
 * Perfect for text-based loading states.
 * 
 * Usage:
 * ```tsx
 * <PulseLoader />
 * <PulseLoader size="sm" color="blue" />
 * <PulseLoader size="lg" dots={5} />
 * ```
 */

import { useReducedMotion } from '../../hooks/useReducedMotion';
import '../../styles/animations.css';

interface PulseLoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'white';
  dots?: number;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
  inline?: boolean;
}

export function PulseLoader({
  size = 'md',
  color = 'blue',
  dots = 3,
  speed = 'normal',
  className = '',
  inline = false,
}: PulseLoaderProps) {
  const prefersReducedMotion = useReducedMotion();

  // Size configurations
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

  // Color configurations
  const colorConfig = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    gray: 'bg-gray-500',
    white: 'bg-white',
  };

  // Speed configurations (animation duration)
  const speedConfig = {
    slow: '1.4s',
    normal: '1s',
    fast: '0.6s',
  };

  const animationDuration = speedConfig[speed];

  return (
    <div
      className={`
        flex items-center
        ${gapConfig[size]}
        ${inline ? 'inline-flex' : ''}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: dots }).map((_, index) => (
        <div
          key={index}
          className={`
            ${sizeConfig[size]}
            ${colorConfig[color]}
            rounded-full
            ${!prefersReducedMotion ? 'animate-pulse' : 'opacity-60'}
          `}
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
 * Horizontal bar loading indicator
 */
interface BarLoaderProps {
  width?: number | string;
  height?: number;
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
  isDarkMode?: boolean;
}

export function BarLoader({
  width = '100%',
  height = 4,
  color,
  speed = 'normal',
  className = '',
  isDarkMode = true,
}: BarLoaderProps) {
  const prefersReducedMotion = useReducedMotion();

  const defaultColor = color || (isDarkMode ? '#3b82f6' : '#2563eb');

  const speedConfig = {
    slow: '2s',
    normal: '1.5s',
    fast: '1s',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{
        width,
        height,
        backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
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
 * Spinning clock hand loader
 */
interface ClockLoaderProps {
  size?: number;
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export function ClockLoader({
  size = 40,
  color = '#3b82f6',
  speed = 'normal',
  className = '',
}: ClockLoaderProps) {
  const prefersReducedMotion = useReducedMotion();

  const speedConfig = {
    slow: '2s',
    normal: '1s',
    fast: '0.6s',
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      {/* Clock circle */}
      <div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: `${color}40` }}
      />

      {/* Clock hand */}
      <div
        className={`absolute top-1/2 left-1/2 origin-left ${!prefersReducedMotion ? 'animate-spin' : ''}`}
        style={{
          width: size / 2 - 4,
          height: 2,
          backgroundColor: color,
          transformOrigin: '0% 50%',
          animation: !prefersReducedMotion ? `spin ${speedConfig[speed]} linear infinite` : 'none',
        }}
      />

      {/* Center dot */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 6,
          height: 6,
          backgroundColor: color,
        }}
      />

      <span className="sr-only">Loading...</span>
    </div>
  );
}
