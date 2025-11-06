/**
 * DayCellM3 - MaterialM Calendar Day Cell Component
 *
 * Renders an individual day cell in the calendar grid using MaterialM color system.
 * Supports 8 event pills maximum with automatic overflow handling.
 *
 * Shows:
 * - Day number with today indicator
 * - Hold count badge (when > 8 holds)
 * - Event pills for scheduled/completed holds
 * - Visual states for different hold statuses
 *
 * MaterialM Colors:
 * - Backgrounds: bg-materialm-dark, bg-materialm-darkgray
 * - Primary (scheduled): bg-materialm-primary, text-materialm-primary
 * - Tertiary (completed): Uses darkgray with reduced opacity
 * - Error (today): ring-materialm-error, bg-materialm-error
 * - Borders: border-materialm-border-dark
 * - Text: text-materialm-text, text-materialm-text-disabled
 * - Shadows: shadow-materialm-1, shadow-materialm-2, shadow-materialm-3
 *
 * @example
 * ```tsx
 * <DayCellM3
 *   day={calendarDay}
 *   onDayClick={handleDayClick}
 *   isAdminMode={isAdminMode}
 *   currentShift={currentShift}
 * />
 * ```
 */

import { Shift } from "../../lib/supabase";
import { CalendarDay } from "../../utils/calendarUtils";
import { BadgeM3, CountBadgeM3 } from "../m3/BadgeM3";

interface DayCellM3Props {
  day: CalendarDay;
  onDayClick: (day: CalendarDay) => void;
  isAdminMode?: boolean;
  currentShift: Shift;
  isDarkMode?: boolean;
}

/**
 * MaterialM Day Cell Component
 */
export function DayCellM3({
  day,
  onDayClick,
  isAdminMode = false,
}: DayCellM3Props) {
  const hasHolds = day.scheduledHolds.length > 0;
  const scheduledHolds = day.scheduledHolds.filter(
    (h) => h.status === "scheduled"
  );
  const completedHolds = day.scheduledHolds.filter(
    (h) => h.status === "completed"
  );

  // Format name as "F. Lastname"
  const formatName = (fullName: string | null): string => {
    if (!fullName) return "Unknown";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    const firstInitial = parts[0][0]?.toUpperCase() || "";
    const lastName = parts[parts.length - 1];
    return `${firstInitial}. ${lastName}`;
  };

  // Past date logic
  const isPastDate = day.date < new Date(new Date().setHours(0, 0, 0, 0));
  const isClickable =
    day.isCurrentMonth && (isAdminMode || !isPastDate || hasHolds);

  const handleClick = () => {
    if (isClickable) {
      onDayClick(day);
    }
  };

  // Build cell classes with MaterialM OKLCH color palette
  let cellClasses = "relative w-full min-h-[100px] p-2.5 text-left transition-all duration-200 flex flex-col rounded-materialm-md border";

  if (!day.isCurrentMonth) {
    // Out-of-month days: darkgray background with reduced opacity
    cellClasses += " bg-materialm-darkgray opacity-40 text-materialm-text-disabled cursor-default border-transparent";
  } else {
    // Current month days: white (light mode) or dark (dark mode)
    cellClasses += " bg-white dark:bg-materialm-dark text-gray-900 dark:text-materialm-text hover:shadow-materialm-2 cursor-pointer border-materialm-border-dark";
  }

  // Today indicator: MaterialM error color (red) with ring
  if (day.isToday && day.isCurrentMonth) {
    cellClasses += " ring-2 ring-inset ring-materialm-error";
  }

  // Has holds - add elevation using MaterialM shadow system
  if (hasHolds && day.isCurrentMonth) {
    cellClasses += " shadow-materialm-1 hover:shadow-materialm-3";
  }

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
      {/* Day number and badges */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Day number with MaterialM text colors */}
          <span className={`text-base font-bold ${day.isCurrentMonth ? 'text-gray-900 dark:text-materialm-text' : 'text-materialm-text-disabled'}`}>
            {day.date.getDate()}
          </span>

          {/* Today badge: MaterialM error color */}
          {day.isToday && day.isCurrentMonth && (
            <BadgeM3 color="error" size="xs">
              Today
            </BadgeM3>
          )}
        </div>

        {/* Hold count badge: MaterialM info color */}
        {hasHolds && day.isCurrentMonth && day.scheduledHolds.length > 8 && (
          <CountBadgeM3 count={day.scheduledHolds.length} color="info" />
        )}
      </div>

      {/* Holds list - Event pills (supports 8 pills maximum) */}
      <div className="space-y-1 flex-1 overflow-hidden">
        {/* Scheduled holds - MaterialM primary theme (blue) */}
        {scheduledHolds.slice(0, 8).map((hold, index) => {
          const formattedName = formatName(hold.firefighter_name);

          return (
            <div
              key={hold.id || index}
              className="text-xs px-2 py-1 rounded-md bg-materialm-primary-light text-materialm-primary font-medium border-l-3 border-materialm-primary shadow-sm hover:opacity-80 transition-all"
              title={`${hold.firefighter_name || "Unknown"}${
                hold.fire_station ? ` - Station ${hold.fire_station}` : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-semibold">{formattedName}</span>
                {hold.fire_station && (
                  <span className="flex-shrink-0 text-materialm-primary font-bold">
                    #{hold.fire_station}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Completed holds - MaterialM darkgray theme with strikethrough */}
        {completedHolds.slice(0, Math.max(0, 8 - scheduledHolds.length)).map((hold, index) => {
          const formattedName = formatName(hold.firefighter_name);

          return (
            <div
              key={hold.id || index}
              className="text-xs px-2 py-1 rounded-md bg-materialm-darkgray text-materialm-text-secondary font-medium border-l-3 border-l-materialm-border-dark shadow-sm opacity-70"
              title={`${hold.firefighter_name || "Unknown"}${
                hold.fire_station ? ` - Station ${hold.fire_station}` : ""
              } (completed)`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate line-through">{formattedName}</span>
                {hold.fire_station && (
                  <span className="flex-shrink-0 line-through">
                    #{hold.fire_station}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* "More" indicator - MaterialM text-secondary */}
        {day.scheduledHolds.length > 8 && (
          <div className="text-xs text-materialm-text-secondary px-2 pt-0.5 font-medium">
            +{day.scheduledHolds.length - 8} more
          </div>
        )}
      </div>
    </button>
  );
}
