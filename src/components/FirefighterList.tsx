/**
 * FirefighterList - Roster List View
 *
 * Main roster list with drag-and-drop reordering.
 * Uses MaterialM design system.
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

/**
 * Firefighter List Component
 *
 * Uses MaterialM design system with all M3 sub-components:
 * - RosterHeaderM3, BulkActionsM3, RosterSearchBarM3
 * - FilterPanelM3, FirefighterItemM3, ExportMenuM3
 * - Full drag-and-drop with MaterialM elevation and colors
 */
export { FirefighterListM3 as FirefighterList, type FirefighterListProps } from './FirefighterListM3';
