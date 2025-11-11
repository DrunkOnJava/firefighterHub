/**
 * Mobile Week View Component
 * 
 * Compact week view optimized for mobile screens with horizontal swipe navigation.
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useHapticFeedback, useSwipeGesture } from '@/hooks/useTouchGestures';
import { Firefighter, Shift } from '@/lib/supabase';
import { attachScheduledHolds, CalendarDay, getMonthDays, ScheduledHold } from '@/utils/calendarUtils';

interface MobileWeekViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  firefighters: Firefighter[];
  scheduledHolds: ScheduledHold[];
  onDayClick: (day: CalendarDay) => void;
  currentShift: Shift;
}

export function MobileWeekView({
  currentDate,
  onDateChange,
  firefighters,
  scheduledHolds,
  onDayClick,
}: MobileWeekViewProps) {
  const haptic = useHapticFeedback();
  const containerRef = useRef<HTMLDivElement>(null);

  // Get week days around current date
  const weekDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const allDays = getMonthDays(year, month);
    const daysWithHolds = attachScheduledHolds(allDays, scheduledHolds, firefighters);

    // Find the week containing current date
    const currentDay = currentDate.getDate();
    const dayIndex = daysWithHolds.findIndex(
      (d) => d.dayNumber === currentDay && d.isCurrentMonth
    );

    if (dayIndex === -1) return daysWithHolds.slice(0, 7);

    // Get the start of the week (Sunday)
    const dayOfWeek = new Date(year, month, currentDay).getDay();
    const weekStart = dayIndex - dayOfWeek;

    return daysWithHolds.slice(weekStart, weekStart + 7);
  }, [currentDate, firefighters, scheduledHolds]);

  useSwipeGesture(containerRef, {
    minDistance: 75,
    onSwipe: (direction) => {
      if (direction === 'left') {
        goToNextWeek();
      } else if (direction === 'right') {
        goToPreviousWeek();
      }
    },
  });

  function goToPreviousWeek() {
    haptic.light();
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    onDateChange(newDate);
  }

  function goToNextWeek() {
    haptic.light();
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    onDateChange(newDate);
  }

  function handleDayClick(day: CalendarDay) {
    if (!day.isCurrentMonth) return;
    haptic.medium();
    onDayClick(day);
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousWeek}
          aria-label="Previous week"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="text-sm font-medium">
          {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextWeek}
          aria-label="Next week"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div ref={containerRef} className="touch-pan-y">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center py-2 text-xs font-semibold uppercase text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const holds = day.scheduledHolds || [];
            const hasHolds = holds.length > 0;

            return (
              <button
                key={day.date.toISOString()}
                onClick={() => handleDayClick(day)}
                disabled={!day.isCurrentMonth}
                className={cn(
                  "min-h-[44px] aspect-square rounded-md transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  !day.isCurrentMonth && "bg-muted/50 text-muted-foreground cursor-not-allowed",
                  day.isCurrentMonth && !day.isToday && !hasHolds && "bg-background hover:bg-accent hover:text-accent-foreground",
                  day.isCurrentMonth && !day.isToday && hasHolds && "bg-accent hover:bg-accent/80",
                  day.isToday && "bg-primary text-primary-foreground ring-2 ring-ring"
                )}
                aria-label={`${day.dayNumber} ${hasHolds ? `with ${holds.length} hold(s)` : ''}`}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-sm font-semibold">
                    {day.dayNumber}
                  </span>
                  {hasHolds && (
                    <div className="flex gap-0.5 mt-1">
                      {holds.slice(0, 3).map((_: any, i: number) => (
                        <div
                          key={i}
                          className={cn(
                            "w-1 h-1 rounded-full",
                            day.isToday ? "bg-primary-foreground" : "bg-primary"
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
