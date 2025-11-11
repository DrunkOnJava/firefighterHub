/**
 * NextUpCard Component
 * 
 * Professional, structured card for displaying next firefighter up for each shift.
 * Uses consistent color tokens, subtle styling, and clear hierarchy.
 * 
 * Design: Based on professional UX feedback
 * - Subtle accent bar (not giant gradient fill)
 * - Semi-transparent backgrounds
 * - Consistent 9-11px typography scale
 * - Accessible with proper ARIA labels
 */

import { Firefighter } from "../lib/supabase";
import { MapPin, Calendar } from "lucide-react";

interface NextUpCardProps {
  shift: "A" | "B" | "C";
  firefighter: Firefighter | null;
  isSelected?: boolean;
  onClick?: () => void;
}

// Consistent color tokens (matches ShiftSelector)
const NEXT_UP_COLORS = {
  A: {
    border: "border-red-500/40",
    chipBg: "bg-red-500/10",
    chipText: "text-red-500",
    chipBorder: "border-red-500/40",
    accent: "bg-red-500",
    ring: "ring-red-500/30",
  },
  B: {
    border: "border-rose-500/40",
    chipBg: "bg-rose-500/10",
    chipText: "text-rose-500",
    chipBorder: "border-rose-500/40",
    accent: "bg-rose-500",
    ring: "ring-rose-500/30",
  },
  C: {
    border: "border-blue-500/40",
    chipBg: "bg-blue-500/10",
    chipText: "text-blue-500",
    chipBorder: "border-blue-500/40",
    accent: "bg-blue-500",
    ring: "ring-blue-500/30",
  },
};

export function NextUpCard({
  shift,
  firefighter,
  isSelected = false,
  onClick,
}: NextUpCardProps) {
  const color = NEXT_UP_COLORS[shift];
  
  return (
    <button
      onClick={onClick}
      disabled={!firefighter}
      className={`
        group relative flex flex-col justify-between
        rounded-xl border bg-card/70
        px-3 py-2.5
        text-left
        shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        ${color.border}
        ${isSelected ? `ring-2 ${color.ring}` : ""}
        ${!firefighter ? "opacity-60 cursor-default" : "cursor-pointer"}
      `}
      aria-label={`Next up for Shift ${shift}: ${firefighter?.name || "No assignment"}`}
      aria-pressed={isSelected}
    >
      {/* Shift label chip */}
      <div
        className={`
          inline-flex w-fit items-center gap-1.5
          rounded-full border px-2 py-0.5
          text-[10px] font-semibold tracking-wide
          ${color.chipBg} ${color.chipText} ${color.chipBorder}
        `}
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
        <span>Shift {shift}</span>
      </div>

      {/* Firefighter name */}
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-sm font-semibold truncate text-foreground">
          {firefighter?.name || "No available"}
        </span>
        {firefighter && (
          <span className="text-[9px] uppercase tracking-wide text-muted-foreground/70">
            Next
          </span>
        )}
      </div>

      {/* Meta information */}
      {firefighter && (
        <div className="mt-1.5 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">
              Station {firefighter.fire_station || "—"}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">
              {firefighter.last_hold_date
                ? new Date(firefighter.last_hold_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "Never"}
            </span>
          </div>
        </div>
      )}

      {/* Subtle accent bar on left edge */}
      <div
        className={`
          pointer-events-none absolute inset-y-1.5 left-1
          w-0.5 rounded-full ${color.accent}
        `}
      />
      
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-1.5 right-1.5">
          <div className={`w-2 h-2 rounded-full ${color.accent}`} />
        </div>
      )}
    </button>
  );
}
