import { ScheduledHold } from "@/utils/calendarUtils";
import { cn } from "@/lib/utils";

interface EventBlockProps {
  event: ScheduledHold;
  onClick?: () => void;
}

/**
 * EventBlock - Calendr-style event display for calendar days
 *
 * Displays holds as rectangular blocks (not pills) with:
 * - Left border color accent
 * - Compact text layout
 * - Status-based color coding
 *
 * Design: Based on Calendr reference (blocks, not pills)
 */
export function EventBlock({ event, onClick }: EventBlockProps) {
  const getEventColorClass = (status: ScheduledHold['status']) => {
    switch (status) {
      case 'completed':
        // Teal for completed holds
        return 'bg-[hsl(var(--event-completed))] text-white border-l-4 border-teal-400';
      case 'skipped':
        // Red/destructive for skipped
        return 'bg-destructive text-destructive-foreground border-l-4 border-red-400';
      case 'scheduled':
      default:
        // Blue for scheduled holds (default)
        return 'bg-[hsl(var(--event-scheduled))] text-white border-l-4 border-blue-400';
    }
  };

  const handleClick = () => {
    try {
      onClick?.();
    } catch (error) {
      console.error('Failed to handle event click:', {
        eventId: event.id,
        firefighterId: event.firefighter_id,
        status: event.status,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={cn(
        "px-2 py-1 rounded text-xs font-medium",
        "truncate cursor-pointer",
        "hover:brightness-110 transition-all",
        getEventColorClass(event.status)
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`${event.firefighter_name} - ${event.status} hold`}
    >
      {/* Name + Duration in compact layout */}
      <div className="flex items-center gap-1">
        {event.duration && (
          <span className="opacity-80 text-[10px]">{event.duration}</span>
        )}
        <span className="truncate flex-1">{event.firefighter_name}</span>
      </div>
    </div>
  );
}
