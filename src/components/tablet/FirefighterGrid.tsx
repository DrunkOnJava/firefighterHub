/**
 * Tablet Firefighter Grid Component
 * 
 * 2-column grid layout optimized for tablet devices (768px - 1023px).
 * Uses the same FirefighterCard component as mobile but in a grid layout.
 */

import { Firefighter } from '../../lib/supabase';
import { tokens } from '../../styles';
import { FirefighterCard } from '../mobile/FirefighterCard';

interface FirefighterGridProps {
  firefighters: Firefighter[];
  onCompleteHold?: (id: string) => void;
  onTransferShift?: (id: string) => void;
  onDeactivate?: (id: string) => void;
  onSelect?: (firefighter: Firefighter) => void;
  isAdminMode?: boolean;
  isDarkMode?: boolean;
  columns?: 2 | 3; // Default 2 for tablet, 3 for large tablet
}

export function FirefighterGrid({
  firefighters,
  onCompleteHold,
  onTransferShift,
  onDeactivate,
  onSelect,
  isAdminMode = false,
  isDarkMode = true,
  columns = 2,
}: FirefighterGridProps) {
  // Find next firefighter in rotation (first available)
  const nextFirefighter = firefighters.find((ff) => ff.is_available);

  return (
    <div
      className={`
        grid
        ${columns === 2 ? 'grid-cols-2' : 'grid-cols-3'}
        ${tokens.spacing.gap.md}
        ${tokens.spacing.card.md}
      `}
    >
      {firefighters.map((firefighter) => (
        <FirefighterCard
          key={firefighter.id}
          firefighter={firefighter}
          onCompleteHold={onCompleteHold}
          onTransferShift={onTransferShift}
          onDeactivate={onDeactivate}
          onSelect={onSelect}
          isAdminMode={isAdminMode}
          isDarkMode={isDarkMode}
          isNextInRotation={nextFirefighter?.id === firefighter.id}
        />
      ))}
    </div>
  );
}
