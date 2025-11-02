/**
 * ExportMenu Component
 * 
 * Dropdown menu for exporting roster data in various formats.
 * Features:
 * - Export as CSV
 * - Export as JSON
 * - Click outside to close
 * 
 * Uses design tokens for consistent styling.
 */

import { Download, FileDown } from 'lucide-react';
import { Firefighter } from '../../lib/supabase';
import { exportRosterToCSV, exportRosterToJSON } from '../../utils/exportUtils';
import { colors, tokens } from '../../styles';

interface ExportMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  firefighters: Firefighter[];
  currentShift: string;
  isDarkMode?: boolean;
}

export function ExportMenu({
  isOpen,
  onToggle,
  firefighters,
  currentShift,
  isDarkMode = true,
}: ExportMenuProps) {
  const handleExportCSV = () => {
    exportRosterToCSV(firefighters, currentShift || "ALL");
    onToggle(); // Close menu after export
  };

  const handleExportJSON = () => {
    exportRosterToJSON(firefighters, currentShift || "ALL");
    onToggle(); // Close menu after export
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`
          flex items-center gap-2
          px-4 py-2
          ${tokens.borders.radius.lg}
          ${colors.components.button.secondary}
          ${tokens.typography.body.secondary}
          font-medium
        `}
        aria-label="Export roster data"
        aria-expanded={isOpen}
      >
        <Download className="w-4 h-4" />
        Export
      </button>

      {isOpen && (
        <div
          className={`
            absolute right-0 top-full mt-2
            w-48
            ${tokens.borders.radius.lg}
            ${tokens.shadows.xl}
            border-2
            overflow-hidden
            ${tokens.zIndex.dropdown}
            ${isDarkMode 
              ? `${colors.structural.bg.card} ${colors.structural.border.default}` 
              : 'bg-white border-slate-300'
            }
          `}
        >
          <button
            onClick={handleExportCSV}
            className={`
              w-full
              px-4 py-3
              text-left
              flex items-center gap-3
              ${tokens.transitions.fast}
              ${isDarkMode 
                ? 'hover:bg-gray-700 text-white' 
                : 'hover:bg-slate-50 text-slate-900'
              }
            `}
          >
            <FileDown className="w-4 h-4" />
            <span className="font-medium">Export as CSV</span>
          </button>
          
          <button
            onClick={handleExportJSON}
            className={`
              w-full
              px-4 py-3
              text-left
              flex items-center gap-3
              ${tokens.transitions.fast}
              border-t
              ${isDarkMode 
                ? 'hover:bg-gray-700 text-white border-gray-700' 
                : 'hover:bg-slate-50 text-slate-900 border-slate-200'
              }
            `}
          >
            <FileDown className="w-4 h-4" />
            <span className="font-medium">Export as JSON</span>
          </button>
        </div>
      )}
    </div>
  );
}

