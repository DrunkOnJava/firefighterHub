/**
 * RosterSearchBarM3 Component - MaterialM Version
 *
 * Search bar for filtering firefighters by name or station number.
 * Features:
 * - Real-time search as user types
 * - Clear button to reset search
 * - Shows result count
 * - Ref forwarding for keyboard shortcuts
 *
 * Uses MaterialM design system with InputM3 component.
 */

import { Search, X } from "lucide-react";
import { forwardRef } from "react";
import { InputM3 } from "../m3";

interface RosterSearchBarM3Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
  totalCount: number;
  isDarkMode?: boolean;
}

export const RosterSearchBarM3 = forwardRef<
  HTMLInputElement,
  RosterSearchBarM3Props
>(function RosterSearchBarM3(
  { searchQuery, onSearchChange, resultCount, totalCount },
  ref
) {
  return (
    <div className="mb-6">
      <div className="relative">
        <InputM3
          ref={ref}
          type="text"
          placeholder="Search by name or station..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          startIcon={<Search className="text-materialm-text-secondary" size={20} />}
          endIcon={
            searchQuery ? (
              <button
                onClick={() => onSearchChange("")}
                className="p-1 rounded-md hover:bg-materialm-surface-variant transition-colors duration-200"
                aria-label="Clear search"
              >
                <X size={16} className="text-materialm-text-secondary" />
              </button>
            ) : undefined
          }
          className="w-full"
          aria-label="Search firefighters"
        />
      </div>

      {searchQuery && (
        <p className="mt-2 text-sm text-materialm-text-secondary">
          Showing {resultCount} of {totalCount} firefighters
        </p>
      )}
    </div>
  );
});
