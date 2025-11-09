import { Shift } from "../lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ShiftSelectorProps {
  currentShift: Shift;
  onShiftChange: (shift: Shift) => void;
}

const SHIFT_BADGE_COLORS = {
  A: "bg-emerald-600 text-white",
  B: "bg-blue-600 text-white",
  C: "bg-red-600 text-white",
};

export function ShiftSelector({
  currentShift,
  onShiftChange,
}: ShiftSelectorProps) {
  const shifts: Shift[] = ["A", "B", "C"];

  const getShiftClasses = (shift: Shift, isActive: boolean) => {
    const baseClasses = "font-bold transition-all duration-150";
    
    if (isActive) {
      if (shift === "A") return `${baseClasses} bg-emerald-600 text-white hover:bg-emerald-700`;
      if (shift === "B") return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
      if (shift === "C") return `${baseClasses} bg-red-600 text-white hover:bg-red-700`;
    }
    
    return `${baseClasses} bg-secondary text-secondary-foreground hover:bg-secondary/80`;
  };

  return (
    <div
      className="inline-flex gap-1 p-1 rounded-lg bg-muted"
      role="group"
      aria-label="Shift selector"
    >
      {shifts.map((shift) => {
          const isActive = currentShift === shift;

          return (
            <Button
              key={shift}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onShiftChange(shift)}
              className={getShiftClasses(shift, isActive)}
              aria-label={`Switch to Shift ${shift}`}
              aria-pressed={isActive}
              title={`Shift ${shift}${isActive ? ' (Active)' : ''}`}
            >
              {shift}
            </Button>
          );
        })}
    </div>
  );
}

export function ShiftBadge({ shift }: { shift: Shift }) {
  return (
    <Badge className={`${SHIFT_BADGE_COLORS[shift]} font-bold`}>
      {shift}
    </Badge>
  );
}
