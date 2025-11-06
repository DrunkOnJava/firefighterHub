/**
 * ExportMenuM3 Component (MaterialM Version)
 *
 * Material Design 3 dropdown menu for exporting roster data in various formats.
 * Features:
 * - Export as CSV
 * - Export as JSON
 * - Click outside to close
 * - MaterialM color system
 * - ButtonM3 component integration
 *
 * Replaces legacy ExportMenu with M3 design patterns.
 */

import { Download, FileDown } from "lucide-react";
import { Firefighter } from "../../lib/supabase";
import { tokens } from "../../styles";
import { exportRosterToCSV, exportRosterToJSON } from "../../utils/exportUtils";
import { ButtonM3 } from "../m3";

interface ExportMenuM3Props {
  isOpen: boolean;
  onToggle: () => void;
  firefighters: Firefighter[];
  currentShift: string;
  isDarkMode?: boolean;
}

export function ExportMenuM3({
  isOpen,
  onToggle,
  firefighters,
  currentShift,
}: ExportMenuM3Props) {
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
      {/* Export Button - Using ButtonM3 */}
      <ButtonM3
        variant="outlined"
        onClick={onToggle}
        aria-label="Export roster data"
        aria-expanded={isOpen}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export
      </ButtonM3>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute right-0 top-full mt-2
            w-48
            ${tokens.borders.radius.lg}
            ${tokens.shadows.xl}
            border-2 border-materialm-border-dark
            overflow-hidden
            ${tokens.zIndex.dropdown}
            bg-materialm-dark
          `}
        >
          {/* Export as CSV */}
          <button
            onClick={handleExportCSV}
            className={`
              w-full
              px-4 py-3
              text-left
              flex items-center gap-3
              ${tokens.transitions.fast}
              text-materialm-text-primary
              hover:bg-materialm-primary-light
              focus:bg-materialm-primary-light
              focus:outline-none
            `}
          >
            <FileDown className="w-4 h-4 text-materialm-text-secondary" />
            <span className="font-medium">Export as CSV</span>
          </button>

          {/* Export as JSON */}
          <button
            onClick={handleExportJSON}
            className={`
              w-full
              px-4 py-3
              text-left
              flex items-center gap-3
              ${tokens.transitions.fast}
              border-t border-materialm-border-dark
              text-materialm-text-primary
              hover:bg-materialm-primary-light
              focus:bg-materialm-primary-light
              focus:outline-none
            `}
          >
            <FileDown className="w-4 h-4 text-materialm-text-secondary" />
            <span className="font-medium">Export as JSON</span>
          </button>
        </div>
      )}
    </div>
  );
}
