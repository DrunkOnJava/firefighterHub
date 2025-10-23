import { X, Keyboard } from 'lucide-react';
import { KeyboardShortcut, formatShortcut } from '../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
  isDarkMode?: boolean;
}

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
  shortcuts,
  isDarkMode = true
}: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const groupedShortcuts = {
    navigation: shortcuts.filter(s => ['k', 'f'].includes(s.key.toLowerCase())),
    actions: shortcuts.filter(s => ['n', 'e', 'z'].includes(s.key.toLowerCase())),
    other: shortcuts.filter(s => s.key.toLowerCase() === 'escape' || s.key === '?')
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl rounded-lg shadow-2xl ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-slate-900'
        }`}
        role="dialog"
        aria-labelledby="shortcuts-modal-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'
            }`}>
              <Keyboard className={`w-6 h-6 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <h2
              id="shortcuts-modal-title"
              className="text-xl font-semibold"
            >
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-slate-100 text-slate-400 hover:text-slate-900'
            }`}
            aria-label="Close shortcuts modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
            Use these keyboard shortcuts to navigate and perform actions faster.
          </p>

          {/* Navigation Shortcuts */}
          {groupedShortcuts.navigation.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-sm font-semibold mb-3 ${
                isDarkMode ? 'text-gray-400' : 'text-slate-500'
              }`}>
                NAVIGATION
              </h3>
              <div className="space-y-2">
                {groupedShortcuts.navigation.map((shortcut, index) => (
                  <ShortcutRow
                    key={index}
                    shortcut={shortcut}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Shortcuts */}
          {groupedShortcuts.actions.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-sm font-semibold mb-3 ${
                isDarkMode ? 'text-gray-400' : 'text-slate-500'
              }`}>
                ACTIONS
              </h3>
              <div className="space-y-2">
                {groupedShortcuts.actions.map((shortcut, index) => (
                  <ShortcutRow
                    key={index}
                    shortcut={shortcut}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Shortcuts */}
          {groupedShortcuts.other.length > 0 && (
            <div>
              <h3 className={`text-sm font-semibold mb-3 ${
                isDarkMode ? 'text-gray-400' : 'text-slate-500'
              }`}>
                OTHER
              </h3>
              <div className="space-y-2">
                {groupedShortcuts.other.map((shortcut, index) => (
                  <ShortcutRow
                    key={index}
                    shortcut={shortcut}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tip */}
          <div className={`mt-6 p-4 rounded-lg ${
            isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
          }`}>
            <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              <strong>Tip:</strong> Press <kbd className={`px-2 py-1 rounded ${
                isDarkMode ? 'bg-blue-900/50' : 'bg-white'
              }`}>?</kbd> anytime to view this shortcuts reference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShortcutRow({
  shortcut,
  isDarkMode
}: {
  shortcut: KeyboardShortcut;
  isDarkMode: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className={isDarkMode ? 'text-gray-200' : 'text-slate-700'}>
        {shortcut.description}
      </span>
      <kbd className={`px-3 py-1 rounded font-mono text-sm ${
        isDarkMode
          ? 'bg-gray-700 text-gray-300 border border-gray-600'
          : 'bg-slate-100 text-slate-700 border border-slate-300'
      }`}>
        {formatShortcut(shortcut)}
      </kbd>
    </div>
  );
}
