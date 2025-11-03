import {
  Clock,
  HelpCircle,
  Lightbulb,
  Moon,
  Shield,
  Sun,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { Shift } from "../lib/supabase";
import { ShiftSelector } from "./ShiftSelector";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onShowHelp: () => void;
  onShowActivityLog: () => void;
  onQuickAddFirefighter: () => void;
  isAdminMode: boolean;
  currentShift: Shift;
  onShiftChange: (shift: Shift) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function MobileNav({
  isOpen,
  onClose,
  onShowHelp,
  onShowActivityLog,
  onQuickAddFirefighter,
  isAdminMode,
  currentShift,
  onShiftChange,
  isDarkMode,
  onToggleDarkMode,
}: MobileNavProps) {
  const trapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-nav-title"
      />
      <nav
        ref={trapRef}
        className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] border-l-2 z-50 shadow-2xl animate-slide-in-right ${
          isDarkMode
            ? "bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700"
            : "bg-gradient-to-b from-slate-50 to-white border-slate-300"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={`border-b-2 p-5 flex items-center justify-between ${
              isDarkMode
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700"
                : "bg-gradient-to-r from-slate-100 to-slate-50 border-slate-300"
            }`}
          >
            <div>
              <h2
                id="mobile-nav-title"
                className={`text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Menu
              </h2>
              {isAdminMode && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Shield
                    size={12}
                    className={isDarkMode ? "text-blue-400" : "text-blue-600"}
                  />
                  <span
                    className={`text-xs font-bold ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    ADMIN MODE
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors focus-ring ${
                isDarkMode
                  ? "hover:bg-gray-700 text-gray-400"
                  : "hover:bg-slate-200 text-slate-600"
              }`}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Context Section */}
            <section>
              <h3
                className={`text-sm font-bold uppercase tracking-wide mb-3 ${
                  isDarkMode ? "text-gray-400" : "text-slate-600"
                }`}
              >
                Current Context
              </h3>
              <div className="space-y-3">
                <div>
                  <label
                    className={`text-xs font-semibold mb-2 block ${
                      isDarkMode ? "text-gray-400" : "text-slate-600"
                    }`}
                  >
                    Active Shift
                  </label>
                  <ShiftSelector
                    currentShift={currentShift}
                    onShiftChange={onShiftChange}
                  />
                </div>
              </div>
            </section>

            {/* Primary Actions */}
            {isAdminMode && (
              <section>
                <h3
                  className={`text-sm font-bold uppercase tracking-wide mb-3 ${
                    isDarkMode ? "text-gray-400" : "text-slate-600"
                  }`}
                >
                  Quick Actions
                </h3>
                <button
                  onClick={() => {
                    onQuickAddFirefighter();
                    onClose();
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg focus-ring"
                >
                  <UserPlus size={20} />
                  Add Team Member
                </button>
              </section>
            )}

            {/* Secondary Actions */}
            <section>
              <h3
                className={`text-sm font-bold uppercase tracking-wide mb-3 ${
                  isDarkMode ? "text-gray-400" : "text-slate-600"
                }`}
              >
                Tools
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onShowActivityLog();
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 p-4 border rounded-lg transition-colors text-left focus-ring ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700 border-gray-700"
                      : "bg-white hover:bg-slate-50 border-slate-300"
                  }`}
                >
                  <Clock
                    size={22}
                    className={isDarkMode ? "text-blue-400" : "text-blue-600"}
                  />
                  <div>
                    <div
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Activity History
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-slate-600"
                      }`}
                    >
                      View recent actions
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onShowHelp();
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 p-4 border rounded-lg transition-colors text-left focus-ring ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700 border-gray-700"
                      : "bg-white hover:bg-slate-50 border-slate-300"
                  }`}
                >
                  <HelpCircle
                    size={22}
                    className={
                      isDarkMode ? "text-purple-400" : "text-purple-600"
                    }
                  />
                  <div>
                    <div
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Help & Guide
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-slate-600"
                      }`}
                    >
                      Learn about features
                    </div>
                  </div>
                </button>
              </div>
            </section>

            {/* Settings */}
            <section>
              <h3
                className={`text-sm font-bold uppercase tracking-wide mb-3 ${
                  isDarkMode ? "text-gray-400" : "text-slate-600"
                }`}
              >
                Preferences
              </h3>
              <button
                onClick={onToggleDarkMode}
                className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors focus-ring ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 border-gray-700"
                    : "bg-white hover:bg-slate-50 border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Sun size={22} className="text-amber-400" />
                  ) : (
                    <Moon size={22} className="text-slate-700" />
                  )}
                  <div className="text-left">
                    <div
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Theme
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-slate-600"
                      }`}
                    >
                      {isDarkMode ? "Dark mode" : "Light mode"}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-xs font-semibold ${
                    isDarkMode ? "text-gray-500" : "text-slate-500"
                  }`}
                >
                  Toggle
                </div>
              </button>
            </section>

            {/* Info Section */}
            {!isAdminMode && (
              <section className="pt-4 border-t-2">
                <div
                  className={`border rounded-lg p-4 ${
                    isDarkMode
                      ? "bg-blue-900/30 border-blue-700"
                      : "bg-blue-50 border-blue-300"
                  }`}
                >
                  <h3
                    className={`font-semibold mb-2 flex items-center gap-2 ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    <Lightbulb
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    Quick Tip
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-slate-700"
                    }`}
                  >
                    Enable Admin mode to add firefighters and schedule holds.
                  </p>
                </div>
              </section>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
