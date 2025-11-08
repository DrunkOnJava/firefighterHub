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
import { colors, tokens } from "../../styles";
import { formatMonthYear } from "../../utils/calendarUtils";
import { ShiftIndicator } from "../ShiftIndicator";

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
  currentShift,
  isDarkMode = true,
}: CalendarHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Single row: Month navigation + Shift indicator */}
      <div className="flex items-center justify-between">
        {/* Left: Month navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPreviousMonth}
            className={`
              p-2 rounded-lg
              ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}
              ${tokens.transitions.fast}
              ${tokens.touchTarget.min}
            `}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2
            className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } min-w-[180px] text-center`}
          >
            {formatMonthYear(currentDate)}
          </h2>

          <button
            onClick={onNextMonth}
            className={`
              p-2 rounded-lg
              ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}
              ${tokens.transitions.fast}
              ${tokens.touchTarget.min}
            `}
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Shift indicator + Legend inline */}
        <div className="flex items-center gap-6">
          {/* Mini legend */}
          <div className="hidden lg:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded border-l-4 border-orange-500 bg-slate-700" />
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Scheduled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded border-l-4 border-green-500 bg-slate-700 opacity-75" />
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-600/20 ring-2 ring-blue-500" />
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Today</span>
            </div>
          </div>
          
          <ShiftIndicator shift={currentShift} />
        </div>
      </div>
    </div>
  );
}
