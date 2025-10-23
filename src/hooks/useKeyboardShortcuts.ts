import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;  // Command key on Mac
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
  enabled?: boolean;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

/**
 * Hook for managing keyboard shortcuts throughout the application
 *
 * @example
 * ```tsx
 * useKeyboardShortcuts({
 *   shortcuts: [
 *     {
 *       key: 'k',
 *       ctrl: true,
 *       meta: true,
 *       description: 'Focus search',
 *       action: () => searchInputRef.current?.focus()
 *     }
 *   ]
 * });
 * ```
 */
export function useKeyboardShortcuts({
  shortcuts,
  enabled = true
}: UseKeyboardShortcutsOptions) {
  const shortcutsRef = useRef(shortcuts);

  // Update ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in inputs (unless specifically allowed)
    const target = event.target as HTMLElement;
    const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;

    for (const shortcut of shortcutsRef.current) {
      // Skip disabled shortcuts
      if (shortcut.enabled === false) continue;

      // Check if the key matches
      if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) continue;

      // Check modifiers
      const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey;
      const metaMatch = shortcut.meta ? event.metaKey : !event.metaKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;

      if (ctrlMatch && metaMatch && altMatch && shiftMatch) {
        // Special handling for search shortcuts - allow them to work in inputs
        const isSearchShortcut = shortcut.key.toLowerCase() === 'k' && (shortcut.ctrl || shortcut.meta);

        if (!isInput || isSearchShortcut) {
          event.preventDefault();
          event.stopPropagation();
          shortcut.action();
          break;
        }
      }
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);

  return {
    shortcuts: shortcutsRef.current
  };
}

/**
 * Formats a keyboard shortcut for display
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  if (shortcut.ctrl) parts.push(isMac ? '⌘' : 'Ctrl');
  if (shortcut.alt) parts.push(isMac ? '⌥' : 'Alt');
  if (shortcut.shift) parts.push(isMac ? '⇧' : 'Shift');

  parts.push(shortcut.key.toUpperCase());

  return parts.join(isMac ? '' : '+');
}
