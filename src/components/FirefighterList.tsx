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
import { FirefighterListM3 } from "./FirefighterListM3";

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
 * MaterialM version includes all M3 sub-components:
 * - RosterHeaderM3, BulkActionsM3, RosterSearchBarM3
 * - FilterPanelM3, FirefighterItemM3, ExportMenuM3
 * - Full drag-and-drop with MaterialM elevation and colors
 */
export function FirefighterList(props: FirefighterListProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <FirefighterListLegacy {...props} />;
  }

  return <FirefighterListM3 {...props} />;
}
