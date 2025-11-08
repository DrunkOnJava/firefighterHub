/**
 * Skeleton Loading Components
 * Provides visual feedback while content is loading
 * Improves perceived performance and user experience
 */

import { colors, tokens, gridUtilities } from '../styles';

interface SkeletonProps {
  className?: string;
}

// Base skeleton element with shimmer animation
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] ${tokens.borders.radius.md} ${className}`}
      style={{
        animation: 'shimmer 2s infinite',
      }}
    />
  );
}

// Skeleton for calendar grid
export function CalendarSkeleton() {
  return (
    <div className={`border-2 ${tokens.borders.radius.xl} ${colors.components.card.shadow} overflow-hidden ${colors.structural.bg.card} ${colors.structural.border.default}`}>
      {/* Header */}
      <div className={`border-b-2 ${tokens.spacing.card.lg} ${colors.structural.bg.surface} ${colors.structural.border.default}`}>
        <div className={`flex items-center justify-between mb-6`}>
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            <Skeleton className={`w-12 h-12 ${tokens.borders.radius.xl}`} />
            <div>
              <Skeleton className="w-48 h-7 mb-2" />
              <Skeleton className="w-64 h-4" />
            </div>
          </div>
          <Skeleton className={`w-24 h-10 ${tokens.borders.radius.lg}`} />
        </div>

        <div className={`flex items-center justify-center ${tokens.spacing.gap.lg}`}>
          <Skeleton className={`w-10 h-10 ${tokens.borders.radius.lg}`} />
          <Skeleton className="w-64 h-9" />
          <Skeleton className={`w-10 h-10 ${tokens.borders.radius.lg}`} />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={tokens.spacing.card.lg}>
        {/* Weekday headers */}
        <div className={`${gridUtilities.calendar.weekdayHeader} mb-3`}>
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className={`h-10 ${tokens.borders.radius.lg}`} />
          ))}
        </div>

        {/* Calendar days */}
        <div className={gridUtilities.calendar.container}>
          {[...Array(35)].map((_, i) => (
            <Skeleton key={i} className={`h-32 ${tokens.borders.radius.xl}`} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={`border-t-2 ${tokens.spacing.card.lg} ${colors.structural.bg.surface} ${colors.structural.border.default}`}>
        <div className="flex items-center justify-between">
          <div className={`flex ${tokens.spacing.gap.lg}`}>
            <Skeleton className="w-32 h-6" />
            <Skeleton className="w-32 h-6" />
            <Skeleton className="w-24 h-6" />
          </div>
          <Skeleton className={`w-40 h-10 ${tokens.borders.radius.lg}`} />
        </div>
      </div>
    </div>
  );
}

// Skeleton for firefighter list
export function FirefighterListSkeleton() {
  return (
    <div className={`border-2 ${tokens.borders.radius.xl} ${colors.components.card.shadow} overflow-hidden ${colors.structural.bg.card} ${colors.structural.border.default}`}>
      {/* Header */}
      <div className={`border-b-2 ${tokens.spacing.card.lg} ${colors.structural.bg.surface} ${colors.structural.border.default}`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            <Skeleton className={`w-12 h-12 ${tokens.borders.radius.xl}`} />
            <Skeleton className="w-48 h-7" />
          </div>
          <Skeleton className={`w-32 h-10 ${tokens.borders.radius.lg}`} />
        </div>
      </div>

      {/* List items */}
      <div className={tokens.spacing.card.md}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`flex items-center justify-between ${tokens.spacing.card.md} mb-2 ${tokens.borders.radius.lg} ${colors.structural.bg.surface}`}
          >
            <div className={`flex items-center ${tokens.spacing.gap.md} flex-1`}>
              <Skeleton className="w-8 h-8 rounded" />
              <div className="flex-1">
                <Skeleton className="w-48 h-6 mb-2" />
                <Skeleton className="w-32 h-4" />
              </div>
            </div>
            <div className={`flex ${tokens.spacing.gap.sm}`}>
              <Skeleton className={`w-10 h-10 ${tokens.borders.radius.lg}`} />
              <Skeleton className={`w-10 h-10 ${tokens.borders.radius.lg}`} />
              <Skeleton className={`w-10 h-10 ${tokens.borders.radius.lg}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton for sidebar
export function SidebarSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className={`border-2 ${tokens.borders.radius.xl} ${tokens.spacing.card.lg} ${colors.structural.bg.card} ${colors.structural.border.default}`}>
        <Skeleton className="w-32 h-6 mb-4" />
        <div className="space-y-3">
          <Skeleton className={`w-full h-12 ${tokens.borders.radius.lg}`} />
          <Skeleton className={`w-full h-12 ${tokens.borders.radius.lg}`} />
          <Skeleton className={`w-full h-12 ${tokens.borders.radius.lg}`} />
        </div>
      </div>

      {/* Upcoming schedule */}
      <div className={`border-2 ${tokens.borders.radius.xl} ${tokens.spacing.card.lg} ${colors.structural.bg.card} ${colors.structural.border.default}`}>
        <Skeleton className="w-40 h-6 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="w-24 h-4 mb-2" />
                <Skeleton className="w-32 h-5" />
              </div>
              <Skeleton className="w-16 h-8 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Skeleton for metric cards
export function MetricCardSkeleton() {
  return (
    <div className={`border-2 ${tokens.borders.radius.xl} ${tokens.spacing.card.md} ${colors.structural.bg.card} ${colors.structural.border.default}`}>
      <Skeleton className="w-24 h-4 mb-3" />
      <Skeleton className="w-16 h-8 mb-2" />
      <Skeleton className={`w-full h-2 ${tokens.borders.radius.full}`} />
    </div>
  );
}

// Add shimmer keyframes to index.css if not already present
