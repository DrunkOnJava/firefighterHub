/**
 * BulkActions Component
 *
 * Bulk selection and action controls for firefighter roster.
 * Features:
 * - Select all / Deselect all
 * - Selection count display
 * - Bulk delete button
 * - Bulk deactivate button
 * - Only visible when items are selected
 *
 * Migrated to shadcn/ui.
 */

import { CheckSquare, Square, Trash2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BulkActionsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkDelete: () => void;
  onBulkDeactivate: () => void;
  isAdminMode?: boolean;
}

export function BulkActions({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  onBulkDeactivate,
  isAdminMode = false,
}: BulkActionsProps) {
  if (!isAdminMode || selectedCount === 0) {
    return null;
  }

  const allSelected = selectedCount === totalCount;

  return (
    <Card className="my-4">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Selection controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={allSelected ? onDeselectAll : onSelectAll}
              aria-label={allSelected ? "Deselect all" : "Select all"}
            >
              {allSelected ? (
                <CheckSquare className="text-blue-500 mr-2" size={18} />
              ) : (
                <Square className="text-muted-foreground mr-2" size={18} />
              )}
              <span className="font-medium">
                {allSelected ? "Deselect All" : "Select All"}
              </span>
            </Button>

            <span className="text-sm font-semibold text-foreground">
              {selectedCount} selected
            </span>
          </div>

          {/* Bulk actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onBulkDeactivate}
              title={`Deactivate ${selectedCount} selected firefighters`}
            >
              <UserX size={16} className="mr-2" />
              <span className="text-xs">Deactivate</span>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={onBulkDelete}
              title={`Delete ${selectedCount} selected firefighters`}
            >
              <Trash2 size={16} className="mr-2" />
              <span className="text-xs">Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
