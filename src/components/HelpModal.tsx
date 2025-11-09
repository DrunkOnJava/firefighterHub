import type { User } from "@supabase/supabase-js";
import {
  Calendar,
  CheckCircle,
  Lock,
  LogIn,
  LogOut,
  Shield,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMasterReset: () => void;
  isAdminMode: boolean;
  onShowLogin: () => void;
  user: User | null;
}

export function HelpModal({
  isOpen,
  onClose,
  onMasterReset,
  isAdminMode,
  onShowLogin,
  user,
}: HelpModalProps) {
  const { signOut } = useAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="sticky top-0 bg-card border-b-2 p-6 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
              <Calendar className="text-white" size={24} />
            </div>
            <DialogTitle className="text-2xl font-bold">
              How to Use Hold List Manager
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6 pb-4">
            {/* Calendar Management Section */}
            <section className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
                <h3 className="text-lg font-semibold">
                  Calendar Management
                </h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>
                    <strong className="text-foreground">Schedule holds:</strong> Click any future date on the calendar to assign a firefighter
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>
                    <strong className="text-foreground">View details:</strong> Click on scheduled holds to view or modify them
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>
                    <strong className="text-foreground">Navigate months:</strong> Use arrow buttons or "Today" button to navigate
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>
                    <strong className="text-foreground">Color coding:</strong> Blue = scheduled, Green = completed, Ring = today
                  </span>
                </li>
              </ul>
            </section>

            {/* Firefighter Management Section */}
            <section className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-green-600 dark:text-green-400" size={24} />
                <h3 className="text-lg font-semibold">
                  Firefighter Management
                </h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                  <span>
                    <strong className="text-foreground">Add firefighters:</strong> Click "Add Team Member" button and enter name and station
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                  <span>
                    <strong className="text-foreground">Rotation order:</strong> Firefighters automatically rotate based on their position
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                  <span>
                    <strong className="text-foreground">Next in line:</strong> The next firefighter is highlighted with "NEXT FOR HOLD" badge
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                  <span>
                    <strong className="text-foreground">On/Off duty:</strong> Toggle availability status - off-duty members skip rotation
                  </span>
                </li>
              </ul>
            </section>

            {/* Completing Holds Section */}
            <section className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-yellow-600 dark:text-yellow-400" size={24} />
                <h3 className="text-lg font-semibold">
                  Completing Holds
                </h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold">•</span>
                  <span>
                    <strong className="text-foreground">Complete hold:</strong> Click "Complete Hold" button on firefighter card
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold">•</span>
                  <span>
                    <strong className="text-foreground">Auto-update:</strong> Calendar and scheduled holds update automatically
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold">•</span>
                  <span>
                    <strong className="text-foreground">Rotation:</strong> Firefighter moves to bottom of rotation after completing hold
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold">•</span>
                  <span>
                    <strong className="text-foreground">History:</strong> Last hold date is tracked for each firefighter
                  </span>
                </li>
              </ul>
            </section>

            {/* Sidebar Features Section */}
            <section className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
                <h3 className="text-lg font-semibold">
                  Sidebar Features
                </h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                  <span>
                    <strong className="text-foreground">Overview:</strong> See total, on-duty, and off-duty firefighter counts
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                  <span>
                    <strong className="text-foreground">Upcoming holds:</strong> View next 7 scheduled holds at a glance
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                  <span>
                    <strong className="text-foreground">Rotation order:</strong> See who's next in line for holds
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                  <span>
                    <strong className="text-foreground">Real-time sync:</strong> All updates happen instantly across the app
                  </span>
                </li>
              </ul>
            </section>

            {/* Pro Tips */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-base font-semibold mb-3">
                Pro Tips
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • The system automatically maintains fair rotation by tracking each firefighter's position
                </li>
                <li>
                  • Hold dates can't be double-booked - only one firefighter per day
                </li>
                <li>• All changes sync in real-time using Supabase database</li>
                <li>• Activity log tracks all actions for accountability</li>
              </ul>
            </div>

            {/* Battalion Chief Authentication */}
            <div
              className={`border-2 rounded-lg p-6 ${
                user
                  ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                  : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {user ? (
                  <Shield className="text-green-600 dark:text-green-400" size={24} />
                ) : (
                  <Lock className="text-blue-600 dark:text-blue-400" size={24} />
                )}
                <h3 className={`text-base font-semibold ${
                  user
                    ? "text-green-700 dark:text-green-300"
                    : "text-blue-700 dark:text-blue-300"
                }`}>
                  {user ? "Battalion Chief Mode" : "Battalion Chief Login"}
                </h3>
              </div>

              {user ? (
                <>
                  <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-3 mb-4">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-1">
                      Logged in as:
                    </p>
                    <p className="font-mono text-sm text-foreground">
                      {user.email}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    You have full admin access to assign holds, manage the roster, and override rotation.
                  </p>
                  <Button
                    onClick={async () => {
                      await signOut();
                      onClose();
                    }}
                    variant="secondary"
                    className="w-full"
                  >
                    <LogOut className="mr-2" size={20} />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    Battalion chiefs can log in to access admin features: assign holds, manage roster, override rotation, and track metrics.
                  </p>
                  <Button
                    onClick={() => {
                      onShowLogin();
                      onClose();
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    <LogIn className="mr-2" size={20} />
                    Battalion Chief Login
                  </Button>
                </>
              )}
            </div>

            {/* Danger Zone */}
            {isAdminMode && (
              <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Trash2 className="text-red-600 dark:text-red-400" size={24} />
                  <h3 className="text-base font-semibold text-red-700 dark:text-red-300">
                    Danger Zone
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Use this button to completely reset the system and start fresh. This will permanently delete all firefighters, holds, and history from all shifts.
                </p>
                <Button
                  onClick={() => {
                    onMasterReset();
                    onClose();
                  }}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="mr-2" size={20} />
                  Master Reset - Delete Everything
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t-2 p-6">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          >
            Got It!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
