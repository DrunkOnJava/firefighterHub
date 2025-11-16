import { Shift } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ShiftSelectorProps {
  currentShift: Shift;
  onShiftChange: (shift: Shift) => void;
}

// Consistent shift colors across the entire app
const SHIFT_COLORS = {
  A: {
    badge: "bg-red-500 text-white",
    text: "text-red-500",
    border: "border-red-500",
    ring: "ring-red-500/30",
  },
  B: {
    badge: "bg-red-600 text-white",
    text: "text-red-600",
    border: "border-red-600",
    ring: "ring-red-600/30",
  },
  C: {
    badge: "bg-blue-500 text-white",
    text: "text-blue-500",
    border: "border-blue-500",
    ring: "ring-blue-500/30",
  },
};

// For backwards compatibility
const SHIFT_BADGE_COLORS = {
  A: SHIFT_COLORS.A.badge,
  B: SHIFT_COLORS.B.badge,
  C: SHIFT_COLORS.C.badge,
};

export function ShiftSelector({
  currentShift,
  onShiftChange,
}: ShiftSelectorProps) {
  const shifts: Shift[] = ["A", "B", "C"];

  const getShiftClasses = (shift: Shift, isActive: boolean) => {
    const baseClasses = "font-bold transition-all duration-200 relative";
    const shiftColor = SHIFT_COLORS[shift];
    
    if (isActive) {
      // Selected state: Keep shift color + add white border/ring/scale
      return `${baseClasses} ${shiftColor.badge} border-2 border-white ring-4 ${shiftColor.ring} scale-110 shadow-lg`;
    }
    
    // Inactive state: Show shift color text on neutral background
    return `${baseClasses} bg-muted/50 ${shiftColor.text} hover:bg-muted/80 border-2 ${shiftColor.border} border-opacity-30`;
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
