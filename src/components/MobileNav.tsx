/**
 * MobileNav - Mobile Navigation Menu
 *
 * Slide-out mobile menu with actions and preferences.
 * Automatically switches between MaterialM and legacy styling based on feature flag.
 *
 * @example
 * ```tsx
 * <MobileNav
 *   isOpen={isMobileMenuOpen}
 *   onClose={handleCloseMobile}
 *   currentShift={currentShift}
 *   isDarkMode={isDarkMode}
 * />
 * ```
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
import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { Shift } from "../lib/supabase";
import { ButtonM3 } from "./m3/ButtonM3";
import { BadgeM3 } from "./m3/BadgeM3";
import { ShiftSelector } from "./ShiftSelector";
import { MobileNavLegacy } from "./MobileNavLegacy";

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

/**
 * MaterialM Mobile Navigation
 */
function MobileNavM3({
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-nav-title"
      />

      {/* Drawer */}
      <nav
        ref={trapRef}
        className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-materialm-darkgray border-l border-materialm-border dark:border-materialm-border-dark z-50 shadow-materialm-5 animate-slide-in-right"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-materialm-border dark:border-materialm-border-dark bg-gray-50 dark:bg-materialm-dark">
            <div className="flex items-center justify-between mb-2">
              <h2
                id="mobile-nav-title"
                className="text-xl font-bold text-gray-900 dark:text-white"
              >
                Menu
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors focus-ring"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            {isAdminMode && (
              <BadgeM3
                color="primary"
                variant="tonal"
                icon={<Shield size={12} />}
                size="xs"
              >
                ADMIN MODE
              </BadgeM3>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Context Section */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wide mb-3 text-gray-500 dark:text-gray-400">
                Current Context
              </h3>
              <div>
                <label className="text-xs font-semibold mb-2 block text-gray-600 dark:text-gray-400">
                  Active Shift
                </label>
                <ShiftSelector
                  currentShift={currentShift}
                  onShiftChange={onShiftChange}
                />
              </div>
            </section>

            {/* Quick Actions */}
            {isAdminMode && (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide mb-3 text-gray-500 dark:text-gray-400">
                  Quick Actions
                </h3>
                <ButtonM3
                  color="success"
                  size="lg"
                  fullWidth
                  startIcon={<UserPlus size={20} />}
                  onClick={() => {
                    onQuickAddFirefighter();
                    onClose();
                  }}
                  className="shadow-materialm-2"
                >
                  Add Team Member
                </ButtonM3>
              </section>
            )}

            {/* Tools */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wide mb-3 text-gray-500 dark:text-gray-400">
                Tools
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onShowActivityLog();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-4 border border-materialm-border dark:border-materialm-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left focus-ring"
                >
                  <Clock size={22} className="text-blue-600 dark:text-blue-400" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Activity History
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      View recent actions
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onShowHelp();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-4 border border-materialm-border dark:border-materialm-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left focus-ring"
                >
                  <HelpCircle size={22} className="text-purple-600 dark:text-purple-400" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Help & Guide
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Learn about features
                    </div>
                  </div>
                </button>
              </div>
            </section>

            {/* Preferences */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wide mb-3 text-gray-500 dark:text-gray-400">
                Preferences
              </h3>
              <button
                onClick={onToggleDarkMode}
                className="w-full flex items-center justify-between p-4 border border-materialm-border dark:border-materialm-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus-ring"
              >
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Sun size={22} className="text-amber-500" />
                  ) : (
                    <Moon size={22} className="text-gray-700" />
                  )}
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Theme
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {isDarkMode ? "Dark mode" : "Light mode"}
                    </div>
                  </div>
                </div>
                <BadgeM3 color="neutral" size="xs">
                  Toggle
                </BadgeM3>
              </button>
            </section>

            {/* Info Section for Non-Admin */}
            {!isAdminMode && (
              <section className="pt-4 border-t-2 border-materialm-border dark:border-materialm-border-dark">
                <div className="bg-materialm-primary-light dark:bg-materialm-primary-light border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">
                        Quick Tip
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Enable Admin mode to add firefighters and schedule holds.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

/**
 * MobileNav Component with Feature Flag
 *
 * Switches between MaterialM and legacy versions.
 */
export function MobileNav(props: MobileNavProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <MobileNavLegacy {...props} />;
  }

  return <MobileNavM3 {...props} />;
}
