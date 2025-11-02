/**
 * CalendarGrid Component
 * 
 * Renders the calendar grid with:
 * - Weekday headers row
 * - 7x6 grid of day cells
 * - Loading state
 * 
 * Uses design tokens for consistent spacing and layout.
 */

import { CalendarDay } from '../../utils/calendarUtils';
import { Shift } from '../../lib/supabase';
import { DayCell } from './DayCell';
import { colors, tokens } from '../../styles';

interface CalendarGridProps {
  calendarDays: CalendarDay[];
  onDayClick: (day: CalendarDay) => void;
  loading: boolean;
  isAdminMode?: boolean;
  currentShift: Shift;
  isDarkMode?: boolean;
}

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function CalendarGrid({
  calendarDays,
  onDayClick,
  loading,
  isAdminMode = false,
  currentShift,
  isDarkMode = true,
}: CalendarGridProps) {
  if (loading) {
    return (
      <div className="text-center py-20">
        <div className={`inline-block animate-spin rounded-full h-12 w-12 border-b-2 ${isDarkMode ? 'border-blue-500' : 'border-blue-600'}`} />
        <p className={`mt-4 ${isDarkMode ? colors.structural.text.secondary : 'text-gray-600'}`}>
          Loading calendar...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Weekday headers */}
      <div className={`grid grid-cols-7 ${tokens.spacing.gap.sm} ${tokens.spacing.margin.md} w-full`}>
        {weekDays.map((day) => (
          <div
            key={day}
            className={`
              text-center font-semibold
              ${tokens.typography.body.secondary}
              ${isDarkMode ? colors.structural.text.secondary : 'text-gray-700'}
            `}
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 3)}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={`grid grid-cols-7 ${tokens.spacing.gap.sm} w-full auto-rows-fr`}>
        {calendarDays.map((day, index) => (
          <DayCell
            key={index}
            day={day}
            onDayClick={onDayClick}
            isAdminMode={isAdminMode}
            currentShift={currentShift}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
}

