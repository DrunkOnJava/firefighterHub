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
 * Uses design tokens for consistent styling.
 */

import { CheckSquare, Square, Trash2, UserX } from "lucide-react";
import { colors, tokens } from "../../styles";
import { getTheme } from "../../utils/theme";

interface BulkActionsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkDelete: () => void;
  onBulkDeactivate: () => void;
  isAdminMode?: boolean;
  isDarkMode?: boolean;
}

export function BulkActions({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  onBulkDeactivate,
  isAdminMode = false,
  isDarkMode = true,
}: BulkActionsProps) {
  if (!isAdminMode || selectedCount === 0) {
    return null;
  }

  const allSelected = selectedCount === totalCount;
  const theme = getTheme(isDarkMode);

  return (
    <div
      className={`
        ${tokens.spacing.card.md}
        ${tokens.borders.radius.lg}
        ${theme.roster.bulkActionsBg}
        ${tokens.spacing.margin.lg}
      `}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Selection controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className={`
              flex items-center gap-2
              ${tokens.spacing.section.sm}
              ${tokens.borders.radius.md}
              ${theme.roster.bulkActionsHover}
              ${tokens.transitions.fast}
            `}
            aria-label={allSelected ? "Deselect all" : "Select all"}
          >
            {allSelected ? (
              <CheckSquare className={colors.semantic.info.text} size={18} />
            ) : (
              <Square className={theme.roster.bulkSelectIcon} size={18} />
            )}
            <span
              className={`${tokens.typography.body.secondary} font-medium ${theme.textPrimary}`}
            >
              {allSelected ? "Deselect All" : "Select All"}
            </span>
          </button>

          <span
            className={`${tokens.typography.body.secondary} font-semibold ${theme.roster.bulkSelectedCount}`}
          >
            {selectedCount} selected
          </span>
        </div>

        {/* Bulk actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBulkDeactivate}
            className={`
              flex items-center gap-2
              ${tokens.spacing.section.sm}
              px-4
              ${tokens.borders.radius.lg}
              ${colors.components.button.secondary}
              font-semibold
            `}
            title={`Deactivate ${selectedCount} selected firefighters`}
          >
            <UserX size={16} />
            <span className={tokens.typography.body.small}>Deactivate</span>
          </button>

          <button
            onClick={onBulkDelete}
            className={`
              flex items-center gap-2
              ${tokens.spacing.section.sm}
              px-4
              ${tokens.borders.radius.lg}
              ${colors.components.button.danger}
              font-semibold
            `}
            title={`Delete ${selectedCount} selected firefighters`}
          >
            <Trash2 size={16} />
            <span className={tokens.typography.body.small}>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
