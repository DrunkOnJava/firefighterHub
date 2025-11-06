/**
 * KeyboardShortcutsModal - Routing Wrapper
 *
 * Routes between MaterialM (M3) and Legacy keyboard shortcuts modal implementations
 * based on the MATERIALM feature flag.
 */

import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { KeyboardShortcut } from "../hooks/useKeyboardShortcuts";
import { KeyboardShortcutsModalLegacy } from "./KeyboardShortcutsModalLegacy";
import { KeyboardShortcutsModalM3 } from "./KeyboardShortcutsModalM3";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}

export function KeyboardShortcutsModal(props: KeyboardShortcutsModalProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');
  return useMaterialM ? <KeyboardShortcutsModalM3 {...props} /> : <KeyboardShortcutsModalLegacy {...props} />;
}
