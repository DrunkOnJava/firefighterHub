/**
 * RosterSearchBar Component
 *
 * Search bar for filtering firefighters by name or station number.
 * Features:
 * - Real-time search as user types
 * - Clear button to reset search
 * - Shows result count
 * - Ref forwarding for keyboard shortcuts
 *
 * Uses shadcn/ui semantic classes for consistent styling.
 */

import { Search, X } from "lucide-react";
import { forwardRef } from "react";

interface RosterSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
  totalCount: number;
}

export const RosterSearchBar = forwardRef<
  HTMLInputElement,
  RosterSearchBarProps
>(function RosterSearchBar(
  { searchQuery, onSearchChange, resultCount, totalCount },
  ref
) {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          ref={ref}
          type="text"
          placeholder="Search by name or station..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-3 rounded-lg bg-input border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background text-sm"
          aria-label="Search firefighters"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-accent transition-colors duration-200"
            aria-label="Clear search"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        )}
      </div>

      {searchQuery && (
        <p className="mt-2 text-xs text-muted-foreground">
          Showing {resultCount} of {totalCount} firefighters
        </p>
      )}
    </div>
  );
});
