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
      className="w-full flex flex-col min-h-0 flex-1"
      ref={gridRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Weekday headers */}
      {/* TODO: AUDIT FIX - Color contrast on weekday headers */}
      {/* Current: text-muted-foreground may fail WCAG AA (3.21:1 ratio) */}
      {/* Recommendation: Use text-foreground or text-slate-700 dark:text-slate-200 */}
      {/* See: AUDIT_REPORT_2025-11-09.md - Section 5 (Color Contrast Audit) */}
      <div className="grid grid-cols-7 gap-2 pb-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center font-bold text-xs text-muted-foreground"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 1)}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid with max height */}
      {/* NOTE: gap-2 provides good visual separation between day cells (8px) */}
      {/* DayCell borders (border-2) handle individual cell definition */}
      <div className="grid grid-cols-7 gap-2 auto-rows-fr max-h-[calc(100vh-280px)] overflow-auto">
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
