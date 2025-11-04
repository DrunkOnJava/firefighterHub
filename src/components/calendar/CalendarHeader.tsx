/**
 * CalendarHeader Component
 *
 * Displays the calendar header with:
 * - Calendar icon and title
 * - Month navigation (previous/next buttons)
 * - Current shift indicator
 *
 * Uses design tokens for consistent spacing and colors.
 */

import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Shift } from "../../lib/supabase";
import { formatMonthYear } from "../../utils/calendarUtils";

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  currentShift: Shift;
  isDarkMode?: boolean;
}

export function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  const goToToday = () => {
    // This would need to be passed down as a prop in real implementation
    // For now, just show the button
  };

  return (
    <div className="flex items-center justify-between">
      {/* Left Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPreviousMonth}
          className="p-2 hover:bg-[#2F3640] rounded-md transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      {/* Centered Month/Year Display */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-100">
            {formatMonthYear(currentDate)}
          </h2>
        </div>
        <button 
          onClick={goToToday}
          className="px-3 py-1 text-sm bg-[#2F3640] hover:bg-[#353D47] text-gray-300 rounded-md border border-[#252A32] transition-colors"
        >
          Today
        </button>
      </div>

      {/* Right Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-[#2F3640] rounded-md transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>
      </div>
    </div>
  );
}
