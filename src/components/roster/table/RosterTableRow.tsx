import { CheckSquare, Square } from "lucide-react";
import { Firefighter } from "@/lib/supabase";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatHoldDate } from "@/utils/dateUtils";
import { IconButton } from "@/components/ui/IconButton";
import { Eye, Repeat, Trash2, UserX, HandHeart, History } from "lucide-react";

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
  onCompleteHold,
  onTransferShift,
  onDeactivate,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: RosterTableRowProps) {
  const qualifications = [
    firefighter.is_fto && "FTO",
    firefighter.is_bls && "BLS",
    firefighter.is_als && "ALS",
  ].filter((q): q is string => Boolean(q));

  const isEvenRow = index % 2 === 0;

  return (
    <TableRow
      draggable={isAdminMode}
      onDragStart={(e) => onDragStart(e, firefighter.id)}
      onDragOver={(e) => onDragOver(e, firefighter.id)}
      onDrop={(e) => onDrop(e, firefighter.id)}
      onDragEnd={onDragEnd}
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
        <TableCell className="text-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onToggleSelection(firefighter.id)}
            aria-label={`Select ${firefighter.name}`}
          >
            {isSelected ? (
              <CheckSquare className="h-4 w-4 text-primary" />
            ) : (
              <Square className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </TableCell>
      )}

      {/* Order Position */}
      <TableCell className="font-medium">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
          {firefighter.order_position + 1}
        </span>
      </TableCell>

      {/* Name (clickable) */}
      <TableCell>
        <Button
          variant="link"
          className="p-0 h-auto font-semibold text-foreground hover:text-primary"
          onClick={() => onViewProfile(firefighter)}
        >
          {firefighter.name}
        </Button>
      </TableCell>

      {/* Shift (Admin only) */}
      {isAdminMode && (
        <TableCell>
          <span className={`
            px-2 py-1 rounded-full text-xs font-bold
            ${firefighter.shift === 'A' ? 'bg-red-500/20 text-red-700 dark:text-red-400' : ''}
            ${firefighter.shift === 'B' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400' : ''}
            ${firefighter.shift === 'C' ? 'bg-green-500/20 text-green-700 dark:text-green-400' : ''}
          `}>
            {firefighter.shift}
          </span>
        </TableCell>
      )}

      {/* Station (Admin only) */}
      {isAdminMode && (
        <TableCell className="text-muted-foreground">
          {firefighter.fire_station || "—"}
        </TableCell>
      )}

      {/* Cert Level (Admin only) */}
      {isAdminMode && (
        <TableCell>
          {firefighter.certification_level ? (
            <span className={`
              px-2 py-1 rounded text-xs font-semibold
              ${firefighter.certification_level === "FF1" ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" : ""}
              ${firefighter.certification_level === "FF2" ? "bg-amber-500/20 text-amber-700 dark:text-amber-400" : ""}
            `}>
              {firefighter.certification_level}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </TableCell>
      )}

      {/* Qualifications (Admin only) */}
      {isAdminMode && (
        <TableCell>
          {qualifications.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {qualifications.map((qual) => (
                <span
                  key={qual}
                  className="px-1.5 py-0.5 bg-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-semibold rounded"
                >
                  {qual}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </TableCell>
      )}

      {/* Last Hold Date */}
      <TableCell className="text-muted-foreground">
        {firefighter.last_hold_date ? (
          formatHoldDate(firefighter.last_hold_date)
        ) : (
          <span className="italic">Never</span>
        )}
      </TableCell>

      {/* Volunteer Button */}
      <TableCell className="text-center">
        {onVolunteerHold && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVolunteerHold(firefighter.id)}
            disabled={!firefighter.is_available}
            className="gap-1"
          >
            <HandHeart className="h-3 w-3" />
            <span className="hidden xl:inline">Volunteer</span>
          </Button>
        )}
      </TableCell>

      {/* Actions (Admin only) */}
      {isAdminMode && (
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-1">
            <IconButton
              icon={Eye}
              label={`View ${firefighter.name}'s profile`}
              onClick={() => onViewProfile(firefighter)}
              variant="default"
              size="xs"
            />
            <IconButton
              icon={History}
              label={`Complete hold for ${firefighter.name}`}
              onClick={() => onCompleteHold(firefighter.id)}
              variant="success"
              size="xs"
            />
            <IconButton
              icon={Repeat}
              label={`Transfer ${firefighter.name} to another shift`}
              onClick={() => onTransferShift(firefighter.id)}
              variant="default"
              size="xs"
            />
            <IconButton
              icon={UserX}
              label={`Deactivate ${firefighter.name}`}
              onClick={() => onDeactivate(firefighter.id)}
              variant="destructive"
              size="xs"
            />
            <IconButton
              icon={Trash2}
              label={`Delete ${firefighter.name}`}
              onClick={() => onCompleteHold(firefighter.id)}
              variant="danger"
              size="xs"
            />
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}
