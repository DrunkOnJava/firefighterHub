/**
 * NextUpBand Component
 * 
 * Structured, full-width band showing next firefighter up for each shift.
 * Professional operational status line with clear hierarchy.
 * 
 * Features:
 * - Clear section header with subtitle
 * - Responsive grid (1 col mobile → 3 cols desktop)
 * - Consistent color tokens across app
 * - Subtle, professional styling (not decorative)
 */

import { Firefighter } from "../lib/supabase";
import { NextUpCard } from "./NextUpCard";

interface NextUpBandProps {
  firefighters: Firefighter[];
  onFirefighterClick?: (firefighter: Firefighter | null) => void;
  selectedFirefighterId?: string | null;
}

export function NextUpBand({
  firefighters,
  onFirefighterClick,
  selectedFirefighterId,
}: NextUpBandProps) {
  // Get next up for each shift (first available firefighter)
  const getNextForShift = (shift: "A" | "B" | "C"): Firefighter | null => {
    const shiftFirefighters = firefighters
      .filter((ff) => ff.shift === shift && ff.is_available)
      .sort((a, b) => a.order_position - b.order_position);

    return shiftFirefighters[0] || null;
  };

  const nextA = getNextForShift("A");
  const nextB = getNextForShift("B");
  const nextC = getNextForShift("C");

  const handleCardClick = (firefighter: Firefighter | null) => {
    if (!firefighter || !onFirefighterClick) return;
    
    // Toggle selection
    if (selectedFirefighterId === firefighter.id) {
      onFirefighterClick(null);
    } else {
      onFirefighterClick(firefighter);
    }
  };

  return (
    <div className="w-full">
      {/* Section header */}
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Next Up
        </h2>
        <p className="text-[10px] text-muted-foreground/70">
          Hold rotation preview
        </p>
      </div>

      {/* Responsive card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <NextUpCard
          shift="A"
          firefighter={nextA}
          isSelected={nextA?.id === selectedFirefighterId}
          onClick={() => handleCardClick(nextA)}
        />
        <NextUpCard
          shift="B"
          firefighter={nextB}
          isSelected={nextB?.id === selectedFirefighterId}
          onClick={() => handleCardClick(nextB)}
        />
        <NextUpCard
          shift="C"
          firefighter={nextC}
          isSelected={nextC?.id === selectedFirefighterId}
          onClick={() => handleCardClick(nextC)}
        />
      </div>
    </div>
  );
}
