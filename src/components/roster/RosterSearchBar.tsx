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
 * Uses design tokens for consistent styling.
 */

import { Search, X } from "lucide-react";
import { forwardRef } from "react";
import { colors, tokens } from "../../styles";
import { getTheme } from "../../utils/theme";

interface RosterSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
  totalCount: number;
  isDarkMode?: boolean;
}

export const RosterSearchBar = forwardRef<
  HTMLInputElement,
  RosterSearchBarProps
>(function RosterSearchBar(
  { searchQuery, onSearchChange, resultCount, totalCount, isDarkMode = true },
  ref
) {
  const theme = getTheme(isDarkMode);

  return (
    <div className={tokens.spacing.margin.lg}>
      <div className="relative">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.roster.searchIcon}`}
          size={20}
        />
        <input
          ref={ref}
          type="text"
          placeholder="Search by name or station..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`
              w-full
              pl-10 pr-10
              py-3
              ${tokens.borders.radius.lg}
              ${colors.components.input.default}
              ${tokens.typography.body.primary}
            `}
          aria-label="Search firefighters"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className={`
                absolute right-3 top-1/2 -translate-y-1/2
                ${tokens.spacing.section.sm}
                ${tokens.borders.radius.md}
                ${theme.roster.searchClearHover}
                ${tokens.transitions.fast}
              `}
            aria-label="Clear search"
          >
            <X size={16} className={theme.roster.searchIcon} />
          </button>
        )}
      </div>

      {searchQuery && (
        <p
          className={`mt-2 ${tokens.typography.body.small} ${theme.roster.searchHelperText}`}
        >
          Showing {resultCount} of {totalCount} firefighters
        </p>
      )}
    </div>
  );
});
