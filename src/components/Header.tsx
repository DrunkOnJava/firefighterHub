import {
  Clock,
  HelpCircle,
  Menu,
  Moon,
  Shield,
  Sun,
  UserPlus,
} from "lucide-react";
import { Shift } from "../lib/supabase";
import { colors, tokens } from "../styles";
import {
  ConnectionStatusDot,
  ConnectionStatusIndicator,
} from "./ConnectionStatusIndicator";
import { ShiftSelector } from "./ShiftSelector";

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

export function Header({
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
    <header
      className={`
        border-b backdrop-blur-sm sticky top-0
        ${tokens.zIndex.sticky}
        ${tokens.shadows.lg}
        ${
          isDarkMode
            ? `${colors.structural.border.emphasis} bg-gray-900/95`
            : "border-slate-300 bg-white/95"
        }
      `}
    >
      <div className={`px-4 sm:px-6 ${tokens.spacing.section.sm}`}>
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
              <h1
                className={`
                  ${tokens.typography.heading.h1} truncate
                  ${
                    isDarkMode
                      ? colors.structural.text.primary
                      : "text-slate-900"
                  }
                `}
              >
                Hold List Manager
              </h1>
              <p
                className={`
                  ${tokens.typography.body.small} sm:${
                  tokens.typography.body.secondary
                }
                  mt-0.5 hidden sm:block
                  ${
                    isDarkMode
                      ? colors.structural.text.secondary
                      : "text-slate-600"
                  }
                `}
              >
                Organize your team's hold rotation schedule
              </p>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Context Section - Shift */}
              <div className="flex items-center gap-2 pr-3 border-r border-gray-700">
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
                <button
                  onClick={onQuickAddFirefighter}
                  className={`
                    px-4 py-2
                    ${tokens.borders.radius.lg}
                    ${tokens.shadows.lg}
                    font-semibold
                    ${tokens.transitions.fast}
                    flex items-center gap-2
                    bg-green-600 hover:bg-green-700 text-white
                    focus-ring
                  `}
                  aria-label="Quick add team member"
                >
                  <UserPlus size={18} />
                  <span className="hidden md:inline">Add Member</span>
                </button>
              )}
            </div>

            {/* Secondary Actions */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={onShowActivityLog}
                className={`p-2 rounded-lg transition-colors focus-ring flex flex-col items-center gap-0.5 ${
                  isDarkMode
                    ? "hover:bg-gray-800 text-gray-400 hover:text-gray-300"
                    : "hover:bg-slate-200 text-slate-600 hover:text-slate-700"
                }`}
                aria-label="View activity history"
              >
                <Clock size={20} />
                <span className="text-xs font-medium">Activity</span>
              </button>
              <button
                onClick={onToggleDarkMode}
                className={`p-2 rounded-lg transition-colors focus-ring flex flex-col items-center gap-0.5 ${
                  isDarkMode
                    ? "hover:bg-gray-800 text-gray-400 hover:text-gray-300"
                    : "hover:bg-slate-200 text-slate-600 hover:text-slate-700"
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
                className={`p-2 rounded-lg transition-colors focus-ring flex flex-col items-center gap-0.5 ${
                  isDarkMode
                    ? "hover:bg-gray-800 text-gray-400 hover:text-gray-300"
                    : "hover:bg-slate-200 text-slate-600 hover:text-slate-700"
                }`}
                aria-label="Show help"
              >
                <HelpCircle size={20} />
                <span className="text-xs font-medium">Help</span>
              </button>
            </div>

            {/* Admin Mode Badge */}
            {isAdminMode && (
              <div
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                  isDarkMode
                    ? "bg-blue-900/30 border-blue-700 text-blue-300"
                    : "bg-blue-100 border-blue-400 text-blue-700"
                }`}
              >
                <Shield size={14} />
                <span className="text-xs font-bold">ADMIN</span>
              </div>
            )}

            {/* Mobile Connection Status (Compact) */}
            <div className="lg:hidden">
              <ConnectionStatusDot />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={onOpenMobileMenu}
              className={`sm:hidden p-2 rounded-lg transition-colors focus-ring ${
                isDarkMode
                  ? "hover:bg-gray-800 text-gray-300"
                  : "hover:bg-slate-200 text-slate-600"
              }`}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Add Button */}
        {isAdminMode && (
          <div className="sm:hidden flex items-center gap-2 mt-3 pt-3 border-t">
            <button
              onClick={onQuickAddFirefighter}
              className={`w-full px-4 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 shadow-lg focus-ring ${tokens.transitions.fast}`}
            >
              <UserPlus size={16} />
              <span className="text-sm">Add Member</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
