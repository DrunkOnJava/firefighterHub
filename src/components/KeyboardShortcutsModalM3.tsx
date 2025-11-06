/**
 * KeyboardShortcutsModalM3 - MaterialM Keyboard Shortcuts Modal
 *
 * Material Design 3 version of the keyboard shortcuts reference modal.
 * Uses DialogM3, ButtonM3, and BadgeM3 components with M3 color system.
 */

import { Keyboard, X } from "lucide-react";
import {
  KeyboardShortcut,
  formatShortcut,
} from "../hooks/useKeyboardShortcuts";
import { DialogM3 } from "./m3/DialogM3";
import { ButtonM3 } from "./m3/ButtonM3";
import { BadgeM3 } from "./m3/BadgeM3";
import { m3Classes } from "../styles/colorSystemM3";

interface KeyboardShortcutsModalM3Props {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}

export function KeyboardShortcutsModalM3({
  isOpen,
  onClose,
  shortcuts,
}: KeyboardShortcutsModalM3Props) {
  if (!isOpen) return null;

  const groupedShortcuts = {
    navigation: shortcuts.filter((s) =>
      ["k", "f"].includes(s.key.toLowerCase())
    ),
    actions: shortcuts.filter((s) =>
      ["n", "e", "z"].includes(s.key.toLowerCase())
    ),
    other: shortcuts.filter(
      (s) => s.key.toLowerCase() === "escape" || s.key === "?"
    ),
  };

  return (
    <DialogM3
      show={isOpen}
      onClose={onClose}
      size="lg"
      dismissible={true}
    >
      <div>
        {/* Header */}
        <div
          className={`${m3Classes.surface.containerHigh} border-b border-materialm-border-dark p-6 flex items-center justify-between`}
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-materialm-primary to-materialm-primary-emphasis p-3 rounded-lg shadow-materialm-2">
              <Keyboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2
                id="shortcuts-modal-title"
                className={`text-xl font-semibold ${m3Classes.onSurface.high}`}
              >
                Keyboard Shortcuts
              </h2>
              <p className={`text-sm ${m3Classes.onSurface.medium}`}>
                Use these shortcuts to navigate and perform actions faster
              </p>
            </div>
          </div>
          <ButtonM3
            onClick={onClose}
            variant="text"
            color="neutral"
            size="md"
            className="p-2"
            aria-label="Close shortcuts modal"
          >
            <X className="w-5 h-5" />
          </ButtonM3>
        </div>

        {/* Content */}
        <DialogM3.Body>
          <div className="space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Navigation Shortcuts */}
            {groupedShortcuts.navigation.length > 0 && (
              <div>
                <h3
                  className={`text-sm font-semibold mb-3 ${m3Classes.onSurface.medium} uppercase tracking-wider`}
                >
                  Navigation
                </h3>
                <div className="space-y-3">
                  {groupedShortcuts.navigation.map((shortcut, index) => (
                    <ShortcutRowM3 key={index} shortcut={shortcut} />
                  ))}
                </div>
              </div>
            )}

            {/* Action Shortcuts */}
            {groupedShortcuts.actions.length > 0 && (
              <div>
                <h3
                  className={`text-sm font-semibold mb-3 ${m3Classes.onSurface.medium} uppercase tracking-wider`}
                >
                  Actions
                </h3>
                <div className="space-y-3">
                  {groupedShortcuts.actions.map((shortcut, index) => (
                    <ShortcutRowM3 key={index} shortcut={shortcut} />
                  ))}
                </div>
              </div>
            )}

            {/* Other Shortcuts */}
            {groupedShortcuts.other.length > 0 && (
              <div>
                <h3
                  className={`text-sm font-semibold mb-3 ${m3Classes.onSurface.medium} uppercase tracking-wider`}
                >
                  Other
                </h3>
                <div className="space-y-3">
                  {groupedShortcuts.other.map((shortcut, index) => (
                    <ShortcutRowM3 key={index} shortcut={shortcut} />
                  ))}
                </div>
              </div>
            )}

            {/* Tip */}
            <div
              className={`mt-6 p-4 rounded-lg border border-materialm-border-dark ${m3Classes.surface.containerLow}`}
            >
              <p className={`text-sm ${m3Classes.onSurface.medium}`}>
                <strong className={m3Classes.onSurface.high}>Tip:</strong> Press{" "}
                <BadgeM3 color="primary" variant="outlined" size="xs">
                  ?
                </BadgeM3>
                {" "}anytime to view this shortcuts reference.
              </p>
            </div>
          </div>
        </DialogM3.Body>
      </div>
    </DialogM3>
  );
}

function ShortcutRowM3({ shortcut }: { shortcut: KeyboardShortcut }) {
  return (
    <div className="flex items-center justify-between py-2 px-2">
      <span className={m3Classes.onSurface.high}>
        {shortcut.description}
      </span>
      <BadgeM3 color="neutral" variant="outlined" size="sm">
        <span className="font-mono text-sm">{formatShortcut(shortcut)}</span>
      </BadgeM3>
    </div>
  );
}
