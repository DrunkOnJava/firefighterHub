/**
 * DayCell - Calendar Day Cell Component
 *
 * Renders an individual day cell in the calendar grid.
 * Automatically switches between MaterialM and legacy styling based on feature flag.
 *
 * Shows:
 * - Day number with today indicator
 * - Hold count badge
 * - Event pills for scheduled/completed holds
 * - Visual states for different hold statuses
 *
 * @example
 * ```tsx
 * <DayCell
 *   day={calendarDay}
 *   onDayClick={handleDayClick}
 *   isAdminMode={isAdminMode}
 *   currentShift={currentShift}
 * />
 * ```
 */

import { useFeatureFlag } from "../../hooks/useFeatureFlag";
import { Shift } from "../../lib/supabase";
import { CalendarDay } from "../../utils/calendarUtils";
import { BadgeM3, CountBadgeM3 } from "../m3/BadgeM3";
import { DayCellLegacy } from "./DayCellLegacy";

interface DayCellProps {
  day: CalendarDay;
  onDayClick: (day: CalendarDay) => void;
  isAdminMode?: boolean;
  currentShift: Shift;
  isDarkMode?: boolean;
}

/**
 * MaterialM Day Cell Component
 */
function DayCellM3({
  day,
  onDayClick,
  isAdminMode = false,
}: DayCellProps) {
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
  let cellClasses = "relative w-full min-h-[120px] p-3 text-left transition-all duration-200 flex flex-col rounded-materialm-md border";

  if (!day.isCurrentMonth) {
    cellClasses += " bg-materialm-darkgray opacity-40 text-gray-400 cursor-default border-transparent";
  } else {
    cellClasses += " bg-white dark:bg-materialm-dark text-gray-900 dark:text-white hover:shadow-materialm-2 cursor-pointer border-materialm-border dark:border-materialm-border-dark";
  }

  // Today indicator (red ring + today badge)
  if (day.isToday && day.isCurrentMonth) {
    cellClasses += " ring-2 ring-inset ring-red-500";
  }

  // Has holds - add elevation
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
          {/* Day number */}
          <span className={`text-base font-bold ${day.isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
            {day.date.getDate()}
          </span>

          {/* Today badge */}
          {day.isToday && day.isCurrentMonth && (
            <BadgeM3 color="error" size="xs">
              Today
            </BadgeM3>
          )}
        </div>

        {/* Hold count badge */}
        {hasHolds && day.isCurrentMonth && day.scheduledHolds.length > 2 && (
          <CountBadgeM3 count={day.scheduledHolds.length} color="info" />
        )}
      </div>

      {/* Holds list - Event pills */}
      <div className="space-y-1.5 flex-1 overflow-hidden">
        {/* Scheduled holds - Blue theme */}
        {scheduledHolds.slice(0, 2).map((hold, index) => {
          const formattedName = formatName(hold.firefighter_name);

          return (
            <div
              key={hold.id || index}
              className="text-xs px-2.5 py-1.5 rounded-md bg-materialm-primary-light text-materialm-primary font-medium border-l-3 border-materialm-primary shadow-sm hover:opacity-80 transition-all"
              title={`${hold.firefighter_name || "Unknown"}${
                hold.fire_station ? ` - Station ${hold.fire_station}` : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-semibold">{formattedName}</span>
                {hold.fire_station && (
                  <span className="flex-shrink-0 text-blue-700 dark:text-blue-300 font-bold">
                    #{hold.fire_station}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Completed holds - Gray theme with strikethrough */}
        {completedHolds.slice(0, Math.max(0, 2 - scheduledHolds.length)).map((hold, index) => {
          const formattedName = formatName(hold.firefighter_name);

          return (
            <div
              key={hold.id || index}
              className="text-xs px-2.5 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium border-l-3 border-l-gray-400 dark:border-l-gray-600 shadow-sm opacity-70"
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

        {/* "More" indicator */}
        {day.scheduledHolds.length > 2 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 px-2 pt-1 font-medium">
            +{day.scheduledHolds.length - 2} more
          </div>
        )}
      </div>
    </button>
  );
}

/**
 * Day Cell Component with Feature Flag
 *
 * Switches between MaterialM and legacy versions.
 */
export function DayCell(props: DayCellProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <DayCellLegacy {...props} />;
  }

  return <DayCellM3 {...props} />;
}
