/**
 * CalendarHeaderM3 - MaterialM Calendar Header Component
 *
 * Displays the calendar header with month navigation and shift indicator.
 * Uses MaterialM design system colors and components.
 *
 * @example
 * ```tsx
 * <CalendarHeaderM3
 *   currentDate={new Date()}
 *   onPreviousMonth={handlePrevious}
 *   onNextMonth={handleNext}
 *   currentShift={currentShift}
 *   isDarkMode={isDarkMode}
 * />
 * ```
 */

import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Shift } from "../../lib/supabase";
import { IconButtonM3 } from "../m3/ButtonM3";
import { formatMonthYear } from "../../utils/calendarUtils";
import { ShiftIndicator } from "../ShiftIndicator";

interface CalendarHeaderM3Props {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  currentShift: Shift;
  isDarkMode?: boolean;
}

/**
 * MaterialM Calendar Header Component
 */
export function CalendarHeaderM3({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  currentShift,
}: CalendarHeaderM3Props) {
  return (
    <div className="space-y-4">
      {/* Header with icon and title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-materialm-primary shadow-materialm-2">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-materialm-text dark:text-white">
              Hold Calendar
            </h2>
            <p className="text-sm text-materialm-text-secondary hidden sm:block">
              Click any date to schedule or manage holds
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <ShiftIndicator shift={currentShift} />
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-center gap-4">
        <IconButtonM3
          variant="outlined"
          color="neutral"
          size="md"
          onClick={onPreviousMonth}
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </IconButtonM3>

        <h3 className="text-xl font-bold text-materialm-text dark:text-white min-w-[200px] text-center">
          {formatMonthYear(currentDate)}
        </h3>

        <IconButtonM3
          variant="outlined"
          color="neutral"
          size="md"
          onClick={onNextMonth}
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </IconButtonM3>
      </div>
    </div>
  );
}
