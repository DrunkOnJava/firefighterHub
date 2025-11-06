/**
 * CalendarGridM3 Component - MaterialM Version
 *
 * Renders the calendar grid with:
 * - Weekday headers row
 * - 7x6 grid of day cells
 * - Loading state
 *
 * Uses MaterialM color system and DayCellM3 for consistent design.
 */

import { Shift } from "../../lib/supabase";
import { tokens } from "../../styles";
import { CalendarDay } from "../../utils/calendarUtils";
import { DayCellM3 } from "./DayCellM3";

interface CalendarGridM3Props {
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

export function CalendarGridM3({
  calendarDays,
  onDayClick,
  loading,
  isAdminMode = false,
  currentShift,
  isDarkMode = true,
}: CalendarGridM3Props) {
  if (loading) {
    return (
      <div className="text-center py-20">
        <div
          className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-materialm-text"
        />
        <p className="mt-4 text-materialm-text/70">Loading calendar...</p>
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
              text-materialm-text
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
          <DayCellM3
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
