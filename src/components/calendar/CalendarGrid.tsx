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

import { Shift } from "../../lib/supabase";
import { tokens } from "../../styles";
import { CalendarDay } from "../../utils/calendarUtils";
import { getTheme } from "../../utils/theme";
import { LoadingSpinner } from "../ui/LoadingSpinner";
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
        <LoadingSpinner size="lg" text="Loading calendar..." />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Weekday headers */}
      <div
        className={`grid grid-cols-7 ${tokens.spacing.gap.sm} ${tokens.spacing.margin.md} w-full`}
      >
        {weekDays.map((day) => (
          <div
            key={day}
            className={`
              text-center font-semibold
              ${tokens.typography.body.secondary}
              ${theme.calendar.headerText}
            `}
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 3)}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className={`grid grid-cols-7 ${tokens.spacing.gap.sm} w-full`}
        style={{ gridAutoRows: "1fr" }}
      >
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
