/**
 * BulkActionsM3 Component - MaterialM Design System
 *
 * Bulk selection and action controls for firefighter roster.
 * Features:
 * - Select all / Deselect all
 * - Selection count display
 * - Bulk delete button
 * - Bulk deactivate button
 * - Only visible when items are selected
 *
 * Uses MaterialM color system and ButtonM3 components.
 */

import { CheckSquare, Square, Trash2, UserX } from "lucide-react";
import { ButtonM3 } from "../m3/ButtonM3";

interface BulkActionsM3Props {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkDelete: () => void;
  onBulkDeactivate: () => void;
  isAdminMode?: boolean;
  isDarkMode?: boolean;
}

export function BulkActionsM3({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  onBulkDeactivate,
  isAdminMode = false,
}: BulkActionsM3Props) {
  if (!isAdminMode || selectedCount === 0) {
    return null;
  }

  const allSelected = selectedCount === totalCount;

  return (
    <div
      className={`
        p-4
        rounded-materialm-lg
        bg-materialm-darkgray
        mb-6
        shadow-materialm-2
      `}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Selection controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className={`
              flex items-center gap-2
              px-3 py-2
              rounded-materialm-md
              hover:bg-white/10
              transition-colors duration-200
            `}
            aria-label={allSelected ? "Deselect all" : "Select all"}
          >
            {allSelected ? (
              <CheckSquare className="text-materialm-info" size={18} />
            ) : (
              <Square className="text-materialm-text-secondary" size={18} />
            )}
            <span className="text-sm font-medium text-materialm-text">
              {allSelected ? "Deselect All" : "Select All"}
            </span>
          </button>

          <span className="text-sm font-semibold text-materialm-primary">
            {selectedCount} selected
          </span>
        </div>

        {/* Bulk actions */}
        <div className="flex items-center gap-2">
          <ButtonM3
            variant="outlined"
            color="warning"
            size="sm"
            onClick={onBulkDeactivate}
            startIcon={<UserX size={16} />}
            title={`Deactivate ${selectedCount} selected firefighters`}
          >
            Deactivate
          </ButtonM3>

          <ButtonM3
            variant="filled"
            color="error"
            size="sm"
            onClick={onBulkDelete}
            startIcon={<Trash2 size={16} />}
            title={`Delete ${selectedCount} selected firefighters`}
          >
            Delete
          </ButtonM3>
        </div>
      </div>
    </div>
  );
}
