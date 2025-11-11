/**
 * NextUpCard Component
 * 
 * Compact information panel showing next firefighter up for each shift.
 * Designed to look like operational status tiles, not decorative buttons.
 * 
 * Design philosophy:
 * - Information first, decoration second
 * - Compact typography (9-11px scale)
 * - Shift colors as subtle accents, not overwhelming fills
 * - Professional tone suitable for 3am tired users
 */

import { Firefighter } from '@/lib/supabase';

interface NextUpCardProps {
  shift: "A" | "B" | "C";
  firefighter: Firefighter | null;
  isSelected?: boolean;
  onClick?: () => void;
}

// Shift color configuration (Red/Rose/Blue scheme)
const SHIFT_COLORS = {
  A: {
    border: "border-red-500/40",
    borderHover: "hover:border-red-500/70",
    pill: "border-red-500/40 bg-red-500/10 text-red-400",
    hoverText: "group-hover:text-red-300",
  },
  B: {
    border: "border-rose-500/40",
    borderHover: "hover:border-rose-500/70",
    pill: "border-rose-500/40 bg-rose-500/10 text-rose-400",
    hoverText: "group-hover:text-rose-300",
  },
  C: {
    border: "border-blue-500/40",
    borderHover: "hover:border-blue-500/70",
    pill: "border-blue-500/40 bg-blue-500/10 text-blue-400",
    hoverText: "group-hover:text-blue-300",
  },
};

export function NextUpCard({
  shift,
  firefighter,
  isSelected = false,
  onClick,
}: NextUpCardProps) {
  const colors = SHIFT_COLORS[shift];
  
  // Format last hold date
  const lastHold = firefighter?.last_hold_date
    ? new Date(firefighter.last_hold_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Never";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!firefighter}
      aria-label={`Next up for Shift ${shift}: ${firefighter?.name || "No one available"}`}
      className={`
        group flex flex-col items-start
        rounded-lg border bg-card
        px-3 py-2
        text-left
        shadow-md
        transition-all duration-200
        hover:shadow-lg hover:border-primary/50
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        ${colors.border} ${colors.borderHover}
        ${!firefighter ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""}
      `}
    >
      {/* Header: Shift pill */}
      <div className="mb-1.5 w-full">
        <span
          className={`
            inline-flex items-center
            rounded border
            px-1.5 py-0.5
            text-[10px] font-bold uppercase tracking-wide
            ${colors.pill}
          `}
        >
          {shift}
        </span>
      </div>

      {/* Firefighter name */}
      <div className="text-sm font-bold text-foreground leading-tight mb-1 truncate w-full">
        {firefighter?.name || "No one"}
      </div>

      {/* Station + Last hold */}
      {firefighter && (
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground w-full">
          <span className="truncate">
            {firefighter.fire_station ? `Stn ${firefighter.fire_station}` : "—"}
          </span>
          <span className="h-0.5 w-0.5 rounded-full bg-border flex-shrink-0" />
          <span className="truncate">{lastHold}</span>
        </div>
      )}
    </button>
  );
}
