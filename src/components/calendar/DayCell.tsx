/**
 * DayCell Component
 *
 * Renders an individual day cell in the calendar grid.
 * Shows:
 * - Day number
 * - Today indicator (strong accent fill)
 * - Hold count badges (scheduled/completed)
 * - Visual states for scheduled/completed holds
 * - Hover and selected states
 */

import { Shift } from "../../lib/supabase";
import { CalendarDay } from "../../utils/calendarUtils";

interface DayCellProps {
  day: CalendarDay;
  onDayClick: (day: CalendarDay) => void;
  isAdminMode?: boolean;
  currentShift: Shift;
  selectedFirefighterId?: string | null;
}

export function DayCell({
  day,
  onDayClick,
  isAdminMode = false,
  selectedFirefighterId = null,
}: DayCellProps) {
  const hasHolds = day.scheduledHolds.length > 0;
  const scheduledHolds = day.scheduledHolds.filter(
    (h) => h.status === "scheduled"
  );
  const completedHolds = day.scheduledHolds.filter(
    (h) => h.status === "completed"
  );

  // Check if any holds belong to the selected firefighter
  const hasSelectedFF = selectedFirefighterId 
    ? day.scheduledHolds.some(h => h.firefighter_id === selectedFirefighterId)
    : false;

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
    relative w-full p-3 text-left
    min-h-[44px] min-w-[44px]
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
    flex flex-col
    aspect-square
    rounded-xl
    border-2
  `;

  if (!day.isCurrentMonth) {
    cellClasses += ` bg-muted/20 border-border/20 text-muted-foreground cursor-default opacity-30`;
  } else {
    // Base state - gradient background with depth
    cellClasses += `
      bg-gradient-to-br from-card via-card to-card/95
      border-border/60
      text-foreground
      hover:border-primary/40
      hover:shadow-lg
      hover:scale-[1.02]
      hover:-translate-y-0.5
      cursor-pointer
      active:scale-[0.98]
      shadow-sm
    `;
  }

  // Today indicator - MAXIMUM visual prominence
  if (day.isToday && day.isCurrentMonth) {
    cellClasses += `
      !bg-gradient-to-br !from-blue-500/30 !via-purple-500/20 !to-blue-600/30
      dark:!from-blue-500/40 dark:!via-purple-500/30 dark:!to-blue-600/40
      !border-blue-500/80
      !shadow-2xl
      !shadow-blue-500/50
      ring-4 ring-blue-500/30
      scale-105
    `;
  }

  // Has holds - add left border accent with glow
  if (hasHolds && day.isCurrentMonth) {
    cellClasses += ` border-l-4 !border-l-orange-500 bg-orange-50/30 dark:bg-orange-950/20`;
  }

  // Selected firefighter highlight - accent outline
  if (hasSelectedFF && day.isCurrentMonth) {
    cellClasses += ` ring-2 ring-blue-400 ring-offset-2 ring-offset-background`;
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
        <div className={`
          text-lg font-bold tracking-tight
          ${day.isToday
            ? 'text-blue-700 dark:text-blue-200 drop-shadow-sm'
            : day.isCurrentMonth
              ? 'text-foreground'
              : 'text-muted-foreground'
          }
        `}>
          {day.date.getDate()}
        </div>

        {/* Hold count badge */}
        {hasHolds && day.isCurrentMonth && (
          <div className="
            bg-gradient-to-br from-orange-500 to-red-600
            text-white rounded-full w-7 h-7
            flex items-center justify-center
            text-xs font-extrabold
            shadow-lg shadow-orange-500/50
            ring-2 ring-white/20
            transition-transform hover:scale-110
          ">
            {day.scheduledHolds.length}
          </div>
        )}
      </div>

      {/* Holds list - show first 3, compact pills */}
      <div className="space-y-1.5 flex-1">
        {/* Show first 3 holds - MODERN PILL DESIGN */}
        {scheduledHolds.slice(0, 3).map((hold, index) => {
          const formattedName = formatName(hold.firefighter_name);
          const isSelected = hold.firefighter_id === selectedFirefighterId;

          return (
            <div
              key={hold.id || index}
              className={`
                text-[11px] px-2.5 py-1.5 rounded-lg
                bg-gradient-to-r from-orange-500 via-orange-600 to-red-600
                text-white font-bold
                border-2 ${isSelected ? 'border-blue-400 ring-2 ring-blue-400/60' : 'border-orange-300/40'}
                flex items-center justify-between
                shadow-md shadow-orange-600/30
                hover:shadow-lg hover:shadow-orange-600/50
                hover:scale-[1.02]
                transition-all duration-200
                backdrop-blur-sm
              `}
              title={`${hold.firefighter_name || "Unknown"}${
                hold.fire_station ? ` - Station ${hold.fire_station}` : ""
              }`}
            >
              <span className="whitespace-nowrap drop-shadow-md">{formattedName}</span>
              {hold.fire_station && (
                <span className="ml-1.5 flex-shrink-0 text-orange-50 font-extrabold text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
                  #{hold.fire_station}
                </span>
              )}
            </div>
          );
        })}

        {completedHolds.slice(0, 3 - scheduledHolds.length).map((hold, index) => {
          const formattedName = formatName(hold.firefighter_name);
          const isSelected = hold.firefighter_id === selectedFirefighterId;

          return (
            <div
              key={hold.id || index}
              className={`
                text-[11px] px-2.5 py-1.5 rounded-lg
                bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600
                text-white font-bold
                border-2 ${isSelected ? 'border-blue-400 ring-2 ring-blue-400/60' : 'border-emerald-300/40'}
                flex items-center justify-between
                shadow-md shadow-emerald-600/30
                hover:shadow-lg hover:shadow-emerald-600/50
                hover:scale-[1.02]
                transition-all duration-200
                backdrop-blur-sm opacity-95
              `}
              title={`${hold.firefighter_name || "Unknown"}${
                hold.fire_station ? ` - Station ${hold.fire_station}` : ""
              } (completed)`}
            >
              <span className="whitespace-nowrap drop-shadow-md">{formattedName}</span>
              {hold.fire_station && (
                <span className="ml-1.5 flex-shrink-0 text-emerald-50 font-extrabold text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
                  #{hold.fire_station}
                </span>
              )}
            </div>
          );
        })}

        {/* Show "more" indicator if there are additional holds */}
        {day.scheduledHolds.length > 3 && (
          <div className="text-[10px] text-muted-foreground px-1.5 font-semibold">
            +{day.scheduledHolds.length - 3} more
          </div>
        )}
      </div>
    </button>
  );
}
