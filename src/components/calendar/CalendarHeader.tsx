/**
 * CalendarHeader - Calendar Header Component
 *
 * Displays the calendar header with month navigation and shift indicator.
 * Automatically switches between MaterialM and legacy styling based on feature flag.
 *
 * @example
 * ```tsx
 * <CalendarHeader
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
import { useFeatureFlag } from "../../hooks/useFeatureFlag";
import { Shift } from "../../lib/supabase";
import { IconButtonM3 } from "../m3/ButtonM3";
import { formatMonthYear } from "../../utils/calendarUtils";
import { ShiftIndicator } from "../ShiftIndicator";
import { CalendarHeaderLegacy } from "./CalendarHeaderLegacy";

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  currentShift: Shift;
  isDarkMode?: boolean;
}

/**
 * MaterialM Calendar Header Component
 */
function CalendarHeaderM3({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  currentShift,
}: CalendarHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Header with icon and title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-materialm-primary shadow-materialm-2">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Hold Calendar
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
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

        <h3 className="text-xl font-bold text-gray-900 dark:text-white min-w-[200px] text-center">
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

/**
 * Calendar Header Component with Feature Flag
 *
 * Switches between MaterialM and legacy versions.
 */
export function CalendarHeader(props: CalendarHeaderProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <CalendarHeaderLegacy {...props} />;
  }

  return <CalendarHeaderM3 {...props} />;
}
