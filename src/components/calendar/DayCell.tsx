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
import { tokens } from "../../styles";
import { CalendarDay } from "../../utils/calendarUtils";

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
    if (parts.length === 1) return parts[0]; // Single name
    const firstInitial = parts[0][0]?.toUpperCase() || "";
    const lastName = parts[parts.length - 1];
    return `${firstInitial}. ${lastName}`;
  };

  // Determine styling based on state - WCAG 2.5.5: 44px minimum touch targets
  let cellClasses = `
    relative w-full p-2 text-left
    ${tokens.touchTarget.min} min-w-[44px]
    ${tokens.transitions.fast}
    ${tokens.focus.default}
    flex flex-col
    aspect-square
    rounded-xl
    border-2
  `;

  if (!day.isCurrentMonth) {
    cellClasses += ` bg-slate-800/30 border-slate-700/20 text-gray-600 cursor-default opacity-40`;
  } else {
    cellClasses += ` bg-slate-800/80 border-slate-700/40 text-gray-200 hover:bg-slate-750 hover:border-slate-600/60 hover:shadow-md cursor-pointer active:bg-slate-700`;
  }

  // Today indicator - STRONG accent fill (HIGHEST PRIORITY)
  if (day.isToday && day.isCurrentMonth) {
    cellClasses += ` !bg-gradient-to-br !from-blue-600/30 !to-blue-700/40 !border-blue-500 !shadow-xl !shadow-blue-500/30 ring-2 ring-blue-500/50`;
  }

  // Has holds - add left border accent
  if (hasHolds && day.isCurrentMonth) {
    cellClasses += ` border-l-4 !border-l-orange-500`;
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
      <div className="flex items-center justify-between mb-2">
        {/* Day number */}
        <div className={`text-base font-extrabold ${
          day.isToday ? 'text-blue-200' : day.isCurrentMonth ? 'text-slate-100' : 'text-gray-600'
        }`}>
          {day.date.getDate()}
        </div>

        {/* Hold count badge */}
        {hasHolds && day.isCurrentMonth && (
          <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-extrabold shadow-lg">
            {day.scheduledHolds.length}
          </div>
        )}
      </div>

      {/* Holds list */}
      <div className="space-y-1">
        {/* Show first 2 holds */}
        {scheduledHolds.slice(0, 2).map((hold, index) => {
          const formattedName = formatName(hold.firefighter_name);
          
          return (
            <div
              key={hold.id || index}
              className="text-[10px] px-1.5 py-0.5 rounded bg-orange-600/90 text-white font-bold border-l-2 border-orange-400 flex items-center justify-between shadow-sm hover:bg-orange-500 transition-colors"
              title={`${hold.firefighter_name || "Unknown"}${
                hold.fire_station ? ` - Station ${hold.fire_station}` : ""
              }`}
            >
              <span className="truncate">{formattedName}</span>
              {hold.fire_station && (
                <span className="ml-1 flex-shrink-0 text-orange-200">
                  #{hold.fire_station}
                </span>
              )}
            </div>
          );
        })}
        
        {completedHolds.slice(0, 2 - scheduledHolds.length).map((hold, index) => {
          const formattedName = formatName(hold.firefighter_name);
          
          return (
            <div
              key={hold.id || index}
              className="text-[10px] px-1.5 py-0.5 rounded bg-green-700/80 text-white font-semibold border-l-2 border-green-500 flex items-center justify-between shadow-sm hover:bg-green-600 transition-colors opacity-75"
              title={`${hold.firefighter_name || "Unknown"}${
                hold.fire_station ? ` - Station ${hold.fire_station}` : ""
              } (completed)`}
            >
              <span className="truncate">{formattedName}</span>
              {hold.fire_station && (
                <span className="ml-1 flex-shrink-0">
                  (#{hold.fire_station})
                </span>
              )}
            </div>
          );
        })}

        {/* Show "more" indicator if there are additional holds */}
        {day.scheduledHolds.length > 2 && (
          <div className="text-xs text-gray-500 px-2.5">
            +{day.scheduledHolds.length - 2} more
          </div>
        )}
      </div>
    </button>
  );
}
