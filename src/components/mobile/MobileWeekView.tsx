/**
 * Mobile Week View Component
 * 
 * Compact week view optimized for mobile screens with horizontal swipe navigation.
 * Shows single week with larger touch targets and streamlined layout.
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { useDevice } from '../../hooks/useDevice';
import { useHapticFeedback, useSwipeGesture } from '../../hooks/useTouchGestures';
import { Firefighter, HoldDuration, Shift } from '../../lib/supabase';
import { tokens, visualHeadings } from '../../styles';
import { attachScheduledHolds, CalendarDay, getMonthDays, ScheduledHold } from '../../utils/calendarUtils';

interface MobileWeekViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  firefighters: Firefighter[];
  scheduledHolds: ScheduledHold[];
  onDayClick: (day: CalendarDay) => void;
  currentShift: Shift;
  isDarkMode?: boolean;
}

export function MobileWeekView({
  currentDate,
  onDateChange,
  firefighters,
  scheduledHolds,
  onDayClick,
  currentShift,
  isDarkMode = true,
}: MobileWeekViewProps) {
  const device = useDevice();
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
      (d) => d.day === currentDay && d.isCurrentMonth
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
  const today = new Date();

  return (
    <div className="space-y-3">
      {/* Week Navigation */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={goToPreviousWeek}
          className={`
            ${tokens.touchTarget.min} p-3 rounded-lg
            ${tokens.focus.default}
            ${tokens.transitions.fast}
            ${
              isDarkMode
                ? 'hover:bg-slate-700 text-slate-300'
                : 'hover:bg-slate-100 text-slate-700'
            }
          `}
          aria-label="Previous week"
        >
          <ChevronLeft size={20} />
        </button>

        <div className={`${visualHeadings.subtitleMedium} ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </div>

        <button
          onClick={goToNextWeek}
          className={`
            ${tokens.touchTarget.min} p-3 rounded-lg
            ${tokens.focus.default}
            ${tokens.transitions.fast}
            ${
              isDarkMode
                ? 'hover:bg-slate-700 text-slate-300'
                : 'hover:bg-slate-100 text-slate-700'
            }
          `}
          aria-label="Next week"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Week Grid */}
      <div ref={containerRef} className="touch-pan-y">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map((day) => (
            <div
              key={day}
              className={`
                text-center py-2
                ${tokens.typography.body.small}
                font-semibold uppercase
                ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}
              `}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const isToday =
              day.isCurrentMonth &&
              day.day === today.getDate() &&
              day.month === today.getMonth() &&
              day.year === today.getFullYear();

            const holds = day.holds || [];
            const hasHolds = holds.length > 0;

            return (
              <button
                key={`${day.year}-${day.month}-${day.day}`}
                onClick={() => handleDayClick(day)}
                disabled={!day.isCurrentMonth}
                className={`
                  ${tokens.touchTarget.min}
                  aspect-square rounded-lg
                  ${tokens.transitions.fast}
                  ${tokens.focus.noOffset}
                  ${
                    !day.isCurrentMonth
                      ? isDarkMode
                        ? 'bg-slate-900 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                      : isToday
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                      : hasHolds
                      ? isDarkMode
                        ? 'bg-slate-700 hover:bg-slate-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                      : isDarkMode
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-white hover:bg-slate-50 text-slate-900'
                  }
                  border-2 ${
                    isToday
                      ? 'border-blue-400'
                      : isDarkMode
                      ? 'border-slate-700'
                      : 'border-slate-200'
                  }
                `}
                aria-label={`${day.day} ${hasHolds ? `with ${holds.length} hold(s)` : ''}`}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className={`${tokens.typography.body.secondary} font-semibold`}>
                    {day.day}
                  </span>
                  {hasHolds && (
                    <div className="flex gap-0.5 mt-1">
                      {holds.slice(0, 3).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full ${
                            isToday ? 'bg-white' : 'bg-blue-500'
                          }`}
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
