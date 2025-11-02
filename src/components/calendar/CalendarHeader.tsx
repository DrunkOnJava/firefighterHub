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

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Shift } from '../../lib/supabase';
import { formatMonthYear } from '../../utils/calendarUtils';
import { ShiftIndicator } from '../ShiftIndicator';
import { colors, tokens } from '../../styles';

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
    <div className="space-y-3 sm:space-y-4">
      {/* Header with icon and title */}
      <div className={`flex items-center justify-between ${tokens.spacing.margin.md}`}>
        <div className="flex items-center gap-2 sm:gap-4">
          <div 
            className={`
              ${colors.semantic.primary.gradient}
              ${colors.semantic.primary.shadow}
              ${tokens.spacing.section.md}
              ${tokens.borders.radius.lg}
            `}
          >
            <CalendarIcon className="text-white" size={20} />
          </div>
          <div>
            <h2 className={`${tokens.typography.heading.h2} ${isDarkMode ? colors.structural.text.primary : 'text-gray-900'}`}>
              Hold Calendar
            </h2>
            <p className={`${tokens.typography.body.secondary} ${isDarkMode ? colors.structural.text.secondary : 'text-gray-600'} hidden sm:block`}>
              Click any date to schedule or manage holds
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <ShiftIndicator shift={currentShift} isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-center gap-2 sm:gap-6">
        <button
          onClick={onPreviousMonth}
          className={`
            ${tokens.spacing.section.md}
            ${tokens.borders.radius.lg}
            ${isDarkMode ? colors.interactive.hover.bg : 'hover:bg-gray-200'}
            ${tokens.transitions.fast}
            ${tokens.touchTarget.min}
          `}
          aria-label="Previous month"
        >
          <ChevronLeft className={isDarkMode ? colors.structural.text.primary : 'text-gray-900'} size={20} />
        </button>
        
        <h3 className={`${tokens.typography.heading.h3} ${isDarkMode ? colors.structural.text.primary : 'text-gray-900'} min-w-[200px] text-center`}>
          {formatMonthYear(currentDate)}
        </h3>
        
        <button
          onClick={onNextMonth}
          className={`
            ${tokens.spacing.section.md}
            ${tokens.borders.radius.lg}
            ${isDarkMode ? colors.interactive.hover.bg : 'hover:bg-gray-200'}
            ${tokens.transitions.fast}
            ${tokens.touchTarget.min}
          `}
          aria-label="Next month"
        >
          <ChevronRight className={isDarkMode ? colors.structural.text.primary : 'text-gray-900'} size={20} />
        </button>
      </div>
    </div>
  );
}

