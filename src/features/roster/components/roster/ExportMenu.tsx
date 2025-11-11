/**
 * ExportMenu Component
 *
 * Dropdown menu for exporting roster data in various formats.
 * Features:
 * - Export as CSV
 * - Export as JSON
 * - Click outside to close
 *
 * Migrated to shadcn/ui using Button and DropdownMenu.
 */

import { Download, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Firefighter } from "../../lib/supabase";
import { exportRosterToCSV, exportRosterToJSON } from "../../utils/exportUtils";

interface ExportMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  firefighters: Firefighter[];
  currentShift: string;
}

export function ExportMenu({
  isOpen,
  onToggle,
  firefighters,
  currentShift,
}: ExportMenuProps) {
  const handleExportCSV = () => {
    exportRosterToCSV(firefighters, currentShift || "ALL");
    onToggle();
  };

  const handleExportJSON = () => {
    exportRosterToJSON(firefighters, currentShift || "ALL");
    onToggle();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={onToggle}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileDown className="w-4 h-4 mr-2" />
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON}>
          <FileDown className="w-4 h-4 mr-2" />
          <span>Export as JSON</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
