/**
 * DayCellLegacy - Original Day Cell Implementation
 *
 * Preserved for backward compatibility during MaterialM migration.
 * Renders an individual day cell in the calendar grid.
 */

import { Shift } from "../../lib/supabase";
import { tokens } from "../../styles";
import { CalendarDay } from "../../utils/calendarUtils";

interface DayCellLegacyProps {
  day: CalendarDay;
  onDayClick: (day: CalendarDay) => void;
  isAdminMode?: boolean;
  currentShift: Shift;
  isDarkMode?: boolean;
}

export function DayCellLegacy({
  day,
  onDayClick,
  isAdminMode = false,
}: DayCellLegacyProps) {
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

  // Determine styling based on state
  let cellClasses = `
    relative aspect-square w-full p-2 text-left
    ${tokens.transitions.fast}
    flex flex-col
  `;

  if (!day.isCurrentMonth) {
    cellClasses += ` bg-slate-800 text-gray-600 cursor-default opacity-50`;
  } else {
    cellClasses += ` bg-slate-800 text-gray-200 hover:bg-slate-700 cursor-pointer`;
  }

  // Today indicator
  if (day.isToday && day.isCurrentMonth) {
    cellClasses += ` ring-2 ring-inset ring-red-500`;
  }

  // Has holds - add left border
  if (hasHolds && day.isCurrentMonth) {
    cellClasses += ` border-l-4 border-l-red-500`;
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
      {/* Day content wrapper */}
      <div className="flex items-center justify-between mb-3">
        {/* Day number */}
        <div className={`text-base font-bold ${day.isCurrentMonth ? 'text-slate-200' : 'text-gray-600'}`}>
          {day.date.getDate()}
        </div>

        {/* Hold count badge */}
        {hasHolds && day.isCurrentMonth && (
          <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {day.scheduledHolds.length}
          </div>
        )}
      </div>

      {/* Holds list */}
      <div className="space-y-1">
        {/* Show first 8 holds */}
        {scheduledHolds.slice(0, 8).map((hold, index) => {
          const formattedName = formatName(hold.firefighter_name);

          return (
            <div
              key={hold.id || index}
              className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-100 font-semibold border-l-2 border-blue-500 flex items-center justify-between shadow-sm hover:bg-slate-600 transition-colors"
              title={`${hold.firefighter_name || "Unknown"}${
                hold.fire_station ? ` - Station ${hold.fire_station}` : ""
              }`}
            >
              <span className="truncate">{formattedName}</span>
              {hold.fire_station && (
                <span className="ml-1 flex-shrink-0 text-[10px]">
                  (#{hold.fire_station})
                </span>
              )}
            </div>
          );
        })}

        {completedHolds.slice(0, Math.max(0, 8 - scheduledHolds.length)).map((hold, index) => {
          const formattedName = formatName(hold.firefighter_name);

          return (
            <div
              key={hold.id || index}
              className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-100 font-semibold border-l-2 border-emerald-500 flex items-center justify-between shadow-sm hover:bg-slate-600 transition-colors"
              title={`${hold.firefighter_name || "Unknown"}${
                hold.fire_station ? ` - Station ${hold.fire_station}` : ""
              } (completed)`}
            >
              <span className="truncate">{formattedName}</span>
              {hold.fire_station && (
                <span className="ml-1 flex-shrink-0 text-[10px]">
                  (#{hold.fire_station})
                </span>
              )}
            </div>
          );
        })}

        {/* Show "more" indicator if there are additional holds */}
        {day.scheduledHolds.length > 8 && (
          <div className="text-[10px] text-gray-500 px-1.5">
            +{day.scheduledHolds.length - 8} more
          </div>
        )}
      </div>
    </button>
  );
}
