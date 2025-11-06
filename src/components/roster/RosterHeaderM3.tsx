/**
 * RosterHeaderM3 Component
 *
 * Material M version of the RosterHeader component with:
 * - Title and description
 * - Add firefighter button (admin only)
 * - View deactivated button
 * - Export menu
 * - Filter toggle
 *
 * Uses MaterialM color system and M3 components.
 */

import { Eye, Filter, UserPlus, Users } from "lucide-react";
import { Firefighter } from "../../lib/supabase";
import { tokens } from "../../styles";
import { ExportMenu } from "./ExportMenu";
import { ButtonM3 } from "../m3";

interface RosterHeaderM3Props {
  firefighters: Firefighter[];
  currentShift: string;
  isAdminMode?: boolean;
  isDarkMode?: boolean;
  onAddClick: () => void;
  onViewDeactivatedClick: () => void;
  onFilterToggle: () => void;
  showExportMenu: boolean;
  onExportToggle: () => void;
  activeFilterCount: number;
  deactivatedCount: number;
}

export function RosterHeaderM3({
  firefighters,
  currentShift,
  isAdminMode = false,
  isDarkMode = true,
  onAddClick,
  onViewDeactivatedClick,
  onFilterToggle,
  showExportMenu,
  onExportToggle,
  activeFilterCount,
  deactivatedCount,
}: RosterHeaderM3Props) {
  return (
    <div
      className={`
        border-b-2 border-materialm-border-dark
        ${tokens.spacing.card.lg}
        bg-materialm-surface
      `}
    >
      <div className="flex items-center justify-between">
        {/* Title section */}
        <div className="flex items-center gap-4">
          <div
            className={`
              ${tokens.spacing.section.md}
              ${tokens.borders.radius.xl}
              ${tokens.shadows.lg}
              bg-gradient-to-br from-materialm-accent-blue to-materialm-accent-teal
            `}
          >
            <Users className="text-white" size={28} />
          </div>
          <div>
            <h2
              id="roster-heading"
              className={`
                ${tokens.typography.heading.h2}
                text-materialm-text-primary
              `}
            >
              Firefighter Roster
            </h2>
            <p
              className={`
                ${tokens.typography.body.primary}
                text-materialm-text-secondary
              `}
            >
              Add and organize your team rotation
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Add Button (Admin Mode) */}
          {isAdminMode && (
            <ButtonM3
              variant="filled"
              onClick={onAddClick}
              aria-label="Add team member"
              title="Add team member"
              className="!p-2.5"
            >
              <UserPlus className="w-5 h-5" />
            </ButtonM3>
          )}

          {/* View Deactivated Button */}
          {isAdminMode && deactivatedCount > 0 && (
            <ButtonM3
              variant="outlined"
              onClick={onViewDeactivatedClick}
              title={`View ${deactivatedCount} deactivated firefighters`}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Deactivated ({deactivatedCount})
            </ButtonM3>
          )}

          {/* Filter Button */}
          <ButtonM3
            variant="outlined"
            onClick={onFilterToggle}
            aria-label="Toggle filters"
            className="relative flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span
                className={`
                absolute -top-1 -right-1
                w-5 h-5
                ${tokens.borders.radius.full}
                bg-materialm-accent-red
                text-white
                ${tokens.typography.body.small}
                font-bold
                flex items-center justify-center
              `}
              >
                {activeFilterCount}
              </span>
            )}
          </ButtonM3>

          {/* Export Menu */}
          <ExportMenu
            isOpen={showExportMenu}
            onToggle={onExportToggle}
            firefighters={firefighters}
            currentShift={currentShift}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
}
