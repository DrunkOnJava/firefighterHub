/**
 * FirefighterHub Calendar Component
 * 
 * Built with shadcn/ui Calendar (react-day-picker) instead of FullCalendar
 * Displays scheduled holds for firefighters with shift-based styling
 */

import { useMemo, useState } from 'react';
import { ScheduledHold, Firefighter } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar-shadcn';
import { addMonths, subMonths, format, parseISO } from 'date-fns';

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
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get next up firefighters per shift
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

  // Dates that have scheduled holds
  const datesWithHolds = useMemo(() => {
    return scheduledHolds
      .filter(h => h.hold_date)
      .map(h => parseISO(h.hold_date!));
  }, [scheduledHolds]);

  // Handle day click to show holds for that date
  const handleDayClick = (date: Date | undefined) => {
    if (!date) return;
    
    const holdsForDate = scheduledHolds.filter(hold => {
      if (!hold.hold_date) return false;
      const holdDate = parseISO(hold.hold_date);
      return holdDate.toDateString() === date.toDateString();
    });

    // TODO: Show modal or popover with holds for this date
    if (holdsForDate.length > 0) {
      console.log('Holds for', date, holdsForDate);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        Loading calendar...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gradient-to-r from-background to-muted/20">
      {/* Header: Title + Next Up */}
      <div className="flex-shrink-0 flex items-start justify-between gap-6 p-4 pb-3 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
          <p className="text-sm mt-0.5 text-muted-foreground">Hold rotation & event overview</p>
        </div>

        {/* Next Up Cards */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Next Up</span>
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
                      border-2 shadow-md hover:shadow-lg
                      transition-all duration-300
                      hover:scale-[1.02] hover:-translate-y-0.5
                      ${shift === 'A' ? 'border-l-4 border-l-red-500 bg-red-50/30 dark:bg-red-950/20 hover:border-red-500/80' : ''}
                      ${shift === 'B' ? 'border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/20 hover:border-blue-500/80' : ''}
                      ${shift === 'C' ? 'border-l-4 border-l-green-500 bg-green-50/30 dark:bg-green-950/20 hover:border-green-500/80' : ''}
                    `}
                    aria-label={ff ? `Next up for Shift ${shift}: ${ff.name}` : `No one available for Shift ${shift}`}
                  >
                    <Badge
                      variant="outline"
                      className={`
                        mb-1 text-xs font-bold
                        ${shift === 'A' ? 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/40' : ''}
                        ${shift === 'B' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/40' : ''}
                        ${shift === 'C' ? 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/40' : ''}
                      `}
                    >
                      Shift {shift}
                    </Badge>
                    {ff ? (
                      <>
                        <span className="font-bold text-xs mb-0.5">{ff.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {ff.fire_station && `Stn ${ff.fire_station}`}
                          {ff.fire_station && ' • '}
                          {formatLastHold(ff.last_hold_date)}
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic">No one available</span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

      {/* Month Navigation */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b border-border/40">
        <h3 className="text-base font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="h-7 w-7"
          >
            <span className="sr-only">Previous month</span>
            ←
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
            className="h-7 px-2 text-xs"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="h-7 w-7"
          >
            <span className="sr-only">Next month</span>
            →
          </Button>
        </div>
      </div>

      {/* Calendar Grid - fills remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden p-2">
        <Calendar
          mode="single"
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          onDayClick={handleDayClick}
          modifiers={{
            hasHolds: datesWithHolds,
          }}
          modifiersClassNames={{
            hasHolds: 'font-bold bg-primary/5 hover:bg-primary/10',
          }}
          className="rounded-md border w-full h-full [--cell-size:theme(spacing.4)] p-0"
        />
      </div>

      {/* Footer: Legend + Keyboard hint */}
      <div className="flex-shrink-0 flex items-center justify-between gap-3 px-4 py-2 border-t border-border/40">
        {/* Hold indicators legend */}
        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Shift A</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Shift B</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Shift C</span>
          </div>
        </div>

        {/* Keyboard Hint */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span>Use</span>
          <kbd className="px-1.5 py-0.5 bg-muted rounded border text-[10px]">←</kbd>
          <kbd className="px-1.5 py-0.5 bg-muted rounded border text-[10px]">→</kbd>
          <span>to navigate</span>
        </div>
      </div>
    </div>
  );
}
