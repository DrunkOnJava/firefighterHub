/**
 * Skeleton Loading Components
 * Provides visual feedback while content is loading
 * Improves perceived performance and user experience
 */

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

// Base skeleton element with shimmer animation
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%] rounded-md",
        className
      )}
      style={{
        animation: 'shimmer 2s infinite',
      }}
    />
  );
}

// Skeleton for calendar grid
export function CalendarSkeleton() {
  return (
    <div className="border-2 rounded-xl shadow-md overflow-hidden bg-card border-border">
      {/* Header */}
      <div className="border-b-2 p-6 bg-muted/50 border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div>
              <Skeleton className="w-48 h-7 mb-2" />
              <Skeleton className="w-64 h-4" />
            </div>
          </div>
          <Skeleton className="w-24 h-10 rounded-lg" />
        </div>

        <div className="flex items-center justify-center gap-6">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="w-64 h-9" />
          <Skeleton className="w-10 h-10 rounded-lg" />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {[...Array(35)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 p-6 bg-muted/50 border-border">
        <div className="flex items-center justify-between">
          <div className="flex gap-6">
            <Skeleton className="w-32 h-6" />
            <Skeleton className="w-32 h-6" />
            <Skeleton className="w-24 h-6" />
          </div>
          <Skeleton className="w-40 h-10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Skeleton for firefighter list
export function FirefighterListSkeleton() {
  return (
    <div className="border-2 rounded-xl shadow-md overflow-hidden bg-card border-border">
      {/* Header */}
      <div className="border-b-2 p-6 bg-muted/50 border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <Skeleton className="w-48 h-7" />
          </div>
          <Skeleton className="w-32 h-10 rounded-lg" />
        </div>
      </div>

      {/* List items */}
      <div className="p-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 mb-2 rounded-lg bg-muted/50"
          >
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="w-8 h-8 rounded" />
              <div className="flex-1">
                <Skeleton className="w-48 h-6 mb-2" />
                <Skeleton className="w-32 h-4" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <Skeleton className="w-10 h-10 rounded-lg" />
              <Skeleton className="w-10 h-10 rounded-lg" />
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
      <div className="border-2 rounded-xl p-6 bg-card border-border">
        <Skeleton className="w-32 h-6 mb-4" />
        <div className="space-y-3">
          <Skeleton className="w-full h-12 rounded-lg" />
          <Skeleton className="w-full h-12 rounded-lg" />
          <Skeleton className="w-full h-12 rounded-lg" />
        </div>
      </div>

      {/* Upcoming schedule */}
      <div className="border-2 rounded-xl p-6 bg-card border-border">
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
    <div className="border-2 rounded-xl p-4 bg-card border-border">
      <Skeleton className="w-24 h-4 mb-3" />
      <Skeleton className="w-16 h-8 mb-2" />
      <Skeleton className="w-full h-2 rounded-full" />
    </div>
  );
}

// Add shimmer keyframes to index.css if not already present
