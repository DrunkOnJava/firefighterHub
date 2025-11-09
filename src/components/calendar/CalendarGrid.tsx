/**
 * CalendarGrid Component
 *
 * Renders the calendar grid with:
 * - Weekday headers row
 * - 7x6 grid of day cells
 * - Loading state
 * - Swipe navigation for month switching (tablet/desktop)
 */

import { useRef } from "react";
import { useSwipeGesture } from "../../hooks/useSwipeGesture";
import { Shift } from "../../lib/supabase";
import { CalendarDay } from "../../utils/calendarUtils";
import { DayCell } from "./DayCell";

interface CalendarGridProps {
  calendarDays: CalendarDay[];
  onDayClick: (day: CalendarDay) => void;
  onPreviousMonth?: () => void;
  onNextMonth?: () => void;
  loading: boolean;
  isAdminMode?: boolean;
  currentShift: Shift;
  selectedFirefighterId?: string | null;
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
  onPreviousMonth,
  onNextMonth,
  loading,
  isAdminMode = false,
  currentShift,
  selectedFirefighterId = null,
}: CalendarGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // TODO: AUDIT IMPROVEMENT - Keyboard navigation for calendar
  // Recommendation: Add arrow key navigation (Up/Down/Left/Right) between day cells
  // Implementation: handleKeyDown handler that calculates next cell index based on key
  // Left/Right: ±1 day, Up/Down: ±7 days
  // Focus management: use data-date attributes to find and focus target cells
  // See: AUDIT_REPORT_2025-11-09.md - Section 4 (Keyboard Navigation)

  // Add swipe navigation
  const { handleTouchStart, handleTouchEnd } = useSwipeGesture(
    onNextMonth,      // Swipe left = next month
    onPreviousMonth,  // Swipe right = previous month
    75                // Minimum swipe distance
  );

  if (loading) {
    return (
      <div className="text-center py-20">
        <div
          className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
        />
        <p className="mt-4 text-muted-foreground">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col min-h-0"
      ref={gridRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-3 pb-3 flex-shrink-0">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center font-bold text-sm text-foreground/80 tracking-wide uppercase"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 1)}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid - dynamic height, fills available space */}
      <div className="grid grid-cols-7 gap-3 auto-rows-fr flex-1 min-h-0">
        {calendarDays.map((day, index) => (
          <DayCell
            key={index}
            day={day}
            onDayClick={onDayClick}
            isAdminMode={isAdminMode}
            currentShift={currentShift}
            selectedFirefighterId={selectedFirefighterId}
          />
        ))}
      </div>
    </div>
  );
}
