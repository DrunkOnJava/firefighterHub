import { CheckSquare, Square, HandHeart } from "lucide-react";
import { Firefighter } from "@/lib/supabase";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatHoldDate } from "@/utils/dateUtils";

interface RosterTableRowProps {
  firefighter: Firefighter;
  index: number;
  isAdminMode: boolean;
  isSelected: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  isNextInRotation: boolean;
  onToggleSelection: (id: string) => void;
  onViewProfile: (ff: Firefighter) => void;
  onVolunteerHold?: (id: string) => void;
  onCompleteHold: (id: string) => void;
  onTransferShift: (id: string) => void;
  onDeactivate: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
}

export function RosterTableRow({
  firefighter,
  index,
  isAdminMode,
  isSelected,
  isDragging,
  isDragOver,
  isNextInRotation,
  onToggleSelection,
  onViewProfile,
  onVolunteerHold,
  // onCompleteHold, // Unused - handled by parent component
  // onTransferShift, // Unused - handled by parent component
  // onDeactivate, // Unused - handled by parent component
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: RosterTableRowProps) {
  const isEvenRow = index % 2 === 0;

  return (
    <TableRow
      draggable={isAdminMode}
      onDragStart={(e) => onDragStart(e, firefighter.id)}
      onDragOver={(e) => onDragOver(e, firefighter.id)}
      onDrop={(e) => onDrop(e, firefighter.id)}
      onDragEnd={onDragEnd}
      style={{ height: 'var(--row-height, 32px)' }}
      className={`
        ${isEvenRow ? "bg-muted/30" : ""}
        ${isDragging ? "opacity-50" : ""}
        ${isDragOver ? "bg-primary/10 border-l-4 border-primary" : ""}
        ${isNextInRotation ? "bg-primary/20 ring-2 ring-inset ring-primary/60" : ""}
        ${isAdminMode ? "cursor-move" : "cursor-default"}
      `}
    >
      {/* Selection Checkbox */}
      {isAdminMode && (
        <TableCell className="text-center p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onToggleSelection(firefighter.id)}
            aria-label={`Select ${firefighter.name}`}
          >
            {isSelected ? (
              <CheckSquare className="h-3 w-3 text-primary" />
            ) : (
              <Square className="h-3 w-3 text-muted-foreground" />
            )}
          </Button>
        </TableCell>
      )}

      {/* Order Position */}
      <TableCell className="font-medium p-1">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs">
          {firefighter.order_position + 1}
        </span>
      </TableCell>

      {/* Name (clickable) */}
      <TableCell className="p-1">
        <Button
          variant="link"
          className="p-0 h-auto font-semibold text-foreground hover:text-primary text-xs"
          onClick={() => onViewProfile(firefighter)}
        >
          {firefighter.name}
        </Button>
      </TableCell>

      {/* Last Hold Date */}
      <TableCell className="text-muted-foreground p-1 text-xs">
        {firefighter.last_hold_date ? (
          formatHoldDate(firefighter.last_hold_date)
        ) : (
          <span className="italic">Never</span>
        )}
      </TableCell>

      {/* Volunteer Button */}
      <TableCell className="text-center p-1">
        {onVolunteerHold && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVolunteerHold(firefighter.id)}
            disabled={!firefighter.is_available}
            className="gap-1 h-6 px-2 text-xs"
          >
            <HandHeart className="h-3 w-3" />
            <span className="hidden xl:inline">Volunteer</span>
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
