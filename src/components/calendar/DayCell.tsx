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

import { Shift } from "../../lib/supabase";
import { colors, tokens } from "../../styles";
import { CalendarDay } from "../../utils/calendarUtils";
import { getTheme } from "../../utils/theme";

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
  const theme = getTheme(isDarkMode);
  const hasHolds = day.scheduledHolds.length > 0;
  const scheduledHolds = day.scheduledHolds.filter(
    (h) => h.status === "scheduled"
  );
  const completedHolds = day.scheduledHolds.filter(
    (h) => h.status === "completed"
  );
  const hasScheduled = scheduledHolds.length > 0;
  const hasCompleted = completedHolds.length > 0;

  // Format name as "F. Lastname"
  const formatName = (fullName: string | null): string => {
    if (!fullName) return "Unknown";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0]; // Single name
    const firstInitial = parts[0][0]?.toUpperCase() || "";
    const lastName = parts[parts.length - 1];
    return `${firstInitial}. ${lastName}`;
  };

  // Determine styling based on state
  let cellClasses = `
    aspect-square w-full
    ${tokens.touchTarget.min}
    ${tokens.spacing.section.sm}
    ${tokens.borders.radius.md}
    ${tokens.borders.width.thin}
    ${tokens.transitions.fast}
    flex flex-col
    relative overflow-hidden
  `;

  if (!day.isCurrentMonth) {
    cellClasses += ` cursor-default opacity-30 ${theme.calendar.dayCellOtherMonth}`;
  } else if (hasScheduled && hasCompleted) {
    cellClasses += ` ${colors.components.dayCell.both} cursor-pointer ${theme.calendar.dayCellHover}`;
  } else if (hasScheduled) {
    cellClasses += ` ${colors.components.dayCell.scheduled} cursor-pointer ${theme.calendar.dayCellHover}`;
  } else if (hasCompleted) {
    cellClasses += ` ${colors.components.dayCell.completed} cursor-pointer ${theme.calendar.dayCellHover}`;
  } else {
    cellClasses += ` ${theme.calendar.dayCell} cursor-pointer ${theme.calendar.dayCellHover}`;
  }

  // Today indicator
  if (day.isToday) {
    cellClasses += ` ${colors.components.dayCell.today}`;
  }

  // Past date and not admin - make read-only
  const isPastDate = day.date < new Date(new Date().setHours(0, 0, 0, 0));
  const isClickable =
    day.isCurrentMonth && (isAdminMode || !isPastDate || hasHolds);

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
      aria-label={`${day.date.toLocaleDateString()}, ${
        scheduledHolds.length
      } scheduled, ${completedHolds.length} completed`}
      title={
        !isClickable && isPastDate
          ? "Admin mode required to edit past dates"
          : undefined
      }
    >
      {/* Day number - positioned in upper left */}
      <span
        className={`
          absolute top-1.5 left-1.5
          ${tokens.typography.body.secondary}
          font-semibold
          ${day.isToday ? "text-white" : theme.calendar.dayCellText}
        `}
      >
        {day.date.getDate()}
      </span>

      {/* Hold count indicators - positioned in upper right */}
      {hasHolds && (
        <div className="absolute top-1.5 right-1.5 flex gap-1">
          {hasScheduled && (
            <div
              className={`
                ${tokens.typography.body.small}
                px-2 py-1
                ${tokens.borders.radius.sm}
                ${colors.semantic.scheduled.solid}
                text-white font-medium
              `}
              aria-label={`${scheduledHolds.length} scheduled`}
              title={`${scheduledHolds.length} scheduled hold${
                scheduledHolds.length > 1 ? "s" : ""
              }`}
            >
              {scheduledHolds.length}
            </div>
          )}
          {hasCompleted && (
            <div
              className={`
                ${tokens.typography.body.small}
                px-2 py-1
                ${tokens.borders.radius.sm}
                ${colors.semantic.success.solid}
                text-white font-medium
              `}
              aria-label={`${completedHolds.length} completed`}
              title={`${completedHolds.length} completed hold${
                completedHolds.length > 1 ? "s" : ""
              }`}
            >
              {completedHolds.length}
            </div>
          )}
        </div>
      )}

      {/* Today badge - small dot next to counts if present, otherwise upper right */}
      {day.isToday && !hasHolds && (
        <div className="absolute top-1.5 right-1.5">
          <div
            className={`w-2 h-2 ${tokens.borders.radius.full} ${colors.semantic.primary.solid}`}
          />
        </div>
      )}

      {/* Firefighter names with stations - main content area */}
      {hasHolds && (
        <div className="mt-7 px-1 flex-1 flex flex-col gap-0.5 overflow-hidden">
          {scheduledHolds.map((hold, index) => {
            const formattedName = formatName(hold.firefighter_name);
            return (
              <div
                key={hold.id || index}
                className={`
                  text-xs
                  truncate
                  text-left
                  bg-sky-600
                  text-white
                  px-1.5 py-0.5
                  rounded-md
                `}
                title={`${hold.firefighter_name || "Unknown"}${
                  hold.fire_station ? ` - Station ${hold.fire_station}` : ""
                }`}
              >
                {formattedName}
                {hold.fire_station && (
                  <span className="ml-1 opacity-90">
                    (#{hold.fire_station})
                  </span>
                )}
              </div>
            );
          })}
          {completedHolds.map((hold, index) => {
            const formattedName = formatName(hold.firefighter_name);
            return (
              <div
                key={hold.id || index}
                className={`
                  text-xs
                  truncate
                  text-left
                  bg-sky-600/60
                  text-white
                  px-1.5 py-0.5
                  rounded-md
                `}
                title={`${hold.firefighter_name || "Unknown"}${
                  hold.fire_station ? ` - Station ${hold.fire_station}` : ""
                } (completed)`}
              >
                {formattedName}
                {hold.fire_station && (
                  <span className="ml-1 opacity-90">
                    (#{hold.fire_station})
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </button>
  );
}
