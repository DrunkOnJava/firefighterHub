import {
  Clock,
  HelpCircle,
  Lightbulb,
  LogIn,
  LogOut,
  Sun,
  UserPlus,
} from "lucide-react";
import { Shift } from "../lib/supabase";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-80 max-w-[85vw]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          {isAdminMode && (
            <div className="flex items-center gap-1.5">
              <LogOut size={12} className="text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                BATTALION CHIEF MODE
              </span>
            </div>
          )}
          <SheetDescription className="sr-only">
            Navigation menu for mobile devices
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Context Section */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-muted-foreground">
              Current Context
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold mb-2 block text-muted-foreground">
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
              <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-muted-foreground">
                Quick Actions
              </h3>
              <Button
                onClick={() => {
                  onQuickAddFirefighter();
                  onClose();
                }}
                className="w-full min-h-[56px] bg-green-600 hover:bg-green-700 text-white shadow-lg gap-2"
                size="lg"
              >
                <UserPlus className="h-5 w-5" />
                Add Team Member
              </Button>
            </section>
          )}

          {/* Secondary Actions */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-muted-foreground">
              Tools
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => {
                  onShowActivityLog();
                  onClose();
                }}
                className="w-full justify-start gap-3 h-auto py-4 px-4"
              >
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div className="text-left flex-1">
                  <div className="font-semibold">Activity History</div>
                  <div className="text-sm text-muted-foreground">
                    View recent actions
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  onShowHelp();
                  onClose();
                }}
                className="w-full justify-start gap-3 h-auto py-4 px-4"
              >
                <HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <div className="text-left flex-1">
                  <div className="font-semibold">Help & Guide</div>
                  <div className="text-sm text-muted-foreground">
                    Learn about features
                  </div>
                </div>
              </Button>
            </div>
          </section>

          <Separator />

          {/* Settings */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-muted-foreground">
              Preferences
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={onToggleDarkMode}
                className="w-full justify-between h-auto py-4 px-4"
              >
                <div className="flex items-center gap-3">
                  <Sun className="h-5 w-5 text-amber-400" />
                  <div className="text-left">
                    <div className="font-semibold">Theme</div>
                    <div className="text-sm text-muted-foreground">
                      Dark mode
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  Toggle
                </span>
              </Button>

              {isAdminMode ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full justify-between h-auto py-4 px-4 border-orange-600 dark:border-orange-500"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <div className="text-left">
                      <div className="font-semibold">Battalion Chief Mode</div>
                      <div className="text-sm text-muted-foreground">
                        Active - Click to leave
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                    Leave
                  </span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    onShowLogin();
                    onClose();
                  }}
                  className="w-full justify-between h-auto py-4 px-4 border-orange-600 dark:border-orange-500"
                >
                  <div className="flex items-center gap-3">
                    <LogIn className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <div className="text-left">
                      <div className="font-semibold">Battalion Chief Mode</div>
                      <div className="text-sm text-muted-foreground">
                        Enable admin features
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                    Enter
                  </span>
                </Button>
              )}
            </div>
          </section>

          {/* Info Section */}
          {!isAdminMode && (
            <>
              <Separator />
              <section>
                <div className="rounded-lg border border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Quick Tip
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enable Admin mode to add firefighters and schedule holds.
                  </p>
                </div>
              </section>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
