/**
 * Main Calendar Component
 * 
 * FullCalendar-based calendar view for firefighter hold rotation schedule
 */

import { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { ScheduledHold, Firefighter } from '../../lib/supabase';

import './MainCalendar.css';

interface MainCalendarProps {
  loading: boolean;
  scheduledHolds?: ScheduledHold[];
  firefighters?: Firefighter[];
  onFirefighterClick?: (firefighterId: string | null) => void;
  selectedFirefighterId?: string | null;
}

export function MainCalendar({
  loading,
  scheduledHolds = [],
  firefighters = [],
  onFirefighterClick,
  selectedFirefighterId,
}: MainCalendarProps) {
  // Read dark mode from DOM
  const isDarkMode = document.documentElement.classList.contains('dark');
  // Get next up firefighters per shift (memoized to prevent infinite loops)
  const { nextUpA, nextUpB, nextUpC } = useMemo(() => {
    const getNextUpByShift = (shift: 'A' | 'B' | 'C') => {
      const shiftFFs = firefighters
        .filter(ff => ff.shift === shift && ff.is_available)
        .sort((a, b) => a.order_position - b.order_position);
      return shiftFFs[0] || null;
    };

    return {
      nextUpA: getNextUpByShift('A'),
      nextUpB: getNextUpByShift('B'),
      nextUpC: getNextUpByShift('C'),
    };
  }, [firefighters]);

  const formatLastHold = (date: string | null) => {
    if (!date) return 'Never';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getShiftColor = (shift: 'A' | 'B' | 'C') => {
    if (shift === 'A') return 'cyan';
    if (shift === 'B') return 'rose';
    return 'indigo';
  };
  // Convert scheduled holds to calendar events
  const events: EventInput[] = useMemo(() => {
    if (!scheduledHolds || scheduledHolds.length === 0) return [];

    return scheduledHolds.map((hold) => {
      const firefighter = firefighters.find((ff) => ff.id === hold.firefighter_id);
      
      if (!firefighter) return null;

      const station = firefighter.fire_station ? ` - Station ${firefighter.fire_station}` : '';
      const title = `${firefighter.name}${station}`;

      // Determine shift color class
      let shiftClass = 'event-shift-a';
      if (firefighter.shift === 'B') shiftClass = 'event-shift-b';
      if (firefighter.shift === 'C') shiftClass = 'event-shift-c';

      return {
        id: hold.id,
        title,
        start: hold.hold_date,
        className: shiftClass,
        extendedProps: {
          firefighterId: hold.firefighter_id,
          status: hold.status,
          shift: firefighter.shift,
        },
      };
    }).filter(Boolean) as EventInput[];
  }, [scheduledHolds, firefighters]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 ${
        isDarkMode ? 'text-slate-400' : 'text-slate-500'
      }`}>
        Loading calendar...
      </div>
    );
  }

  return (
    <div className={`calendar-shell ${isDarkMode ? 'dark-theme' : 'light-theme'} h-full`}>
      <div className="calendar-container-with-header">
        <div className="calendar-inline-header">
          <div className="calendar-header-left">
            <h1 className="calendar-title">Schedule</h1>
            <p className="calendar-subtitle">Hold rotation & event overview</p>
          </div>
          
          <div className="calendar-next-up-inline">
            <div className="next-up-label">Next Up</div>
            <div className="next-up-cards">
              {[
                { ff: nextUpA, shift: 'A' as const },
                { ff: nextUpB, shift: 'B' as const },
                { ff: nextUpC, shift: 'C' as const }
              ].map(({ ff, shift }) => {
                const color = getShiftColor(shift);
                const isSelected = ff && selectedFirefighterId === ff.id;
                
                return (
                  <button
                    key={shift}
                    onClick={() => onFirefighterClick?.(ff ? ff.id : null)}
                    disabled={!ff}
                    className={`next-up-card next-up-card-${color} ${isSelected ? 'selected' : ''} ${!ff ? 'disabled' : ''}`}
                    aria-label={ff ? `Next up for Shift ${shift}: ${ff.name}` : `No one available for Shift ${shift}`}
                  >
                    <div className="next-up-card-header">
                      <span className="next-up-shift">Shift {shift}</span>
                    </div>
                    {ff ? (
                      <>
                        <div className="next-up-name">{ff.name}</div>
                        <div className="next-up-details">
                          {ff.fire_station && <span>Stn {ff.fire_station}</span>}
                          <span className="next-up-separator">•</span>
                          <span>{formatLastHold(ff.last_hold_date)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="next-up-empty">No one available</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="calendar-grid-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: '',
              center: 'today prev title next',
              right: ''
            }}
            events={events}
            contentHeight="auto"
            expandRows={false}
            dayMaxEvents={false}
            editable={false}
            selectable={false}
            eventDisplay="block"
          />
        </div>
      </div>

      <div className="calendar-keyboard-hint">
        <span>Use</span>
        <kbd>←</kbd><kbd>→</kbd>
        <span>or</span>
        <kbd>T</kbd>
        <span>to navigate</span>
      </div>
    </div>
  );
}
