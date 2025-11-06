/**
 * CalendarHeaderLegacy - Original Calendar Header Implementation
 *
 * Preserved for backward compatibility during MaterialM migration.
 * Displays calendar header with month navigation and shift indicator.
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

interface CalendarHeaderLegacyProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  currentShift: Shift;
  isDarkMode?: boolean;
}

export function CalendarHeaderLegacy({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  currentShift,
  isDarkMode = true,
}: CalendarHeaderLegacyProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header with icon and title */}
      <div
        className={`flex items-center justify-between ${tokens.spacing.margin.md}`}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <div
            className={`
              ${colors.semantic.primary.gradient}
              ${colors.semantic.primary.shadow}
              ${tokens.spacing.section.md}
              ${tokens.borders.radius.lg}
            `}
          >
            <CalendarIcon className={`${tokens.icons.md} text-white`} />
          </div>
          <div>
            <h2
              className={`${tokens.typography.heading.h2} ${
                isDarkMode ? colors.structural.text.primary : "text-materialm-text"
              }`}
            >
              Hold Calendar
            </h2>
            <p
              className={`${tokens.typography.body.secondary} ${
                isDarkMode ? colors.structural.text.secondary : "text-materialm-text-secondary"
              } hidden sm:block`}
            >
              Click any date to schedule or manage holds
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <ShiftIndicator shift={currentShift} />
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-center gap-2 sm:gap-6">
        <button
          onClick={onPreviousMonth}
          className={`
            ${tokens.spacing.section.md}
            ${tokens.borders.radius.lg}
            ${isDarkMode ? colors.interactive.hover.bg : "hover:bg-materialm-surface"}
            ${tokens.transitions.fast}
            ${tokens.touchTarget.min}
          `}
          aria-label="Previous month"
        >
          <ChevronLeft
            className={`${tokens.icons.md} ${
              isDarkMode ? colors.structural.text.primary : "text-materialm-text"
            }`}
          />
        </button>

        <h3
          className={`${tokens.typography.heading.h3} ${
            isDarkMode ? colors.structural.text.primary : "text-materialm-text"
          } min-w-[200px] text-center`}
        >
          {formatMonthYear(currentDate)}
        </h3>

        <button
          onClick={onNextMonth}
          className={`
            ${tokens.spacing.section.md}
            ${tokens.borders.radius.lg}
            ${isDarkMode ? colors.interactive.hover.bg : "hover:bg-materialm-surface"}
            ${tokens.transitions.fast}
            ${tokens.touchTarget.min}
          `}
          aria-label="Next month"
        >
          <ChevronRight
            className={`${tokens.icons.md} ${
              isDarkMode ? colors.structural.text.primary : "text-materialm-text"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
