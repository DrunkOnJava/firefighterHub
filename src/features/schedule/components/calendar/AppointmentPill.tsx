import { ScheduledHold } from "@/utils/calendarUtils";

interface AppointmentPillProps {
  appointment: ScheduledHold;
  onClick?: () => void;
}

/**
 * AppointmentPill - Compact hold display for calendar days
 * 
 * Shows hold information within calendar day cells.
 * Color-coded by status (scheduled/completed/skipped).
 * 
 * Design: Based on Calendr Screen 20 (Fill state)
 */
export function AppointmentPill({ appointment, onClick }: AppointmentPillProps) {
  const statusStyles: Record<ScheduledHold['status'], string> = {
    scheduled: 'border-l-warning bg-warning/10 hover:bg-warning/20',
    completed: 'border-l-success bg-success/10 hover:bg-success/20',
    skipped: 'border-l-destructive bg-destructive/10 hover:bg-destructive/20',
  };

  const statusStyle = statusStyles[appointment.status];

  return (
    <div
      className={`
        px-2 py-1 rounded-md border-l-4 text-xs
        ${statusStyle}
        transition-colors cursor-pointer
      `}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`${appointment.firefighter_name} - ${appointment.status} hold`}
    >
      {/* Name */}
      <div className="font-medium truncate text-foreground">
        {appointment.firefighter_name}
      </div>

      {/* Duration */}
      <div className="text-muted-foreground text-[10px]">
        {appointment.duration}
      </div>
    </div>
  );
}
