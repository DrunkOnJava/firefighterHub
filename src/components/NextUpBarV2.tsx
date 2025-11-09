/**
 * NextUpBar Component - V2 Modern Redesign
 *
 * Large, prominent display of the next firefighter up for hold from each shift.
 * Designed for operational clarity at 3am - clear hierarchy, strong visual signals.
 * 
 * Features:
 * - Large graphical firefighter cards (expanded layout)
 * - Color-coded shift indicators with strong contrast
 * - Operational stats on hover (last hold, position, apparatus)
 * - Clickable filtering to highlight dates on calendar
 * - Responsive: stacks on mobile, grid on desktop
 */

import { useRef } from 'react';
import { User, MapPin, Calendar } from 'lucide-react';
import { useDevice } from '../hooks/useDevice';
import { useSwipeGesture } from '../hooks/useTouchGestures';
import { Firefighter } from '../lib/supabase';

interface NextUpBarV2Props {
  firefighters: Firefighter[];
  onFirefighterClick?: (firefighter: Firefighter | null) => void;
  selectedFirefighterId?: string | null;
}

export function NextUpBarV2({ 
  firefighters, 
  onFirefighterClick, 
  selectedFirefighterId 
}: NextUpBarV2Props) {
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

  const shiftConfig = {
    A: {
      gradient: 'from-cyan-500 via-cyan-600 to-blue-600',
      hoverGradient: 'hover:from-cyan-400 hover:via-cyan-500 hover:to-blue-500',
      ring: 'ring-cyan-500/50',
      border: 'border-cyan-500/30',
      icon: '●',
      label: 'Alpha',
    },
    B: {
      gradient: 'from-rose-500 via-rose-600 to-red-600',
      hoverGradient: 'hover:from-rose-400 hover:via-rose-500 hover:to-red-500',
      ring: 'ring-rose-500/50',
      border: 'border-rose-500/30',
      icon: '■',
      label: 'Bravo',
    },
    C: {
      gradient: 'from-blue-500 via-indigo-600 to-indigo-700',
      hoverGradient: 'hover:from-blue-400 hover:via-indigo-500 hover:to-indigo-600',
      ring: 'ring-blue-500/50',
      border: 'border-blue-500/30',
      icon: '▲',
      label: 'Charlie',
    },
  };

  const renderFirefighterCard = (
    shift: 'A' | 'B' | 'C',
    firefighter: Firefighter | null
  ) => {
    const config = shiftConfig[shift];
    const isSelected = firefighter && firefighter.id === selectedFirefighterId;

    return (
      <button
        onClick={() => onFirefighterClick?.(isSelected ? null : firefighter)}
        disabled={!firefighter}
        className={`
          group relative flex flex-col
          min-h-[140px]
          rounded-xl
          transition-all duration-150
          border-2
          ${firefighter ? 'cursor-pointer' : 'cursor-default'}
          ${isSelected ? `ring-4 ${config.ring} ring-offset-2 ring-offset-background` : ''}
          ${
            `bg-gradient-to-br ${config.gradient} ${firefighter ? config.hoverGradient : ''} ${isSelected ? 'shadow-2xl' : 'shadow-lg'} border-white/20`
          }
          ${firefighter ? 'hover:shadow-2xl hover:scale-[1.02] active:scale-[0.99]' : 'opacity-60'}
        `}
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Next up for Shift ${shift}: ${firefighter?.name || 'No one available'}${isSelected ? ' (selected)' : ''}`}
        aria-pressed={isSelected ? true : false}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {/* Header with shift badge */}
        <div className="relative z-10 px-4 pt-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
              <span className="text-2xl text-white" aria-hidden="true">{config.icon}</span>
            </div>
            <div className="text-left">
              <div className="text-white text-xs font-bold uppercase tracking-widest opacity-90">
                Shift {shift}
              </div>
            </div>
          </div>
          
          {isSelected && (
            <div className="px-2 py-1 bg-white/30 backdrop-blur-sm rounded-lg">
              <span className="text-white text-xs font-bold uppercase tracking-wider">
                Filtering
              </span>
            </div>
          )}
        </div>

        {/* Firefighter info */}
        <div className="relative z-10 px-4 pb-3 flex-1 flex flex-col justify-end">
          {firefighter ? (
            <>
              {/* Name */}
              <div className="text-white text-lg font-black mb-2 drop-shadow-lg leading-tight whitespace-nowrap">
                {firefighter.name}
              </div>
              
              {/* Stats - single column */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-white/90 text-xs">
                  <MapPin size={12} className="flex-shrink-0" />
                  <span className="font-bold whitespace-nowrap">
                    Station {firefighter.fire_station || '—'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90 text-xs">
                  <Calendar size={12} className="flex-shrink-0" />
                  <span className="font-bold whitespace-nowrap">
                    {firefighter.last_hold_date 
                      ? new Date(firefighter.last_hold_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'Never'}
                  </span>
                </div>
              </div>

              {/* Apparatus badges - compact */}
              {(firefighter.apparatus_engine || firefighter.apparatus_truck || firefighter.apparatus_rescue_squad) && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {firefighter.apparatus_engine && (
                    <span className="px-1.5 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold rounded border border-white/30">
                      E
                    </span>
                  )}
                  {firefighter.apparatus_truck && (
                    <span className="px-1.5 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold rounded border border-white/30">
                      T
                    </span>
                  )}
                  {firefighter.apparatus_rescue_squad && (
                    <span className="px-1.5 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold rounded border border-white/30">
                      R
                    </span>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 text-white/60">
              <User size={24} className="mb-1 opacity-40" />
              <span className="text-sm font-semibold">No Available</span>
            </div>
          )}
        </div>

        {/* Click hint on hover */}
        {firefighter && (
          <div className={`
            absolute bottom-0 left-0 right-0 py-2 px-4
            bg-black/30 backdrop-blur-sm
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            text-center text-white text-xs font-semibold
          `}>
            Click to {isSelected ? 'clear filter' : 'filter calendar'}
          </div>
        )}
      </button>
    );
  };

  return (
    <div
      className={`
        px-6 py-4 border-b bg-background/95 border-border backdrop-blur-sm shadow-lg
        ${device.isMobile ? 'pb-6' : ''}
      `}
      style={
        device.isMobile
          ? {
              paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
            }
          : undefined
      }
    >
      {/* Desktop: Title + Cards in one row */}
      {!device.isMobile && (
        <div className="px-6 flex items-center gap-6">
          {/* Section header - LEFT SIDE */}
          <div className="flex-shrink-0">
            <h2
              className={`
                text-xl font-black uppercase tracking-wide
                bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent
                drop-shadow-sm whitespace-nowrap
              `}
            >
              Next Up
            </h2>
          </div>
          
          {/* Cards - RIGHT SIDE */}
          <div className="flex-1 grid grid-cols-3 gap-4">
            {renderFirefighterCard('A', nextA)}
            {renderFirefighterCard('B', nextB)}
            {renderFirefighterCard('C', nextC)}
          </div>
        </div>
      )}

      {/* Mobile: Vertical layout with title */}
      {device.isMobile && (
        <>
          <div className="px-4 mb-3">
            <h2
              className={`
                text-xl font-black uppercase tracking-wide
                bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent
                drop-shadow-sm
              `}
            >
              Next Up
            </h2>
          </div>
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="snap-center flex-shrink-0 w-[85vw]">
              {renderFirefighterCard('A', nextA)}
            </div>
            <div className="snap-center flex-shrink-0 w-[85vw]">
              {renderFirefighterCard('B', nextB)}
            </div>
            <div className="snap-center flex-shrink-0 w-[85vw]">
              {renderFirefighterCard('C', nextC)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
