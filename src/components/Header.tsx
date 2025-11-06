/**
 * Header - Navigation Bar
 *
 * Main navigation header with logo, actions, and responsive design.
 * Automatically switches between MaterialM and legacy styling based on feature flag.
 *
 * @example
 * ```tsx
 * <Header
 *   onShowHelp={handleShowHelp}
 *   currentShift={currentShift}
 *   onShiftChange={handleShiftChange}
 *   isDarkMode={isDarkMode}
 *   onToggleDarkMode={toggleDarkMode}
 * />
 * ```
 */

import {
  Clock,
  HelpCircle,
  Menu,
  Moon,
  Printer,
  Shield,
  Sun,
  UserPlus,
} from "lucide-react";
import { Navbar } from 'flowbite-react';
import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { Shift } from "../lib/supabase";
import { ButtonM3 } from "./m3/ButtonM3";
import { BadgeM3 } from "./m3/BadgeM3";
import {
  ConnectionStatusDot,
  ConnectionStatusIndicator,
} from "./ConnectionStatusIndicator";
import { ShiftSelector } from "./ShiftSelector";
import { HeaderLegacy } from "./HeaderLegacy";

interface HeaderProps {
  onShowHelp: () => void;
  onShowActivityLog: () => void;
  onQuickAddFirefighter: () => void;
  onOpenMobileMenu: () => void;
  isAdminMode: boolean;
  currentShift: Shift;
  onShiftChange: (shift: Shift) => void;
  isDarkMode?: boolean;
  onToggleDarkMode: () => void;
}

/**
 * MaterialM Header Component
 */
function HeaderM3({
  onShowHelp,
  onShowActivityLog,
  onQuickAddFirefighter,
  onOpenMobileMenu,
  isAdminMode,
  currentShift,
  onShiftChange,
  isDarkMode = true,
  onToggleDarkMode,
}: HeaderProps) {
  return (
    <Navbar
      fluid
      className="border-b backdrop-blur-sm sticky top-0 z-40 shadow-materialm-2 bg-white/95 dark:bg-materialm-darkgray/95 dark:border-materialm-border-dark"
    >
      <div className="w-full px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-4 min-w-0 leading-tight">
            <div className="flex-shrink-0">
              <img
                src="/icon-192x192.png"
                alt="FirefighterHub Logo"
                className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] translate-y-[1px]"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold truncate text-gray-900 dark:text-gray-100">
                Hold List Manager
              </h1>
              <p className="text-sm sm:text-base mt-0.5 hidden sm:block text-gray-600 dark:text-gray-400">
                Organize your team's hold rotation schedule
              </p>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Context Section - Shift */}
              <div className="flex items-center gap-2 pr-3 border-r border-materialm-border dark:border-materialm-border-dark">
                <ShiftSelector
                  currentShift={currentShift}
                  onShiftChange={onShiftChange}
                />
              </div>

              {/* Connection Status Indicator */}
              <ConnectionStatusIndicator showLabel={false} />
            </div>

            {/* Primary Actions */}
            <div className="hidden sm:flex items-center gap-2">
              {isAdminMode && (
                <ButtonM3
                  color="success"
                  size="md"
                  startIcon={<UserPlus size={18} />}
                  onClick={onQuickAddFirefighter}
                  className="shadow-materialm-2"
                >
                  <span className="hidden md:inline">Add Member</span>
                </ButtonM3>
              )}
            </div>

            {/* Secondary Actions */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => window.print()}
                className={`p-2 rounded-lg transition-colors focus-ring flex flex-col items-center gap-0.5 ${
                  isDarkMode
                    ? "hover:bg-materialm-dark text-gray-400 hover:text-gray-200"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-700"
                }`}
                aria-label="Print calendar"
              >
                <Printer size={20} />
                <span className="text-xs font-medium">Print</span>
              </button>
              <button
                onClick={onShowActivityLog}
                className={`p-2 min-h-[44px] rounded-lg transition-colors focus-ring flex flex-col items-center justify-center gap-0.5 ${
                  isDarkMode
                    ? "hover:bg-materialm-dark text-gray-400 hover:text-gray-200"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-700"
                }`}
                aria-label="View activity history"
              >
                <Clock size={20} />
                <span className="text-xs font-medium">Activity</span>
              </button>
              <button
                onClick={onToggleDarkMode}
                className={`p-2 min-h-[44px] rounded-lg transition-colors focus-ring flex flex-col items-center justify-center gap-0.5 ${
                  isDarkMode
                    ? "hover:bg-materialm-dark text-gray-400 hover:text-gray-200"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-700"
                }`}
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span className="text-xs font-medium">
                  {isDarkMode ? "Light" : "Dark"}
                </span>
              </button>
              <button
                onClick={onShowHelp}
                className={`p-2 min-h-[44px] rounded-lg transition-colors focus-ring flex flex-col items-center justify-center gap-0.5 ${
                  isDarkMode
                    ? "hover:bg-materialm-dark text-gray-400 hover:text-gray-200"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-700"
                }`}
                aria-label="Show help"
              >
                <HelpCircle size={20} />
                <span className="text-xs font-medium">Help</span>
              </button>
            </div>

            {/* Admin Mode Badge */}
            {isAdminMode && (
              <BadgeM3
                color="primary"
                variant="tonal"
                icon={<Shield size={14} />}
                className="hidden sm:flex"
              >
                ADMIN
              </BadgeM3>
            )}

            {/* Mobile Connection Status (Compact) */}
            <div className="lg:hidden">
              <ConnectionStatusDot />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={onOpenMobileMenu}
              className={`sm:hidden p-2 min-h-[44px] rounded-lg transition-colors focus-ring ${
                isDarkMode
                  ? "hover:bg-materialm-dark text-gray-200"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Add Button */}
        {isAdminMode && (
          <div className="sm:hidden flex items-center gap-2 mt-3 pt-3 border-t dark:border-materialm-border-dark">
            <ButtonM3
              color="success"
              size="md"
              fullWidth
              startIcon={<UserPlus size={16} />}
              onClick={onQuickAddFirefighter}
              className="shadow-materialm-2"
            >
              <span className="text-sm">Add Member</span>
            </ButtonM3>
          </div>
        )}
      </div>
    </Navbar>
  );
}

/**
 * Header Component with Feature Flag
 *
 * Switches between MaterialM and legacy versions.
 */
export function Header(props: HeaderProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <HeaderLegacy {...props} />;
  }

  return <HeaderM3 {...props} />;
}
