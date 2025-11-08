import {
  Clock,
  HelpCircle,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Printer,
  Sun,
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
  onNavigateToReports: () => void;
  onOpenMobileMenu: () => void;
  onShowLogin: () => void;
  onLogout: () => void;
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
  onNavigateToReports,
  onOpenMobileMenu,
  onShowLogin,
  onLogout,
  isAdminMode,
  currentShift,
  onShiftChange,
  isDarkMode = true,
  onToggleDarkMode,
}: HeaderProps) {
  return (
    <header
      className={`
        border-b-2 backdrop-blur-md sticky top-0
        ${tokens.zIndex.sticky}
        ${tokens.shadows.xl}
        ${
          isDarkMode
            ? `${colors.structural.border.emphasis} bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950`
            : "border-slate-300 bg-gradient-to-r from-white via-gray-50 to-white"
        }
      `}
    >
      <div className={`px-4 sm:px-6 py-3 flex items-center justify-between w-full gap-4`}>
        {/* Logo & Title - LEFT SIDE */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-shrink leading-tight">
            <div className="flex-shrink-0 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
              <img
                src="/icon-192x192.png"
                alt="FirefighterHub Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 relative z-10 drop-shadow-xl"
              />
            </div>
            <div className="min-w-0">
              <h1
                className={`
                  text-xl sm:text-2xl lg:text-3xl font-black truncate
                  bg-gradient-to-r from-orange-500 via-red-600 to-orange-600 bg-clip-text text-transparent
                  drop-shadow-sm
                `}
              >
                FirefighterHub
              </h1>
              <p
                className={`
                  text-xs sm:text-sm font-semibold
                  mt-0.5 hidden sm:block
                  ${
                    isDarkMode
                      ? 'text-slate-400'
                      : "text-slate-600"
                  }
                `}
              >
                Hold Rotation Manager
              </p>
            </div>
          </div>

          {/* Right-aligned Navigation Actions - RIGHT SIDE */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Shift Selector + Action Buttons (Desktop) */}
            <div className="hidden sm:flex items-center gap-2 lg:gap-3">
              <div className={`flex items-center gap-2 pr-3 mr-2 border-r-2 ${
                isDarkMode ? "border-slate-700/50" : "border-slate-300"
              }`}>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold hidden lg:inline uppercase tracking-wider ${
                      isDarkMode ? "text-slate-500" : "text-slate-600"
                    }`}
                  >
                    Shift:
                  </span>
                  <ShiftSelector
                    currentShift={currentShift}
                    onShiftChange={onShiftChange}
                  />
                </div>
              </div>

              {/* Action Buttons - Modern Icon Pills */}
              <button
                onClick={() => window.print()}
                className={`px-3 py-2 rounded-lg transition-all focus-ring flex items-center gap-2 font-semibold text-sm border-2 ${
                  isDarkMode
                    ? "bg-slate-800/80 hover:bg-slate-700 border-slate-700/50 hover:border-slate-600 text-slate-300 hover:text-white shadow-lg hover:shadow-xl"
                    : "bg-white hover:bg-slate-50 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 shadow-md hover:shadow-lg"
                }`}
                aria-label="Print calendar"
              >
                <Printer size={16} />
                <span className="hidden lg:inline">Print</span>
              </button>
              <button
                onClick={onShowActivityLog}
                className={`px-3 py-2 ${tokens.touchTarget.min} rounded-lg transition-all focus-ring flex items-center gap-2 font-semibold text-sm border-2 ${
                  isDarkMode
                    ? "bg-slate-800/80 hover:bg-slate-700 border-slate-700/50 hover:border-slate-600 text-slate-300 hover:text-white shadow-lg hover:shadow-xl"
                    : "bg-white hover:bg-slate-50 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 shadow-md hover:shadow-lg"
                }`}
                aria-label="View activity history"
              >
                <Clock size={16} />
                <span className="hidden lg:inline">Activity</span>
              </button>
              <button
                onClick={onToggleDarkMode}
                className={`px-3 py-2 ${tokens.touchTarget.min} rounded-lg transition-all focus-ring flex items-center gap-2 font-semibold text-sm border-2 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 border-amber-500/30 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40"
                    : "bg-gradient-to-br from-indigo-600 to-blue-700 hover:from-indigo-500 hover:to-blue-600 border-indigo-600/30 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                }`}
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                <span className="hidden lg:inline">
                  {isDarkMode ? "Light" : "Dark"}
                </span>
              </button>
              {isAdminMode ? (
                <button
                  onClick={onLogout}
                  className={`px-3 py-2 ${tokens.touchTarget.min} rounded-lg transition-all focus-ring flex items-center gap-2 font-bold text-sm border-2 bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 border-orange-500/30 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50`}
                  aria-label="Leave Battalion Chief Mode"
                  title="Leave Battalion Chief Mode"
                >
                  <LogOut size={16} />
                  <span className="hidden xl:inline leading-tight">BC Mode</span>
                </button>
              ) : (
                <button
                  onClick={onShowLogin}
                  className={`px-3 py-2 ${tokens.touchTarget.min} rounded-lg transition-all focus-ring flex items-center gap-2 font-bold text-sm border-2 ${
                    isDarkMode
                      ? "bg-slate-800/80 hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-600 border-slate-700/50 hover:border-orange-500/30 text-orange-400 hover:text-white shadow-lg hover:shadow-xl hover:shadow-orange-500/30"
                      : "bg-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-600 border-slate-300 hover:border-orange-500/30 text-orange-600 hover:text-white shadow-md hover:shadow-lg hover:shadow-orange-500/30"
                  }`}
                  aria-label="Enter Battalion Chief Mode"
                  title="Enter Battalion Chief Mode"
                >
                  <LogIn size={16} />
                  <span className="hidden xl:inline leading-tight">BC Mode</span>
                </button>
              )}
              <button
                onClick={onShowHelp}
                className={`px-3 py-2 ${tokens.touchTarget.min} rounded-lg transition-all focus-ring flex items-center gap-2 font-semibold text-sm border-2 ${
                  isDarkMode
                    ? "bg-slate-800/80 hover:bg-slate-700 border-slate-700/50 hover:border-slate-600 text-slate-300 hover:text-white shadow-lg hover:shadow-xl"
                    : "bg-white hover:bg-slate-50 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 shadow-md hover:shadow-lg"
                }`}
                aria-label="Show help"
              >
                <HelpCircle size={16} />
                <span className="hidden lg:inline">Help</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={onOpenMobileMenu}
              className={`sm:hidden p-2 ${tokens.touchTarget.min} rounded-lg transition-colors focus-ring ${
                isDarkMode
                  ? "hover:bg-gray-800 text-gray-300"
                  : "hover:bg-slate-200 text-slate-600"
              }`}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>

        {/* Mobile Add Button */}
        {isAdminMode && (
          <div className="sm:hidden flex items-center gap-2 mt-3 pt-3 border-t">
            <button
              onClick={onQuickAddFirefighter}
              className={`w-full px-4 py-2 ${tokens.touchTarget.min} rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 shadow-lg focus-ring`}
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
