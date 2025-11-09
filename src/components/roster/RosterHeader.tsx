/**
 * RosterHeader Component
 *
 * Header section for the firefighter roster with:
 * - Title and description
 * - Add firefighter button (admin only)
 * - View deactivated button
 * - Export menu
 * - Filter toggle
 *
 * Uses shadcn/ui semantic classes for consistent styling.
 */

import { Eye, Filter, UserPlus, Users } from "lucide-react";
import { Firefighter } from "../../lib/supabase";
import { ExportMenu } from "./ExportMenu";

interface RosterHeaderProps {
  firefighters: Firefighter[];
  currentShift: string;
  isAdminMode?: boolean;
  /** @deprecated Kept for backward compatibility, no longer used */
  isDarkMode?: boolean;
  onAddClick: () => void;
  onViewDeactivatedClick: () => void;
  onFilterToggle: () => void;
  showExportMenu: boolean;
  onExportToggle: () => void;
  activeFilterCount: number;
  deactivatedCount: number;
}

export function RosterHeader({
  firefighters,
  currentShift,
  isAdminMode = false,
  isDarkMode: _isDarkMode = true, // eslint-disable-line @typescript-eslint/no-unused-vars -- Kept for backward compatibility
  onAddClick,
  onViewDeactivatedClick,
  onFilterToggle,
  showExportMenu,
  onExportToggle,
  activeFilterCount,
  deactivatedCount,
}: RosterHeaderProps) {
  return (
    <div
      className="
        border-b-2 border-border
        p-6
        bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900
      "
    >
      <div className="flex items-center justify-between">
        {/* Title section */}
        <div className="flex items-center gap-4">
          <div
            className="
              p-3
              rounded-xl
              shadow-lg
              bg-gradient-to-br from-blue-600 to-blue-700
            "
          >
            <Users className="text-white" size={28} />
          </div>
          <div>
            <h2
              id="roster-heading"
              className="
                text-2xl font-bold
                text-foreground
              "
            >
              Firefighter Roster
            </h2>
            <p
              className="
                text-sm
                text-muted-foreground
              "
            >
              Add and organize your team rotation
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Add Button (Admin Mode) */}
          {isAdminMode && (
            <button
              onClick={onAddClick}
              className="
                p-2
                rounded-lg
                transition-colors duration-200
                bg-primary hover:bg-primary/90 text-primary-foreground
              "
              aria-label="Add team member"
              title="Add team member"
            >
              <UserPlus className="w-5 h-5" />
            </button>
          )}

          {/* View Deactivated Button */}
          {isAdminMode && deactivatedCount > 0 && (
            <button
              onClick={onViewDeactivatedClick}
              className="
                flex items-center gap-2
                px-4 py-2
                rounded-lg
                bg-secondary hover:bg-secondary/80 text-secondary-foreground
                text-sm
                font-medium
              "
              title={`View ${deactivatedCount} deactivated firefighters`}
            >
              <Eye className="w-4 h-4" />
              View Deactivated ({deactivatedCount})
            </button>
          )}

          {/* Filter Button */}
          <button
            onClick={onFilterToggle}
            className="
              relative
              flex items-center gap-2
              px-4 py-2
              rounded-lg
              bg-secondary hover:bg-secondary/80 text-secondary-foreground
              text-sm
              font-medium
            "
            aria-label="Toggle filters"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span
                className="
                absolute -top-1 -right-1
                w-5 h-5
                rounded-full
                bg-primary text-primary-foreground
                text-xs
                font-bold
                flex items-center justify-center
              "
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Export Menu */}
          <ExportMenu
            isOpen={showExportMenu}
            onToggle={onExportToggle}
            firefighters={firefighters}
            currentShift={currentShift}
          />
        </div>
      </div>
    </div>
  );
}
