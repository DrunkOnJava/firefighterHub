/**
 * CalendarGrid Component
 *
 * Renders the calendar grid with:
 * - Weekday headers row
 * - 7x6 grid of day cells
 * - Loading state
 *
 * Uses grid system utilities for consistent spacing and layout.
 */

import { Shift } from "../../lib/supabase";
import { gridUtilities } from "../../styles";
import { CalendarDay } from "../../utils/calendarUtils";
import { getTheme } from "../../utils/theme";
import { DayCell } from "./DayCell";

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
  const theme = getTheme(isDarkMode);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div
          className={`inline-block animate-spin rounded-full h-12 w-12 border-b-2 ${theme.calendar.headerText}`}
        />
        <p className={`mt-4 ${theme.textSecondary}`}>Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-0">
      {/* Weekday headers - using grid system utilities */}
      <div className={gridUtilities.calendar.weekdayHeader}>
        {weekDays.map((day) => (
          <div
            key={day}
            className={`text-center font-semibold text-sm ${theme.calendar.headerText}`}
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 3)}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid - using grid system utilities */}
      <div className={gridUtilities.calendar.dayGrid}>
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
