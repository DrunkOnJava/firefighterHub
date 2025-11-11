import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyCalendarStateProps {
  onScheduleHold: () => void;
}

/**
 * EmptyCalendarState - Calendr-inspired empty state
 * 
 * Displayed when no holds are scheduled for the current month.
 * Provides clear call-to-action to create the first hold.
 * 
 * Design: Based on Calendr Screen 19 (Empty state)
 */
export function EmptyCalendarState({ onScheduleHold }: EmptyCalendarStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Icon container */}
      <div className="rounded-full bg-muted p-8 mb-6">
        <CalendarIcon className="w-16 h-16 text-muted-foreground" />
      </div>

      {/* Heading */}
      <h3 className="text-2xl font-semibold mb-3 text-foreground">
        No holds scheduled
      </h3>

      {/* Description */}
      <p className="text-muted-foreground text-center max-w-md mb-8 text-base">
        Get started by scheduling a hold for your shift members.
        Holds will appear on the calendar once created.
      </p>

      {/* Call to action */}
      <Button 
        size="lg" 
        onClick={onScheduleHold}
        className="gap-2"
      >
        <CalendarIcon className="w-4 h-4" />
        Schedule Hold
      </Button>
    </div>
  );
}
