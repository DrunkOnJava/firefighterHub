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
  isDarkMode: _isDarkMode = true,
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
      {/* Compact navigation row */}
      <div className="flex items-center justify-between">
        {/* Left: Compact navigation - Arrow | Today | Arrow | Month */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onPreviousMonth}
            className="
              p-1.5 rounded-lg
              hover:bg-muted text-muted-foreground active:bg-muted/80
              transition-all duration-200
              min-h-[44px]
            "
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleGoToToday}
            className="
              px-3 py-1.5 rounded-lg font-bold text-sm
              bg-primary hover:bg-primary/90 text-primary-foreground active:bg-primary/80
              transition-all duration-200
              min-h-[44px]
            "
            aria-label="Go to today"
          >
            Today
          </button>

          <button
            onClick={onNextMonth}
            className="
              p-1.5 rounded-lg
              hover:bg-muted text-muted-foreground active:bg-muted/80
              transition-all duration-200
              min-h-[44px]
            "
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <h2
            className="text-xl font-bold text-foreground ml-3"
          >
            {formatMonthYear(currentDate)}
          </h2>
          
          {/* Hint text */}
          <span className={`ml-2 text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} hidden lg:inline`}>
            Navigate via ← →
          </span>
        </div>

        {/* Right: Shift indicator + Legend inline */}
        <div className="flex items-center gap-6">
          {/* Mini legend */}
          <div className="hidden lg:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded border-l-4 border-orange-500 bg-slate-700" />
              <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Scheduled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded border-l-4 border-green-500 bg-slate-700 opacity-75" />
              <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-600/30 ring-2 ring-blue-500" />
              <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Today</span>
            </div>
          </div>
          
          <ShiftIndicator shift={currentShift} />
        </div>
      </div>
    </div>
  );
}
