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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Shift } from "../../lib/supabase";
import { tokens } from "../../styles";
import { formatMonthYear } from "../../utils/calendarUtils";
import { ShiftIndicator } from "../ShiftIndicator";

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onGoToToday?: () => void;
  currentShift: Shift;
  isDarkMode?: boolean;
}

export function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onGoToToday,
  currentShift,
  isDarkMode = true,
}: CalendarHeaderProps) {
  const handleGoToToday = () => {
    const today = new Date();
    const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                          currentDate.getFullYear() === today.getFullYear();
    
    if (!isCurrentMonth && onGoToToday) {
      onGoToToday();
    }
  };

  return (
    <div className="space-y-2">
      {/* Single row: Month navigation + Shift indicator */}
      <div className="flex items-center justify-between">
        {/* Left: Today + Month navigation (compact) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousMonth}
            className={`
              p-1.5 rounded-lg
              ${isDarkMode ? 'hover:bg-gray-800/70 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}
              ${tokens.transitions.fast}
              ${tokens.touchTarget.min}
            `}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleGoToToday}
            className={`
              px-3 py-1.5 rounded-lg font-semibold text-sm
              ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}
              ${tokens.transitions.fast}
              ${tokens.touchTarget.min}
            `}
            aria-label="Go to today"
          >
            Today
          </button>

          <button
            onClick={onNextMonth}
            className={`
              p-1.5 rounded-lg
              ${isDarkMode ? 'hover:bg-gray-800/70 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}
              ${tokens.transitions.fast}
              ${tokens.touchTarget.min}
            `}
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <h2
            className={`text-lg font-semibold ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            } ml-2`}
          >
            {formatMonthYear(currentDate)}
          </h2>
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
