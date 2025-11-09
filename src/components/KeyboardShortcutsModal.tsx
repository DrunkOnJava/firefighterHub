import { Keyboard, X } from "lucide-react";
import {
  KeyboardShortcut,
  formatShortcut,
} from "../hooks/useKeyboardShortcuts";
import { colors, tokens } from "../styles";
import { IconButton } from "./ui/IconButton";
import { visualHeading } from "../styles/visualHeadings";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
  shortcuts,
}: KeyboardShortcutsModalProps) {
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
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center ${tokens.spacing.card.md}`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${colors.components.modal.overlay}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl ${colors.components.modal.background} ${colors.components.modal.border} ${tokens.borders.radius.lg} ${colors.components.modal.shadow} ${colors.structural.text.primary}`}
        role="dialog"
        aria-labelledby="shortcuts-modal-title"
        aria-modal="true"
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between ${tokens.spacing.card.lg} border-b ${colors.structural.border.default}`}
        >
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            <div
              className={`p-2 ${tokens.borders.radius.md} ${colors.semantic.scheduled.light}`}
            >
              <Keyboard
                className={`w-6 h-6 ${colors.semantic.scheduled.text}`}
              />
            </div>
            <h2
              id="shortcuts-modal-title"
              className={visualHeading('h3')}
            >
              Keyboard Shortcuts
            </h2>
          </div>
          <IconButton
            icon={X}
            label="Close shortcuts modal"
            onClick={onClose}
            variant="default"
            size="md"
            isDarkMode={true}
          />
        </div>

        {/* Content */}
        <div
          className={`${tokens.spacing.card.lg} max-h-[70vh] overflow-y-auto`}
        >
          <p className={`mb-6 ${colors.structural.text.secondary}`}>
            Use these keyboard shortcuts to navigate and perform actions faster.
          </p>

          {/* Navigation Shortcuts */}
          {groupedShortcuts.navigation.length > 0 && (
            <div className="mb-6">
              <h3
                className={`${tokens.typography.body.secondary} font-semibold mb-3 ${colors.structural.text.tertiary} uppercase`}
              >
                NAVIGATION
              </h3>
              <div className="space-y-2">
                {groupedShortcuts.navigation.map((shortcut, index) => (
                  <ShortcutRow key={index} shortcut={shortcut} />
                ))}
              </div>
            </div>
          )}

          {/* Action Shortcuts */}
          {groupedShortcuts.actions.length > 0 && (
            <div className="mb-6">
              <h3
                className={`${tokens.typography.body.secondary} font-semibold mb-3 ${colors.structural.text.tertiary} uppercase`}
              >
                ACTIONS
              </h3>
              <div className="space-y-2">
                {groupedShortcuts.actions.map((shortcut, index) => (
                  <ShortcutRow key={index} shortcut={shortcut} />
                ))}
              </div>
            </div>
          )}

          {/* Other Shortcuts */}
          {groupedShortcuts.other.length > 0 && (
            <div>
              <h3
                className={`${tokens.typography.body.secondary} font-semibold mb-3 ${colors.structural.text.tertiary} uppercase`}
              >
                OTHER
              </h3>
              <div className="space-y-2">
                {groupedShortcuts.other.map((shortcut, index) => (
                  <ShortcutRow key={index} shortcut={shortcut} />
                ))}
              </div>
            </div>
          )}

          {/* Tip */}
          <div
            className={`mt-6 ${tokens.spacing.card.md} ${tokens.borders.radius.md} ${colors.semantic.scheduled.light} border ${colors.semantic.scheduled.border}`}
          >
            <p
              className={`${tokens.typography.body.secondary} ${colors.semantic.scheduled.text}`}
            >
              <strong>Tip:</strong> Press{" "}
              <kbd
                className={`px-2 py-1 ${tokens.borders.radius.sm} ${colors.interactive.button.default}`}
              >
                ?
              </kbd>{" "}
              anytime to view this shortcuts reference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShortcutRow({ shortcut }: { shortcut: KeyboardShortcut }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className={colors.structural.text.primary}>
        {shortcut.description}
      </span>
      <kbd
        className={`px-3 py-1 ${tokens.borders.radius.sm} font-mono ${tokens.typography.body.secondary} ${colors.interactive.button.default} ${colors.structural.text.secondary} border ${colors.structural.border.default}`}
      >
        {formatShortcut(shortcut)}
      </kbd>
    </div>
  );
}
