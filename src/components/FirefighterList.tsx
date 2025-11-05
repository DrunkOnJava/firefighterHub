/**
 * FirefighterList - Roster List View
 *
 * Main roster list with drag-and-drop reordering.
 * Automatically switches between MaterialM and legacy styling based on feature flag.
 *
 * Features:
 * - Draggable roster reordering
 * - Firefighter cards with actions
 * - Deactivated firefighters section
 *
 * @example
 * ```tsx
 * <FirefighterList
 *   firefighters={firefighters}
 *   onReorder={handleReorder}
 *   isAdminMode={isAdminMode}
 * />
 * ```
 */

import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { ConfirmOptions } from "../hooks/useConfirm";
import { Firefighter, Shift } from "../lib/supabase";
import { FirefighterListLegacy } from "./FirefighterListLegacy";

interface FirefighterListProps {
  firefighters: Firefighter[];
  deactivatedFirefighters?: Firefighter[];
  onAdd: (name: string, station: string) => void;
  onCompleteHold: (id: string) => void;
  onDelete: (id: string) => void;
  onDeactivate: (id: string) => void;
  onReactivate: (id: string, position: number) => void;
  onTransferShift: (id: string) => void;
  onResetAll: () => void;
  onReorder: (firefighters: Firefighter[]) => void;
  currentShift?: Shift;
  isAdminMode?: boolean;
  isDarkMode?: boolean;
  searchInputRef?: React.RefObject<HTMLInputElement>;
  confirmAction?: (options: ConfirmOptions) => Promise<boolean>;
}

/**
 * Firefighter List Component with Feature Flag
 *
 * Switches between MaterialM and legacy versions.
 *
 * Note: The MaterialM version is not yet fully implemented due to complex
 * sub-component dependencies (RosterHeader, BulkActions, FilterPanel, etc.).
 * Currently uses legacy version for both flag states.
 *
 * TODO: Implement full MaterialM version with:
 * - CardM3 for firefighter cards
 * - StatusBadgeM3 for availability
 * - IconButtonM3 for actions
 * - Drag-and-drop with MaterialM elevation
 */
export function FirefighterList(props: FirefighterListProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  // Suppress unused variable warning - kept for future MaterialM implementation
  void useMaterialM;

  // TODO: Complete MaterialM implementation
  // For now, use legacy version for both to avoid breaking drag-and-drop
  // The FirefighterList has complex sub-component dependencies that need
  // individual migration (RosterHeader, BulkActions, FilterPanel, etc.)
  return <FirefighterListLegacy {...props} />;

  // Future implementation:
  // if (!useMaterialM) {
  //   return <FirefighterListLegacy {...props} />;
  // }
  // return <FirefighterListM3 {...props} />;
}
