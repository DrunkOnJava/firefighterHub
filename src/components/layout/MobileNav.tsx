import {
  Clock,
  HelpCircle,
  Lightbulb,
  LogIn,
  LogOut,
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
  onShowLogin: () => void;
  onLogout: () => void;
  isAdminMode: boolean;
  currentShift: Shift;
  onShiftChange: (shift: Shift) => void;
  onToggleDarkMode: () => void;
}

export function MobileNav({
  isOpen,
  onClose,
  onShowHelp,
  onShowActivityLog,
  onQuickAddFirefighter,
  onShowLogin,
  onLogout,
  isAdminMode,
  currentShift,
  onShiftChange,
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
        className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] border-l-2 z-50 shadow-2xl animate-slide-in-right bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 border-slate-700"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className="border-b-2 p-5 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 border-slate-700"
          >
            <div>
              <h2
                id="mobile-nav-title"
                className="text-xl font-bold text-white"
              >
                Menu
              </h2>
              {isAdminMode && (
                <div className="flex items-center gap-1.5 mt-1">
                  <LogOut
                    size={12}
                    className="text-orange-400"
                  />
                  <span
                    className="text-xs font-bold text-orange-400"
                  >
                    BATTALION CHIEF MODE
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 min-h-[44px] rounded-lg transition-colors focus-ring flex items-center justify-center hover:bg-slate-700 text-slate-400"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Context Section */}
            <section>
              <h3
                className="text-sm font-bold uppercase tracking-wide mb-3 text-slate-400"
              >
                Current Context
              </h3>
              <div className="space-y-3">
                <div>
                  <label
                    className="text-xs font-semibold mb-2 block text-slate-400"
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
                  className="text-sm font-bold uppercase tracking-wide mb-3 text-slate-400"
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
                className="text-sm font-bold uppercase tracking-wide mb-3 text-slate-400"
              >
                Tools
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onShowActivityLog();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-4 border rounded-lg transition-colors text-left focus-ring bg-slate-800 hover:bg-slate-700 border-slate-700"
                >
                  <Clock
                    size={22}
                    className="text-blue-400"
                  />
                  <div>
                    <div
                      className="font-semibold text-white"
                    >
                      Activity History
                    </div>
                    <div
                      className="text-sm text-slate-400"
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
                  className="w-full flex items-center gap-3 p-4 border rounded-lg transition-colors text-left focus-ring bg-slate-800 hover:bg-slate-700 border-slate-700"
                >
                  <HelpCircle
                    size={22}
                    className="text-purple-400"
                  />
                  <div>
                    <div
                      className="font-semibold text-white"
                    >
                      Help & Guide
                    </div>
                    <div
                      className="text-sm text-slate-400"
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
                className="text-sm font-bold uppercase tracking-wide mb-3 text-slate-400"
              >
                Preferences
              </h3>
              <div className="space-y-2">
                <button
                  onClick={onToggleDarkMode}
                  className="w-full flex items-center justify-between p-4 border rounded-lg transition-colors focus-ring bg-slate-800 hover:bg-slate-700 border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <Sun size={22} className="text-amber-400" />
                    <div className="text-left">
                      <div
                        className="font-semibold text-white"
                      >
                        Theme
                      </div>
                      <div
                        className="text-sm text-slate-400"
                      >
                        Dark mode
                      </div>
                    </div>
                  </div>
                  <div
                    className="text-xs font-semibold text-slate-500"
                  >
                    Toggle
                  </div>
                </button>

                {isAdminMode ? (
                  <button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-4 border rounded-lg transition-colors focus-ring bg-slate-800 hover:bg-slate-700 border-orange-600"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut size={22} className="text-orange-400" />
                      <div className="text-left">
                        <div
                          className="font-semibold text-white"
                        >
                          Battalion Chief Mode
                        </div>
                        <div
                          className="text-sm text-slate-400"
                        >
                          Active - Click to leave
                        </div>
                      </div>
                    </div>
                    <div
                      className="text-xs font-semibold text-orange-400"
                    >
                      Leave
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onShowLogin();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-4 border rounded-lg transition-colors focus-ring bg-slate-800 hover:bg-slate-700 border-orange-600"
                  >
                    <div className="flex items-center gap-3">
                      <LogIn size={22} className="text-orange-400" />
                      <div className="text-left">
                        <div
                          className="font-semibold text-white"
                        >
                          Battalion Chief Mode
                        </div>
                        <div
                          className="text-sm text-slate-400"
                        >
                          Enable admin features
                        </div>
                      </div>
                    </div>
                    <div
                      className="text-xs font-semibold text-orange-400"
                    >
                      Enter
                    </div>
                  </button>
                )}
              </div>
            </section>

            {/* Info Section */}
            {!isAdminMode && (
              <section className="pt-4 border-t-2">
                <div
                  className="border rounded-lg p-4 bg-blue-900/30 border-blue-700"
                >
                  <h3
                    className="font-semibold mb-2 flex items-center gap-2 text-white"
                  >
                    <Lightbulb
                      className="w-4 h-4 text-blue-400"
                    />
                    Quick Tip
                  </h3>
                  <p
                    className="text-sm text-slate-300"
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
