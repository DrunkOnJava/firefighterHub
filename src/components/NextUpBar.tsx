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
import { colors, tokens, gridUtilities } from '../styles';

interface NextUpBarProps {
  firefighters: Firefighter[];
  isDarkMode?: boolean;
  onFirefighterClick?: (firefighter: Firefighter | null) => void;
  selectedFirefighterId?: string | null;
}

export function NextUpBar({ firefighters, isDarkMode = true, onFirefighterClick, selectedFirefighterId }: NextUpBarProps) {
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
      A: isDarkMode
        ? 'bg-gradient-to-br from-cyan-500 to-blue-600'
        : 'bg-gradient-to-br from-cyan-400 to-blue-500',
      B: isDarkMode
        ? 'bg-gradient-to-br from-rose-500 to-red-600'
        : 'bg-gradient-to-br from-rose-400 to-red-500',
      C: isDarkMode
        ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
        : 'bg-gradient-to-br from-blue-400 to-indigo-500',
    };

    return (
      <div className={`${badgeColors[shift]} px-2.5 py-1 rounded flex items-center justify-center flex-shrink-0`}>
        <span className="text-white text-xs font-bold uppercase tracking-wide whitespace-nowrap">
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
        className={`
          flex items-center gap-2 px-3 py-4 rounded-lg relative
          ${tokens.transitions.fast}
          ${firefighter ? 'cursor-pointer hover:scale-102 active:scale-98' : 'cursor-default'}
          ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
          ${
            isDarkMode
              ? `bg-slate-700 border ${isSelected ? 'border-blue-500' : 'border-slate-600'} shadow-lg ${firefighter ? 'hover:bg-slate-600' : ''}`
              : `bg-gray-50 border ${isSelected ? 'border-blue-500' : 'border-gray-200'} ${firefighter ? 'hover:bg-gray-100' : ''}`
          }
        `}
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Next up for Shift ${shift}${isSelected ? ' (selected)' : ''}`}
        aria-pressed={isSelected}
      >
        {renderShiftBadge(shift)}

        <div className="flex-1 min-w-0 relative z-10">
          <div
            className={`
              text-base font-medium flex items-center gap-2.5 whitespace-nowrap overflow-hidden
              ${
                isDarkMode
                  ? colors.structural.text.primary
                  : 'text-gray-900'
              }
            `}
          >
            {firefighter ? (
              <>
                <span className="truncate font-semibold">{firefighter.name}</span>
                <span className={`flex-shrink-0 text-sm font-normal ${
                  isDarkMode
                    ? colors.structural.text.secondary
                    : 'text-gray-600'
                }`}>
                  Station #{firefighter.fire_station || 'Unassigned'}
                </span>
              </>
            ) : (
              <span className="font-normal opacity-60 text-sm">
                No available firefighters
              </span>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div
      className={`
        px-4 sm:px-6 py-3
        ${device.isMobile ? 'fixed bottom-0 left-0 right-0 z-30' : ''}
        ${
          isDarkMode
            ? 'bg-slate-950 border-b border-slate-800'
            : 'bg-white border-b border-gray-200'
        }
        ${tokens.shadows.lg}
      `}
      style={
        device.isMobile
          ? {
              paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
            }
          : undefined
      }
    >
      <div className="flex items-center gap-2 mb-2.5">
        <h2
          className={`
            text-sm font-bold uppercase tracking-wider overflow-hidden truncate
            ${
              isDarkMode
                ? colors.structural.text.secondary
                : 'text-gray-600'
            }
          `}
        >
          Next Up for Hold
        </h2>
      </div>

      {/* Desktop: Grid layout - using grid system utilities */}
      {!device.isMobile && (
        <div className={gridUtilities.nextUpBar.container}>
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
