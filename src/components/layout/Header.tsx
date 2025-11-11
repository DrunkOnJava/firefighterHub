import {
  Clock,
  HelpCircle,
  LogOut,
  Menu,
  Moon,
  Printer,
  Shield,
  Sun,
  UserPlus,
} from "lucide-react";
import { Shift } from "../lib/supabase";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  onToggleDarkMode: () => void;
}

export function Header({
  onShowHelp,
  onShowActivityLog,
  onQuickAddFirefighter,
  onNavigateToReports: _onNavigateToReports,
  onOpenMobileMenu,
  onShowLogin,
  onLogout,
  isAdminMode,
  currentShift,
  onShiftChange,
  onToggleDarkMode,
}: HeaderProps) {
  // Detect dark mode from DOM
  const isDarkMode = document.documentElement.classList.contains('dark');

  // TODO: AUDIT IMPROVEMENT - Real-time connection status indicator
  // Recommendation: Add visual indicator showing Supabase connection status
  // States: connected (green), connecting (yellow), disconnected (red)
  // Implementation: Lift connection status from useFirefightersRealtime to App.tsx,
  // pass as prop, and display as Badge near shift selector
  // See: AUDIT_REPORT_2025-11-09.md - Section 1 (Real-Time Subscription Reconnection)
  // const connectionStatus = 'connected' | 'connecting' | 'disconnected';
  return (
    <header
      className="h-16 sticky top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50"
    >
      <div className="px-4 sm:px-6 h-full flex items-center justify-between gap-6">
        {/* Logo & Title - LEFT SIDE */}
        <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex-shrink-0">
              <img
                src="/icon-192x192.png"
                alt="FirefighterHub Logo"
                className="w-10 h-10"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold whitespace-nowrap">
                FirefighterHub
              </h1>
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                Hold Rotation Manager
              </p>
            </div>
          </div>

          {/* Right-aligned Navigation Actions - RIGHT SIDE */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {/* Shift Selector + Action Buttons (Desktop) */}
            <div className="hidden sm:flex items-center gap-3 lg:gap-4">
              <div className="flex items-center gap-3 pr-6 mr-4">
                <Separator orientation="vertical" className="h-8 mr-4" />
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold hidden lg:inline text-muted-foreground">
                    Shift:
                  </span>
                  <ShiftSelector
                    currentShift={currentShift}
                    onShiftChange={onShiftChange}
                  />
                </div>
              </div>

              {/* Secondary Action Buttons Group */}
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() => window.print()}
                        className="gap-2"
                      >
                        <Printer className="h-4 w-4" />
                        <span className="hidden lg:inline">Print</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Print calendar</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="default"
                        onClick={onShowActivityLog}
                        className="gap-2"
                      >
                        <Clock className="h-4 w-4" />
                        <span className="hidden lg:inline">Activity</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View activity history</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Divider */}
              <Separator orientation="vertical" className="h-8" />

              {/* Primary Action Buttons Group */}
              <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      size="default"
                      onClick={onToggleDarkMode}
                      className="gap-2"
                    >
                      {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      <span className="hidden lg:inline">
                        {isDarkMode ? "Light" : "Dark"}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {isAdminMode ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="default"
                        onClick={onLogout}
                        className="gap-2 font-bold"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden xl:inline">BC Mode</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Leave Battalion Chief Mode</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="default"
                        onClick={onShowLogin}
                        className="gap-2 font-semibold text-destructive hover:text-destructive-foreground hover:bg-destructive"
                      >
                        <Shield className="h-4 w-4" />
                        <span className="hidden xl:inline">BC Mode</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Enter Battalion Chief Mode</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              </div>

              {/* Divider */}
              <Separator orientation="vertical" className="h-8" />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={onShowHelp}
                      className="gap-2"
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span className="hidden lg:inline">Help</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Show help and keyboard shortcuts</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Mobile Menu Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="sm:hidden"
                    onClick={onOpenMobileMenu}
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open menu</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

        {/* Mobile Add Button */}
        {isAdminMode && (
          <div className="sm:hidden flex items-center gap-2 mt-3 pt-3 border-t">
            <Button
              onClick={onQuickAddFirefighter}
              className="w-full min-h-[44px] gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg"
              size="default"
            >
              <UserPlus className="h-4 w-4" />
              <span className="text-sm">Add Member</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
