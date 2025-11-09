import { ArrowUpDown, CheckSquare, Square } from "lucide-react";
import { Firefighter } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RosterTableRow } from "./RosterTableRow";

interface RosterTableProps {
  firefighters: Firefighter[];
  isAdminMode: boolean;
  selectedIds: Set<string>;
  nextInRotation: Firefighter | null;
  draggedId: string | null;
  dragOverId: string | null;
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
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

export function RosterTable({
  firefighters,
  isAdminMode,
  selectedIds,
  nextInRotation,
  draggedId,
  dragOverId,
  onToggleSelection,
  onSelectAll,
  onDeselectAll,
  onViewProfile,
  onVolunteerHold,
  onCompleteHold,
  onTransferShift,
  onDeactivate,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: RosterTableProps) {
  const allSelected = selectedIds.size === firefighters.length && firefighters.length > 0;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Selection Column */}
            {isAdminMode && (
              <TableHead className="w-12 text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={allSelected ? onDeselectAll : onSelectAll}
                  aria-label={allSelected ? "Deselect all" : "Select all"}
                >
                  {allSelected ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </Button>
              </TableHead>
            )}

            {/* Order Column */}
            <TableHead className="w-20">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3 w-3" />
                Order
              </div>
            </TableHead>

            {/* Name Column */}
            <TableHead>Name</TableHead>

            {/* Shift Column (Admin only) */}
            {isAdminMode && <TableHead>Shift</TableHead>}

            {/* Station Column (Admin only) */}
            {isAdminMode && <TableHead>Station</TableHead>}

            {/* Cert Level Column (Admin only) */}
            {isAdminMode && <TableHead>Cert Level</TableHead>}

            {/* Qualifications Column (Admin only) */}
            {isAdminMode && <TableHead>Qualifications</TableHead>}

            {/* Last Hold Column */}
            <TableHead>Last Hold</TableHead>

            {/* Volunteer Column */}
            <TableHead className="text-center">Volunteer</TableHead>

            {/* Actions Column (Admin only) */}
            {isAdminMode && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {firefighters.map((firefighter, index) => (
            <RosterTableRow
              key={firefighter.id}
              firefighter={firefighter}
              index={index}
              isAdminMode={isAdminMode}
              isSelected={selectedIds.has(firefighter.id)}
              isDragging={draggedId === firefighter.id}
              isDragOver={dragOverId === firefighter.id}
              isNextInRotation={nextInRotation?.id === firefighter.id}
              onToggleSelection={onToggleSelection}
              onViewProfile={onViewProfile}
              onVolunteerHold={onVolunteerHold}
              onCompleteHold={onCompleteHold}
              onTransferShift={onTransferShift}
              onDeactivate={onDeactivate}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
