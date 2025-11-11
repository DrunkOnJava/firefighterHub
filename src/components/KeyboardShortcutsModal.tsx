import { Keyboard } from "lucide-react";
import {
  KeyboardShortcut,
  formatShortcut,
} from '@/hooks/useKeyboardShortcuts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30">
              <Keyboard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Keyboard Shortcuts
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto space-y-6 pr-2">
          <p className="text-muted-foreground">
            Use these keyboard shortcuts to navigate and perform actions faster.
          </p>

          {/* Navigation Shortcuts */}
          {groupedShortcuts.navigation.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
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
            <div>
              <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
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
              <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
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
          <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Tip:</strong> Press{" "}
              <kbd className="px-2 py-1 rounded-sm bg-background text-foreground border border-border font-mono text-xs">
                ?
              </kbd>{" "}
              anytime to view this shortcuts reference.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShortcutRow({ shortcut }: { shortcut: KeyboardShortcut }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-foreground">
        {shortcut.description}
      </span>
      <kbd className="px-3 py-1 rounded-sm font-mono text-sm bg-secondary text-secondary-foreground border border-border">
        {formatShortcut(shortcut)}
      </kbd>
    </div>
  );
}
