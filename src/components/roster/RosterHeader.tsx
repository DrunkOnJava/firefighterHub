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
 * Uses design tokens for consistent styling.
 */

import { Users, UserPlus, Eye, Filter } from 'lucide-react';
import { colors, tokens } from '../../styles';
import { ExportMenu } from './ExportMenu';
import { Firefighter } from '../../lib/supabase';

interface RosterHeaderProps {
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

export function RosterHeader({
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
}: RosterHeaderProps) {
  return (
    <div
      className={`
        border-b-2
        ${tokens.spacing.card.lg}
        ${isDarkMode 
          ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700' 
          : 'bg-gradient-to-r from-red-50 to-amber-50 border-slate-300'
        }
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
              ${isDarkMode 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                : 'bg-gradient-to-br from-blue-600 to-blue-700'
              }
            `}
          >
            <Users className="text-white" size={28} />
          </div>
          <div>
            <h2
              id="roster-heading"
              className={`
                ${tokens.typography.heading.h2}
                ${isDarkMode ? colors.structural.text.primary : 'text-slate-900'}
              `}
            >
              Firefighter Roster
            </h2>
            <p
              className={`
                ${tokens.typography.body.primary}
                ${isDarkMode ? colors.structural.text.secondary : 'text-slate-600'}
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
            <button
              onClick={onAddClick}
              className={`
                ${tokens.spacing.section.sm}
                ${tokens.borders.radius.lg}
                ${tokens.transitions.fast}
                ${isDarkMode 
                  ? 'bg-green-700 hover:bg-green-600 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
                }
              `}
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
              className={`
                flex items-center gap-2
                px-4 py-2
                ${tokens.borders.radius.lg}
                ${colors.components.button.secondary}
                ${tokens.typography.body.secondary}
                font-medium
              `}
              title={`View ${deactivatedCount} deactivated firefighters`}
            >
              <Eye className="w-4 h-4" />
              View Deactivated ({deactivatedCount})
            </button>
          )}

          {/* Filter Button */}
          <button
            onClick={onFilterToggle}
            className={`
              relative
              flex items-center gap-2
              px-4 py-2
              ${tokens.borders.radius.lg}
              ${colors.components.button.secondary}
              ${tokens.typography.body.secondary}
              font-medium
            `}
            aria-label="Toggle filters"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className={`
                absolute -top-1 -right-1
                w-5 h-5
                ${tokens.borders.radius.full}
                ${colors.semantic.primary.solid}
                text-white
                ${tokens.typography.body.small}
                font-bold
                flex items-center justify-center
              `}>
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
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
}

