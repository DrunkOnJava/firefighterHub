/**
 * NextUpBar Component
 *
 * Horizontal bar displaying the next firefighter up for hold from each shift (A/B/C)
 * Shows full names and station numbers without abbreviation
 * 
 * Mobile Optimizations:
 * - Sticky bottom bar on mobile (< 768px)
 * - Horizontal scrolling with snap points for 3 shifts
 * - Safe-area-inset support for notched devices
 */

import { useRef } from 'react';
import { useDevice } from '../hooks/useDevice';
import { useSwipeGesture } from '../hooks/useTouchGestures';
import { Firefighter } from '../lib/supabase';
import { cn } from '@/lib/utils';

interface NextUpBarProps {
  firefighters: Firefighter[];
  onFirefighterClick?: (firefighter: Firefighter | null) => void;
  selectedFirefighterId?: string | null;
}

export function NextUpBar({ firefighters, onFirefighterClick, selectedFirefighterId }: NextUpBarProps) {
  const device = useDevice();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get next up for each shift (first available firefighter)
  const getNextForShift = (shift: 'A' | 'B' | 'C'): Firefighter | null => {
    const shiftFirefighters = firefighters
      .filter(ff => ff.shift === shift && ff.is_available)
      .sort((a, b) => a.order_position - b.order_position);

    return shiftFirefighters[0] || null;
  };

  const nextA = getNextForShift('A');
  const nextB = getNextForShift('B');
  const nextC = getNextForShift('C');

  // Enable horizontal swipe scrolling on mobile
  useSwipeGesture(scrollContainerRef, {
    minDistance: 30,
    onSwipe: (direction) => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const scrollAmount = container.offsetWidth * 0.9;

      if (direction === 'left') {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else if (direction === 'right') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    },
  });

  const renderShiftBadge = (shift: 'A' | 'B' | 'C') => {
    const badgeColors = {
      A: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      B: 'bg-gradient-to-br from-rose-500 to-red-600',
      C: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    };

    return (
      <div className={`${badgeColors[shift]} px-3 py-1.5 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
        <span className="text-white text-sm font-extrabold uppercase tracking-wider whitespace-nowrap">
          Shift {shift}
        </span>
      </div>
    );
  };

  const renderShiftSection = (
    shift: 'A' | 'B' | 'C',
    firefighter: Firefighter | null
  ) => {
    const isSelected = firefighter && firefighter.id === selectedFirefighterId;
    
    return (
      <button
        onClick={() => onFirefighterClick?.(isSelected ? null : firefighter)}
        disabled={!firefighter}
        className={cn(
          "flex items-center gap-3 px-4 py-5 rounded-xl relative transition-all duration-200",
          "bg-card border shadow-lg",
          firefighter ? "cursor-pointer hover:scale-[1.02] hover:shadow-xl active:scale-98 hover:border-slate-500" : "cursor-default",
          isSelected && "ring-3 ring-primary ring-offset-2 ring-offset-background border-primary"
        )}
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Next up for Shift ${shift}${isSelected ? ' (selected)' : ''}`}
        aria-pressed={isSelected ? true : false}
      >
        {renderShiftBadge(shift)}

        <div className="flex-1 min-w-0 relative z-10 group">
          <div
            className={cn(
              "text-xl font-extrabold flex items-center gap-3 whitespace-nowrap overflow-hidden",
              "text-foreground"
            )}
          >
            {firefighter ? (
              <>
                <span className="whitespace-nowrap font-bold">{firefighter.name}</span>
                <span className={cn(
                  "flex-shrink-0 text-sm font-medium text-muted-foreground"
                )}>
                  Station #{firefighter.fire_station || 'Unassigned'}
                </span>
              </>
            ) : (
              <span className="font-normal opacity-60 text-sm">
                No available firefighters
              </span>
            )}
          </div>
          
          {/* Hover tooltip with operational stats */}
          {firefighter && (
            <div className={`
              absolute left-0 top-full mt-2 px-3 py-2 rounded-lg shadow-xl
              opacity-0 invisible group-hover:opacity-100 group-hover:visible
              transition-all duration-200 z-50 min-w-[280px]
              bg-card border
            `}>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-foreground">
                  <span>Last Hold:</span>
                  <span className="font-semibold">
                    {firefighter.last_hold_date 
                      ? new Date(firefighter.last_hold_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Rotation Position:</span>
                  <span className="font-semibold">#{firefighter.order_position + 1}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Apparatus:</span>
                  <span className="font-semibold">
                    {[
                      firefighter.apparatus_engine && 'Engine',
                      firefighter.apparatus_truck && 'Truck',
                      firefighter.apparatus_rescue_squad && 'Rescue'
                    ].filter(Boolean).join(', ') || 'None'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div
      className={cn(
        "px-4 sm:px-6 py-3 shadow-lg bg-background border-b",
        device.isMobile && "fixed bottom-0 left-0 right-0 z-30"
      )}
      style={
        device.isMobile
          ? {
              paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
            }
          : undefined
      }
    >
      <div className="flex items-center gap-2 mb-3">
        <h2
          className={cn(
            "text-xl font-black uppercase tracking-wide overflow-hidden truncate text-foreground"
          )}
        >
          Next Up for Hold
        </h2>
      </div>

      {/* Desktop: Grid layout */}
      {!device.isMobile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {renderShiftSection('A', nextA)}
          {renderShiftSection('B', nextB)}
          {renderShiftSection('C', nextC)}
        </div>
      )}

      {/* Mobile: Horizontal scroll with snap points */}
      {device.isMobile && (
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="snap-center flex-shrink-0 w-[85vw]">
            {renderShiftSection('A', nextA)}
          </div>
          <div className="snap-center flex-shrink-0 w-[85vw]">
            {renderShiftSection('B', nextB)}
          </div>
          <div className="snap-center flex-shrink-0 w-[85vw]">
            {renderShiftSection('C', nextC)}
          </div>
        </div>
      )}
    </div>
  );
}
