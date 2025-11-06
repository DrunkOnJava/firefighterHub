/**
 * MobileNavLegacy - Original Mobile Navigation Implementation
 *
 * Preserved for backward compatibility during MaterialM migration.
 * Slide-out mobile menu with actions and preferences.
 */

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
import { tokens } from "../styles";
import { ShiftSelector } from "./ShiftSelector";

interface MobileNavLegacyProps {
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

export function MobileNavLegacy({
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
}: MobileNavLegacyProps) {
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
        className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] border-l-2 z-50 shadow-2xl animate-slide-in-right bg-gradient-to-b from-materialm-darkgray to-materialm-dark border-materialm-border-dark"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className="border-b-2 p-5 flex items-center justify-between bg-gradient-to-r from-materialm-dark to-materialm-darkgray border-materialm-border-dark"
          >
            <div>
              <h2
                id="mobile-nav-title"
                className={`${tokens.typography.heading.h3} text-white`}
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
              className={`p-2 ${tokens.touchTarget.min} rounded-lg transition-colors focus-ring flex items-center justify-center hover:bg-materialm-darkgray text-materialm-text-secondary`}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Context Section */}
            <section>
              <h3
                className="text-sm font-bold uppercase tracking-wide mb-3 text-materialm-text-secondary"
              >
                Current Context
              </h3>
              <div className="space-y-3">
                <div>
                  <label
                    className="text-xs font-semibold mb-2 block text-materialm-text-secondary"
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
                  className="text-sm font-bold uppercase tracking-wide mb-3 text-materialm-text-secondary"
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
                className="text-sm font-bold uppercase tracking-wide mb-3 text-materialm-text-secondary"
              >
                Tools
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onShowActivityLog();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-4 border rounded-lg transition-colors text-left focus-ring bg-materialm-darkgray hover:bg-materialm-dark border-materialm-border-dark"
                >
                  <Clock
                    size={22}
                    className="text-materialm-primary"
                  />
                  <div>
                    <div
                      className="font-semibold text-white"
                    >
                      Activity History
                    </div>
                    <div
                      className="text-sm text-materialm-text-secondary"
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
                  className="w-full flex items-center gap-3 p-4 border rounded-lg transition-colors text-left focus-ring bg-materialm-darkgray hover:bg-materialm-dark border-materialm-border-dark"
                >
                  <HelpCircle
                    size={22}
                    className="text-materialm-info"
                  />
                  <div>
                    <div
                      className="font-semibold text-white"
                    >
                      Help & Guide
                    </div>
                    <div
                      className="text-sm text-materialm-text-secondary"
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
                className="text-sm font-bold uppercase tracking-wide mb-3 text-materialm-text-secondary"
              >
                Preferences
              </h3>
              <button
                onClick={onToggleDarkMode}
                className="w-full flex items-center justify-between p-4 border rounded-lg transition-colors focus-ring bg-materialm-darkgray hover:bg-materialm-dark border-materialm-border-dark"
              >
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Sun size={22} className="text-amber-400" />
                  ) : (
                    <Moon size={22} className="text-slate-700" />
                  )}
                  <div className="text-left">
                    <div
                      className="font-semibold text-white"
                    >
                      Theme
                    </div>
                    <div
                      className="text-sm text-materialm-text-secondary"
                    >
                      {isDarkMode ? "Dark mode" : "Light mode"}
                    </div>
                  </div>
                </div>
                <div
                  className="text-xs font-semibold text-materialm-text-disabled"
                >
                  Toggle
                </div>
              </button>
            </section>

            {/* Info Section */}
            {!isAdminMode && (
              <section className="pt-4 border-t-2">
                <div
                  className="border rounded-lg p-4 bg-materialm-primary/20 border-materialm-primary"
                >
                  <h3
                    className="font-semibold mb-2 flex items-center gap-2 text-white"
                  >
                    <Lightbulb
                      className="w-4 h-4 text-materialm-primary"
                    />
                    Quick Tip
                  </h3>
                  <p
                    className="text-sm text-materialm-text"
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
