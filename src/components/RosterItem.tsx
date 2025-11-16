import { useState } from "react";
import { Firefighter } from "@/lib/supabase";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface RosterItemProps {
  firefighter: Firefighter;
  number: number;
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * RosterItem - Individual firefighter entry in Calendr-style sidebar
 *
 * Features:
 * - Compact display with number prefix
 * - Expandable details on click
 * - Hover state with subtle background
 * - Chevron rotation animation
 */
export function RosterItem({ firefighter, number, isSelected, onClick }: RosterItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    onClick?.();
  };

  const formatLastHold = (date: string | null) => {
    if (!date) return "Never";
    try {
      return format(new Date(date), "MMM d, yyyy");
    } catch (error) {
      console.error('Failed to parse firefighter last_hold_date:', {
        firefighterId: firefighter.id,
        firefighterName: firefighter.name,
        rawDate: date,
        error: error instanceof Error ? error.message : String(error)
      });
      return "Invalid date";
    }
  };

  return (
    <div className="w-full">
      <button
        className={cn(
          "w-full px-3 py-2 rounded-md",
          "flex items-center justify-between",
          "hover:bg-muted/50 transition-colors",
          "text-left group",
          isSelected && "bg-primary/10 hover:bg-primary/15"
        )}
        onClick={handleClick}
        aria-expanded={isExpanded}
        aria-label={`Firefighter ${number}: ${firefighter.name}`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-muted-foreground text-sm font-medium flex-shrink-0">
            {number}.
          </span>
          <span className="text-foreground font-medium truncate">
            {firefighter.name}
          </span>
          {!firefighter.is_available && (
            <span className="text-[10px] text-muted-foreground italic">
              (unavailable)
            </span>
          )}
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground flex-shrink-0",
            "group-hover:text-foreground",
            "transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="pl-8 pr-3 py-2 text-sm text-muted-foreground space-y-1">
          {firefighter.fire_station && (
            <div className="flex justify-between">
              <span className="text-xs">Station:</span>
              <span className="text-xs font-medium">{firefighter.fire_station}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-xs">Shift:</span>
            <span className="text-xs font-medium">{firefighter.shift}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs">Position:</span>
            <span className="text-xs font-medium">#{firefighter.order_position}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs">Last Hold:</span>
            <span className="text-xs font-medium">
              {formatLastHold(firefighter.last_hold_date)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
