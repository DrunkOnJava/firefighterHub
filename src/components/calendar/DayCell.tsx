/**
 * DayCell Component
 * 
 * Renders an individual day cell in the calendar grid.
 * Shows:
 * - Day number
 * - Today indicator
 * - Hold count badges (scheduled/completed)
 * - Visual states for scheduled/completed holds
 * 
 * Uses design tokens for consistent styling.
 */

import { CalendarDay } from '../../utils/calendarUtils';
import { Shift } from '../../lib/supabase';
import { colors, tokens } from '../../styles';

interface DayCellProps {
  day: CalendarDay;
  onDayClick: (day: CalendarDay) => void;
  isAdminMode?: boolean;
  currentShift: Shift;
  isDarkMode?: boolean;
}

export function DayCell({
  day,
  onDayClick,
  isAdminMode = false,
  isDarkMode = true,
}: DayCellProps) {
  const hasHolds = day.scheduledHolds.length > 0;
  const scheduledHolds = day.scheduledHolds.filter(h => h.status === "scheduled");
  const completedHolds = day.scheduledHolds.filter(h => h.status === "completed");
  const hasScheduled = scheduledHolds.length > 0;
  const hasCompleted = completedHolds.length > 0;

  // Determine styling based on state
  let cellClasses = `
    aspect-square w-full
    ${tokens.touchTarget.min}
    ${tokens.spacing.section.sm}
    ${tokens.borders.radius.md}
    ${tokens.transitions.fast}
    flex flex-col items-center justify-center
    relative overflow-hidden
  `;

  if (!day.isCurrentMonth) {
    cellClasses += ` cursor-default opacity-30 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`;
  } else if (hasScheduled && hasCompleted) {
    cellClasses += ` ${colors.components.dayCell.both} cursor-pointer hover:opacity-80`;
  } else if (hasScheduled) {
    cellClasses += ` ${colors.components.dayCell.scheduled} cursor-pointer hover:opacity-80`;
  } else if (hasCompleted) {
    cellClasses += ` ${colors.components.dayCell.completed} cursor-pointer hover:opacity-80`;
  } else {
    cellClasses += ` ${colors.components.dayCell.empty} cursor-pointer hover:border-gray-600`;
  }

  // Today indicator
  if (day.isToday) {
    cellClasses += ` ${colors.components.dayCell.today}`;
  }

  // Past date and not admin - make read-only
  const isPastDate = day.date < new Date(new Date().setHours(0, 0, 0, 0));
  const isClickable = day.isCurrentMonth && (isAdminMode || !isPastDate || hasHolds);

  const handleClick = () => {
    if (isClickable) {
      onDayClick(day);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cellClasses}
      disabled={!isClickable}
      aria-label={`${day.date.toLocaleDateString()}, ${scheduledHolds.length} scheduled, ${completedHolds.length} completed`}
      title={!isClickable && isPastDate ? "Admin mode required to edit past dates" : undefined}
    >
      {/* Day number */}
      <span 
        className={`
          ${tokens.typography.body.secondary}
          font-semibold
          ${day.isToday ? 'text-white' : (isDarkMode ? colors.structural.text.primary : 'text-gray-900')}
        `}
      >
        {day.date.getDate()}
      </span>

      {/* Today badge */}
      {day.isToday && (
        <div className="absolute top-1 right-1">
          <div className={`w-2 h-2 ${tokens.borders.radius.full} ${colors.semantic.primary.solid}`} />
        </div>
      )}

      {/* Hold count indicators */}
      {hasHolds && (
        <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
          {hasScheduled && (
            <div 
              className={`
                ${tokens.typography.body.small}
                px-1.5 py-0.5
                ${tokens.borders.radius.sm}
                ${colors.semantic.scheduled.solid}
                text-white font-medium
              `}
              aria-label={`${scheduledHolds.length} scheduled`}
            >
              {scheduledHolds.length}
            </div>
          )}
          {hasCompleted && (
            <div 
              className={`
                ${tokens.typography.body.small}
                px-1.5 py-0.5
                ${tokens.borders.radius.sm}
                ${colors.semantic.success.solid}
                text-white font-medium
              `}
              aria-label={`${completedHolds.length} completed`}
            >
              {completedHolds.length}
            </div>
          )}
        </div>
      )}
    </button>
  );
}

