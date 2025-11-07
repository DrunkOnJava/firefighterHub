/**
 * Skeleton Component
 * 
 * Loading placeholder that matches final content layout.
 * Features shimmer animation that respects reduced motion.
 * 
 * Usage:
 * ```tsx
 * <Skeleton className="h-20 w-full rounded-lg" />
 * <Skeleton variant="circle" size={48} />
 * <Skeleton variant="text" lines={3} />
 * ```
 */

import { useReducedMotion } from '../../hooks/useReducedMotion';
import '../../styles/animations.css';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
  size?: number; // For circles
  lines?: number; // For text variant
  isDarkMode?: boolean;
}

export function Skeleton({
  className = '',
  variant = 'rect',
  width,
  height,
  size,
  lines = 1,
  isDarkMode = true,
}: SkeletonProps) {
  const prefersReducedMotion = useReducedMotion();

  const baseClasses = prefersReducedMotion
    ? isDarkMode
      ? 'bg-gray-700'
      : 'bg-gray-200'
    : isDarkMode
    ? 'skeleton-dark'
    : 'skeleton';

  // Circle variant
  if (variant === 'circle') {
    const circleSize = size || 40;
    return (
      <div
        className={`${baseClasses} rounded-full ${className}`}
        style={{
          width: circleSize,
          height: circleSize,
        }}
        aria-hidden="true"
      />
    );
  }

  // Text variant (multiple lines)
  if (variant === 'text') {
    return (
      <div className="space-y-2" aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} h-4 rounded ${className}`}
            style={{
              width: i === lines - 1 ? '80%' : '100%', // Last line shorter
            }}
          />
        ))}
      </div>
    );
  }

  // Rectangle variant (default)
  return (
    <div
      className={`${baseClasses} rounded ${className}`}
      style={{
        width: width || '100%',
        height: height || '100%',
      }}
      aria-hidden="true"
    />
  );
}

/**
 * SkeletonCard Component
 * Pre-built skeleton for firefighter cards
 */
export function SkeletonCard({ isDarkMode = true }: { isDarkMode?: boolean }) {
  return (
    <div
      className={`
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        border-2 rounded-xl p-5 space-y-4
      `}
      aria-hidden="true"
    >
      {/* Header with avatar and name */}
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" size={48} isDarkMode={isDarkMode} />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-32" isDarkMode={isDarkMode} />
          <Skeleton className="h-4 w-20" isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" isDarkMode={isDarkMode} />
        <Skeleton className="h-6 w-20 rounded-full" isDarkMode={isDarkMode} />
      </div>

      {/* Details */}
      <Skeleton variant="text" lines={2} isDarkMode={isDarkMode} />

      {/* Actions */}
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1 rounded-lg" isDarkMode={isDarkMode} />
        <Skeleton className="h-10 flex-1 rounded-lg" isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}

/**
 * SkeletonTable Component
 * Pre-built skeleton for firefighter roster table
 */
export function SkeletonTable({
  rows = 5,
  columns = 6,
  isDarkMode = true,
}: {
  rows?: number;
  columns?: number;
  isDarkMode?: boolean;
}) {
  return (
    <div
      className={`
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
        rounded-xl border-2
        ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
        overflow-hidden
      `}
      aria-hidden="true"
    >
      {/* Header */}
      <div
        className={`
          ${isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-300'}
          border-b-2 px-4 py-3
          grid gap-4
        `}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-20" isDarkMode={isDarkMode} />
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-700">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="px-4 py-3 grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                className="h-4"
                width={colIndex === 0 ? '60%' : '80%'}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * SkeletonList Component
 * Pre-built skeleton for activity log or list views
 */
export function SkeletonList({
  items = 5,
  isDarkMode = true,
}: {
  items?: number;
  isDarkMode?: boolean;
}) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className={`
            ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
            border-2 rounded-lg p-4 flex items-start gap-3
          `}
        >
          <Skeleton variant="circle" size={40} isDarkMode={isDarkMode} />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" isDarkMode={isDarkMode} />
            <Skeleton className="h-4 w-full" isDarkMode={isDarkMode} />
          </div>
          <Skeleton className="h-4 w-16" isDarkMode={isDarkMode} />
        </div>
      ))}
    </div>
  );
}

/**
 * SkeletonCalendar Component
 * Pre-built skeleton for calendar grid
 */
export function SkeletonCalendar({ isDarkMode = true }: { isDarkMode?: boolean }) {
  return (
    <div
      className={`
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        border-2 rounded-xl p-6 space-y-4
      `}
      aria-hidden="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" isDarkMode={isDarkMode} />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded" isDarkMode={isDarkMode} />
          <Skeleton className="h-8 w-8 rounded" isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-6 rounded" isDarkMode={isDarkMode} />
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton
            key={i}
            className="aspect-square rounded"
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
}
