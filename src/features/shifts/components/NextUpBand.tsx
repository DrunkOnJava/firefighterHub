/**
 * NextUpBand Component
 * 
 * Full-width operational status line showing next firefighter up for each shift.
 * Uses responsive grid layout that adapts from 1 column (mobile) to 4 columns (wide desktop).
 * 
 * Design philosophy:
 * - Critical operational signal, not decorative element
 * - Compact, information-dense layout
 * - Professional tone for shift commanders making 3am decisions
 */

import { Firefighter } from '@/lib/supabase';
import { NextUpCard } from "./NextUpCard";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
  // Get next available firefighter for each shift (lowest order_position)
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
    <Card className="w-full shadow-xl border">
      <CardHeader className="px-4 py-3 border-b bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary">
              <svg
                className="w-5 h-5 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wide">
              Next Up
            </h2>
          </div>
          <span className="text-sm text-muted-foreground">
            Hold rotation
          </span>
        </div>
      </CardHeader>

      {/* Compact grid: 3 columns always */}
      <CardContent className="grid grid-cols-3 gap-4 p-4">
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
      </CardContent>
    </Card>
  );
}
