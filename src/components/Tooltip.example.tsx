/**
 * TOOLTIP USAGE EXAMPLES
 *
 * This file demonstrates how to add tooltips to existing buttons and elements.
 */

import { Tooltip } from './Tooltip';
import { Trash2, Eye, UserX, RefreshCw } from 'lucide-react';

/**
 * EXAMPLE 1: Icon button with tooltip
 */
export function IconButtonExample() {
  return (
    <Tooltip content="Delete firefighter" position="top">
      <button
        onClick={() => console.log('Delete')}
        className="p-2 hover:bg-red-900/50 text-red-400 rounded transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </Tooltip>
  );
}

/**
 * EXAMPLE 2: Badge with tooltip explaining meaning
 */
export function BadgeExample() {
  return (
    <Tooltip content="Basic Life Support certified" position="top">
      <span className="px-2 py-1 text-xs font-semibold rounded bg-green-900/70 text-green-100">
        BLS
      </span>
    </Tooltip>
  );
}

/**
 * EXAMPLE 3: Button with keyboard shortcut hint
 */
export function ShortcutButtonExample() {
  return (
    <Tooltip content="Quick add firefighter (Ctrl+N)" position="bottom">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
        Add Firefighter
      </button>
    </Tooltip>
  );
}

/**
 * EXAMPLE 4: Complex button group with multiple tooltips
 */
export function ButtonGroupExample() {
  return (
    <div className="flex gap-2">
      <Tooltip content="View profile">
        <button className="p-2 hover:bg-gray-700 rounded">
          <Eye size={16} />
        </button>
      </Tooltip>

      <Tooltip content="Deactivate firefighter">
        <button className="p-2 hover:bg-yellow-900/50 text-yellow-400 rounded">
          <UserX size={16} />
        </button>
      </Tooltip>

      <Tooltip content="Reset roster order">
        <button className="p-2 hover:bg-gray-700 rounded">
          <RefreshCw size={16} />
        </button>
      </Tooltip>
    </div>
  );
}

/**
 * PLACES TO ADD TOOLTIPS:
 *
 * 1. FirefighterList.tsx:
 *    - Delete button (Trash2 icon)
 *    - Deactivate button (UserX icon)
 *    - View profile button (Eye icon)
 *    - Transfer shift button (Repeat icon)
 *    - Reactivate button (RotateCcw icon)
 *    - Export buttons (Download, FileDown icons)
 *    - Select all checkbox
 *
 * 2. Calendar.tsx:
 *    - Day cells (explain hold assignment)
 *    - Remove hold buttons
 *    - Complete hold buttons
 *
 * 3. Sidebar.tsx:
 *    - Statistic badges (explain metrics)
 *
 * 4. Header.tsx:
 *    - Shift selector (explain shift system)
 *    - Dark mode toggle
 *    - Admin mode indicator
 *
 * 5. Badge explanations:
 *    - Certification badges (EMT, Paramedic, etc.)
 *    - Qualification badges (FTO, BLS, ALS)
 *    - Apparatus badges (Ambulance, Engine, etc.)
 */

/**
 * IMPLEMENTATION NOTES:
 *
 * Tooltip component features:
 * - Configurable delay (default 500ms)
 * - 4 positions: top, bottom, left, right
 * - Dark/light mode support
 * - Arrow pointer
 * - Accessible (role="tooltip")
 * - Keyboard support (shows on focus)
 * - Auto-cleanup (no memory leaks)
 *
 * Best practices:
 * - Use clear, concise tooltip text (< 6 words)
 * - Include keyboard shortcuts when relevant
 * - Position to avoid covering important content
 * - Test with keyboard navigation
 */
