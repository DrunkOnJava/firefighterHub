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
import { User, MapPin, Calendar, Award } from 'lucide-react';
import { useDevice } from '../hooks/useDevice';
import { useSwipeGesture } from '../hooks/useTouchGestures';
import { Firefighter } from '../lib/supabase';
import { tokens } from '../styles';

interface NextUpBarV2Props {
  firefighters: Firefighter[];
  isDarkMode?: boolean;
  onFirefighterClick?: (firefighter: Firefighter | null) => void;
  selectedFirefighterId?: string | null;
}

export function NextUpBarV2({ 
  firefighters, 
  isDarkMode = true, 
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
          ${tokens.borders.radius.xl} ${tokens.touchTarget.min}
          ${tokens.transitions.fast}
          border-2
          ${firefighter ? 'cursor-pointer' : 'cursor-default'}
          ${isSelected ? `ring-4 ${config.ring} ring-offset-2 ring-offset-slate-900` : ''}
          ${
            isDarkMode
              ? `bg-gradient-to-br ${config.gradient} ${firefighter ? config.hoverGradient : ''} ${isSelected ? 'shadow-2xl' : 'shadow-xl'} ${config.border}`
              : `bg-gradient-to-br ${config.gradient} ${firefighter ? config.hoverGradient : ''} ${isSelected ? 'shadow-2xl' : 'shadow-lg'} border-white/20`
          }
          ${firefighter ? 'hover:shadow-2xl hover:scale-[1.02] active:scale-[0.99]' : 'opacity-60'}
          overflow-hidden
          min-h-[160px]
        `}
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Next up for Shift ${shift}: ${firefighter?.name || 'No one available'}${isSelected ? ' (selected)' : ''}`}
        aria-pressed={isSelected ? true : false}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {/* Header with shift badge */}
        <div className="relative z-10 px-6 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
              <span className="text-3xl text-white" aria-hidden="true">{config.icon}</span>
            </div>
            <div className="text-left">
              <div className="text-white text-sm font-bold uppercase tracking-widest opacity-90">
                Shift {shift}
              </div>
              <div className="text-white/80 text-xs font-semibold">
                {config.label}
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
        <div className="relative z-10 px-6 pb-5 flex-1 flex flex-col justify-end">
          {firefighter ? (
            <>
              {/* Name */}
              <div className="text-white text-2xl font-black mb-2 drop-shadow-lg leading-tight">
                {firefighter.name}
              </div>
              
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <MapPin size={14} className="flex-shrink-0" />
                  <span className="font-bold truncate">
                    Station {firefighter.fire_station || '—'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <Award size={14} className="flex-shrink-0" />
                  <span className="font-bold truncate">
                    Position #{firefighter.order_position + 1}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm col-span-2">
                  <Calendar size={14} className="flex-shrink-0" />
                  <span className="font-bold truncate">
                    Last: {firefighter.last_hold_date 
                      ? new Date(firefighter.last_hold_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'Never'}
                  </span>
                </div>
              </div>

              {/* Apparatus badges */}
              {(firefighter.apparatus_engine || firefighter.apparatus_truck || firefighter.apparatus_rescue_squad) && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {firefighter.apparatus_engine && (
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-md border border-white/30">
                      Engine
                    </span>
                  )}
                  {firefighter.apparatus_truck && (
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-md border border-white/30">
                      Truck
                    </span>
                  )}
                  {firefighter.apparatus_rescue_squad && (
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-md border border-white/30">
                      Rescue
                    </span>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-white/60">
              <User size={32} className="mb-2 opacity-40" />
              <span className="text-base font-semibold">No Available Personnel</span>
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
        ${tokens.spacing.section.lg} border-b
        ${device.isMobile ? 'pb-6' : 'py-6'}
        ${
          isDarkMode
            ? 'bg-slate-950/95 border-slate-800/50 backdrop-blur-sm'
            : 'bg-white/95 border-gray-200 backdrop-blur-sm'
        }
        ${!device.isMobile && tokens.shadows.lg}
      `}
      style={
        device.isMobile
          ? {
              paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
            }
          : undefined
      }
    >
      {/* Section header */}
      <div className={`${device.isMobile ? 'px-4' : 'px-6'} mb-5`}>
        <h2
          className={`
            text-2xl font-black uppercase tracking-wide
            bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent
            drop-shadow-sm
          `}
        >
          Next Up for Hold
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mt-1 font-medium`}>
          Click a card to filter calendar by firefighter
        </p>
      </div>

      {/* Desktop: 3-column grid */}
      {!device.isMobile && (
        <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {renderFirefighterCard('A', nextA)}
          {renderFirefighterCard('B', nextB)}
          {renderFirefighterCard('C', nextC)}
        </div>
      )}

      {/* Mobile: Horizontal scroll with snap points */}
      {device.isMobile && (
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
      )}
    </div>
  );
}
