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
import { ScheduledHold, Firefighter } from '@/lib/supabase';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        Loading calendar...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col dark-theme">
      {/* Calendar Header with Next Up Section */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-6">
          <div>
            <CardTitle className="text-2xl">Schedule</CardTitle>
            <CardDescription>Hold rotation & event overview</CardDescription>
          </div>
          
          {/* Next Up Cards */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Next Up</span>
            <div className="flex gap-2">
              {[
                { ff: nextUpA, shift: 'A' as const },
                { ff: nextUpB, shift: 'B' as const },
                { ff: nextUpC, shift: 'C' as const }
              ].map(({ ff, shift }) => {
                const isSelected = ff && selectedFirefighterId === ff.id;
                
                return (
                  <Button
                    key={shift}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFirefighterClick?.(ff ? ff.id : null)}
                    disabled={!ff}
                    className={`
                      flex flex-col items-start h-auto py-2 px-3 min-w-[120px]
                      ${shift === 'A' ? 'border-red-500/50 hover:border-red-500' : ''}
                      ${shift === 'B' ? 'border-blue-500/50 hover:border-blue-500' : ''}
                      ${shift === 'C' ? 'border-green-500/50 hover:border-green-500' : ''}
                    `}
                    aria-label={ff ? `Next up for Shift ${shift}: ${ff.name}` : `No one available for Shift ${shift}`}
                  >
                    <Badge 
                      variant="outline" 
                      className={`
                        mb-1 text-xs
                        ${shift === 'A' ? 'bg-red-500/10 text-red-700 dark:text-red-400' : ''}
                        ${shift === 'B' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400' : ''}
                        ${shift === 'C' ? 'bg-green-500/10 text-green-700 dark:text-green-400' : ''}
                      `}
                    >
                      Shift {shift}
                    </Badge>
                    {ff ? (
                      <>
                        <span className="font-semibold text-sm">{ff.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {ff.fire_station && `Stn ${ff.fire_station}`}
                          {ff.fire_station && ' • '}
                          {formatLastHold(ff.last_hold_date)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No one available</span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </CardHeader>

      {/* FullCalendar Container */}
      <CardContent className="flex-1 p-0">
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

        {/* Keyboard Hint */}
        <div className="flex items-center gap-2 justify-center py-3 text-xs text-muted-foreground border-t">
          <span>Use</span>
          <kbd className="px-2 py-1 bg-muted rounded border text-xs">←</kbd>
          <kbd className="px-2 py-1 bg-muted rounded border text-xs">→</kbd>
          <span>or</span>
          <kbd className="px-2 py-1 bg-muted rounded border text-xs">T</kbd>
          <span>to navigate</span>
        </div>
      </CardContent>
    </div>
  );
}
