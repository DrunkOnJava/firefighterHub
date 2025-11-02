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

import { Search, X } from 'lucide-react';
import { forwardRef } from 'react';
import { colors, tokens } from '../../styles';

interface RosterSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
  totalCount: number;
  isDarkMode?: boolean;
}

export const RosterSearchBar = forwardRef<HTMLInputElement, RosterSearchBarProps>(
  function RosterSearchBar(
    { searchQuery, onSearchChange, resultCount, totalCount, isDarkMode = true },
    ref
  ) {
    return (
      <div className={tokens.spacing.margin.lg}>
        <div className="relative">
          <Search 
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? colors.structural.text.tertiary : 'text-gray-400'}`}
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
              onClick={() => onSearchChange('')}
              className={`
                absolute right-3 top-1/2 -translate-y-1/2
                ${tokens.spacing.section.sm}
                ${tokens.borders.radius.md}
                ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
                ${tokens.transitions.fast}
              `}
              aria-label="Clear search"
            >
              <X size={16} className={isDarkMode ? colors.structural.text.tertiary : 'text-gray-500'} />
            </button>
          )}
        </div>
        
        {searchQuery && (
          <p className={`mt-2 ${tokens.typography.body.small} ${isDarkMode ? colors.structural.text.secondary : 'text-gray-600'}`}>
            Showing {resultCount} of {totalCount} firefighters
          </p>
        )}
      </div>
    );
  }
);

