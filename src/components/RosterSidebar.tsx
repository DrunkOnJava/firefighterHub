import { Firefighter } from "@/lib/supabase";
import { RosterItem } from "./RosterItem";
import { Button } from "@/components/ui/button";
import { Filter, ArrowUpDown, Users, X } from "lucide-react";
import { useState } from "react";

interface RosterSidebarProps {
  firefighters: Firefighter[];
  selectedFirefighterId?: string | null;
  onFirefighterClick?: (firefighterId: string) => void;
  shiftLabel?: string;
  onClose?: () => void; // For mobile drawer close button
}

type SortOption = 'position' | 'name' | 'lastHold';

/**
 * RosterSidebar - Calendr-style personnel roster
 *
 * Features:
 * - Fixed width sidebar (320px)
 * - Sticky header with filter/sort controls
 * - Independent scroll for roster list
 * - Numbered entries for quick reference
 *
 * Design: Based on Calendr left sidebar layout
 */
export function RosterSidebar({
  firefighters,
  selectedFirefighterId,
  onFirefighterClick,
  shiftLabel,
  onClose,
}: RosterSidebarProps) {
  const [sortBy, setSortBy] = useState<SortOption>('position');
  const [filterAvailable, setFilterAvailable] = useState(false);

  // Apply filters and sorting
  const processedFirefighters = [...firefighters]
    .filter(ff => !filterAvailable || ff.is_available)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'lastHold':
          if (!a.last_hold_date && !b.last_hold_date) return 0;
          if (!a.last_hold_date) return 1;
          if (!b.last_hold_date) return -1;
          return new Date(a.last_hold_date).getTime() - new Date(b.last_hold_date).getTime();
        case 'position':
        default:
          return a.order_position - b.order_position;
      }
    });

  const toggleSort = () => {
    const options: SortOption[] = ['position', 'name', 'lastHold'];
    const currentIndex = options.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % options.length;
    setSortBy(options[nextIndex]);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'name': return 'Sort: Name';
      case 'lastHold': return 'Sort: Last Hold';
      case 'position':
      default: return 'Sort: Position';
    }
  };

  return (
    <aside className="w-80 border-r border-border bg-background flex flex-col overflow-hidden">
      {/* Sticky Header */}
      <div className="flex-shrink-0 bg-background border-b border-border">
        {/* Title */}
        <div className="p-4 pb-3 border-b border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground">Personnel Roster</h2>
              {shiftLabel && (
                <p className="text-xs text-muted-foreground">Shift {shiftLabel}</p>
              )}
            </div>
            {/* Close button for mobile drawer */}
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 lg:hidden"
                aria-label="Close roster"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {processedFirefighters.length} member{processedFirefighters.length !== 1 ? 's' : ''}
            {filterAvailable && ' (available only)'}
          </div>
        </div>

        {/* Filter/Sort Controls */}
        <div className="flex gap-2 p-2">
          <Button
            variant={filterAvailable ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilterAvailable(!filterAvailable)}
            className="flex-1 text-xs"
          >
            <Filter className="h-3 w-3 mr-1" />
            {filterAvailable ? 'Available' : 'All'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSort}
            className="flex-1 text-xs"
            title={getSortLabel()}
          >
            <ArrowUpDown className="h-3 w-3 mr-1" />
            {getSortLabel()}
          </Button>
        </div>
      </div>

      {/* Roster List - Scrollable */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {processedFirefighters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            {filterAvailable ? 'No available firefighters' : 'No firefighters in roster'}
          </div>
        ) : (
          processedFirefighters.map((firefighter, index) => (
            <RosterItem
              key={firefighter.id}
              firefighter={firefighter}
              number={index + 1}
              isSelected={selectedFirefighterId === firefighter.id}
              onClick={() => onFirefighterClick?.(firefighter.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
