/**
 * CalendarDayContent Component
 *
 * Custom day content renderer for calendar that displays:
 * - Hold event pills using shadcn Badge component
 * - Scheduled holds (orange/red gradient)
 * - Completed holds (green gradient)
 * - Station numbers
 */

import { ScheduledHold } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CalendarDayContentProps {
  date: Date;
  scheduledHolds: ScheduledHold[];
  selectedFirefighterId?: string | null;
}

export function CalendarDayContent({
  date,
  scheduledHolds,
  selectedFirefighterId,
}: CalendarDayContentProps) {
  const holdsForDate = scheduledHolds.filter(hold => {
    if (!hold.hold_date) return false;
    const holdDate = new Date(hold.hold_date);
    return holdDate.toDateString() === date.toDateString();
  });

  const scheduledOnly = holdsForDate.filter(h => h.status === 'scheduled');
  const completedOnly = holdsForDate.filter(h => h.status === 'completed');

  return (
    <div className="flex flex-col gap-0.5 w-full h-full p-1.5 min-h-[80px]">
      {/* Day number with hold count badge - ALWAYS SHOW */}
      <div className="flex items-center justify-between mb-1 flex-shrink-0">
        <span className="text-base font-bold text-foreground">{date.getDate()}</span>
        {holdsForDate.length > 0 && (
          <Badge
            variant="destructive"
            className="h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full"
          >
            {holdsForDate.length}
          </Badge>
        )}
      </div>

      {/* Hold pills - show first 4 (only if there are holds) */}
      {holdsForDate.length > 0 && (
        <div className="flex flex-col gap-0.5 overflow-hidden flex-1">
          {scheduledOnly.slice(0, 4).map((hold, index) => {
            const isSelected = hold.firefighter_id === selectedFirefighterId;
            const name = hold.firefighter_name || "Unknown";
            // Calculate text size based on name length
            const textSize = name.length > 20 ? 'text-[7px]' : name.length > 15 ? 'text-[8px]' : 'text-[9px]';

            return (
              <Badge
                key={hold.id || index}
                className={cn(
                  textSize,
                  "px-1.5 py-0 justify-between gap-1 h-4 min-h-4 whitespace-nowrap",
                  "bg-gradient-to-r from-orange-500 via-orange-600 to-red-600",
                  "border-orange-300/40 text-white font-bold",
                  "hover:shadow-md transition-all",
                  isSelected && "ring-2 ring-blue-400 border-blue-400"
                )}
                title={`${name}${
                  hold.fire_station ? ` - Station ${hold.fire_station}` : ""
                }`}
              >
                <span className="leading-none">{name}</span>
                {hold.fire_station && (
                  <span className="flex-shrink-0 bg-white/20 px-1 rounded text-[7px] leading-none">
                    #{hold.fire_station}
                  </span>
                )}
              </Badge>
            );
          })}

          {completedOnly.slice(0, 4 - scheduledOnly.length).map((hold, index) => {
            const isSelected = hold.firefighter_id === selectedFirefighterId;
            const name = hold.firefighter_name || "Unknown";
            // Calculate text size based on name length
            const textSize = name.length > 20 ? 'text-[7px]' : name.length > 15 ? 'text-[8px]' : 'text-[9px]';

            return (
              <Badge
                key={hold.id || index}
                className={cn(
                  textSize,
                  "px-1.5 py-0 justify-between gap-1 h-4 min-h-4 whitespace-nowrap opacity-90",
                  "bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600",
                  "border-emerald-300/40 text-white font-bold",
                  "hover:shadow-md transition-all",
                  isSelected && "ring-2 ring-blue-400 border-blue-400"
                )}
                title={`${name}${
                  hold.fire_station ? ` - Station ${hold.fire_station}` : ""
                } (completed)`}
              >
                <span className="leading-none">{name}</span>
                {hold.fire_station && (
                  <span className="flex-shrink-0 bg-white/20 px-1 rounded text-[7px] leading-none">
                    #{hold.fire_station}
                  </span>
                )}
              </Badge>
            );
          })}

          {/* Show "+X more" if there are additional holds */}
          {holdsForDate.length > 4 && (
            <span className="text-[9px] text-muted-foreground font-medium">
              +{holdsForDate.length - 4} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
