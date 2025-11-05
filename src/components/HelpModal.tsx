/**
 * HelpModal - Help Documentation Modal
 *
 * Modal displaying help content, instructions, and admin features.
 * Automatically switches between MaterialM and legacy styling based on feature flag.
 *
 * @example
 * ```tsx
 * <HelpModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   isAdminMode={isAdminMode}
 *   user={user}
 * />
 * ```
 */

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
import { useEffect } from "react";
import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { useAuth } from "../contexts/AuthContext";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { DialogM3 } from "./m3/DialogM3";
import { ButtonM3 } from "./m3/ButtonM3";
import { CardM3 } from "./m3/CardM3";
import { HelpModalLegacy } from "./HelpModalLegacy";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMasterReset: () => void;
  isAdminMode: boolean;
  onShowLogin: () => void;
  user: User | null;
}

/**
 * MaterialM Help Modal
 */
function HelpModalM3({
  isOpen,
  onClose,
  onMasterReset,
  isAdminMode,
  onShowLogin,
  user,
}: HelpModalProps) {
  const { signOut } = useAuth();
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
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <DialogM3 show={isOpen} onClose={onClose} size="xl">
      {/* Custom Header */}
      <div
        ref={trapRef}
        className="p-6 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            How to Use Hold List Manager
          </h2>
        </div>
      </div>

      <DialogM3.Body>
        <div className="space-y-6">
          {/* Calendar Management */}
          <CardM3 elevation={1}>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Calendar Management
              </h3>
            </div>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                <span>
                  <strong>Schedule holds:</strong> Click any future date on the calendar to assign a firefighter
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                <span>
                  <strong>View details:</strong> Click on scheduled holds to view or modify them
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                <span>
                  <strong>Navigate months:</strong> Use arrow buttons or "Today" button to navigate
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                <span>
                  <strong>Color coding:</strong> Blue = scheduled, Gray = completed, Ring = today
                </span>
              </li>
            </ul>
          </CardM3>

          {/* Firefighter Management */}
          <CardM3 elevation={1}>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Firefighter Management
              </h3>
            </div>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Add firefighters:</strong> Click "Add Team Member" button and enter name and station
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Rotation order:</strong> Firefighters automatically rotate based on their position
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Next in line:</strong> The next firefighter is highlighted with "NEXT FOR HOLD" badge
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                <span>
                  <strong>On/Off duty:</strong> Toggle availability status - off-duty members skip rotation
                </span>
              </li>
            </ul>
          </CardM3>

          {/* Completing Holds */}
          <CardM3 elevation={1}>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Completing Holds
              </h3>
            </div>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                <span>
                  <strong>Complete hold:</strong> Click "Complete Hold" button on firefighter card
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                <span>
                  <strong>Auto-update:</strong> Calendar and scheduled holds update automatically
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                <span>
                  <strong>Rotation:</strong> Firefighter moves to bottom of rotation after completing hold
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                <span>
                  <strong>History:</strong> Last hold date is tracked for each firefighter
                </span>
              </li>
            </ul>
          </CardM3>

          {/* Sidebar Features */}
          <CardM3 elevation={1}>
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Sidebar Features
              </h3>
            </div>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">•</span>
                <span>
                  <strong>Overview:</strong> See total, on-duty, and off-duty firefighter counts
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">•</span>
                <span>
                  <strong>Upcoming holds:</strong> View next 7 scheduled holds at a glance
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">•</span>
                <span>
                  <strong>Rotation order:</strong> See who's next in line for holds
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">•</span>
                <span>
                  <strong>Real-time sync:</strong> All updates happen instantly across the app
                </span>
              </li>
            </ul>
          </CardM3>

          {/* Pro Tips */}
          <CardM3 className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Pro Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• The system automatically maintains fair rotation by tracking each firefighter's position</li>
              <li>• Hold dates can't be double-booked - only one firefighter per day</li>
              <li>• All changes sync in real-time using Supabase database</li>
              <li>• Activity log tracks all actions for accountability</li>
            </ul>
          </CardM3>

          {/* Battalion Chief Authentication */}
          <CardM3
            elevation={1}
            className={user ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700" : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"}
          >
            <div className="flex items-center gap-3 mb-3">
              {user ? (
                <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              )}
              <h3 className={`text-lg font-bold ${user ? "text-emerald-700 dark:text-emerald-300" : "text-blue-700 dark:text-blue-300"}`}>
                {user ? "Battalion Chief Mode" : "Battalion Chief Login"}
              </h3>
            </div>

            {user ? (
              <>
                <div className="bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
                    Logged in as:
                  </p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  You have full admin access to assign holds, manage the roster, and override rotation.
                </p>
                <ButtonM3
                  variant="outlined"
                  color="neutral"
                  fullWidth
                  startIcon={<LogOut size={20} />}
                  onClick={async () => {
                    await signOut();
                    onClose();
                  }}
                >
                  Sign Out
                </ButtonM3>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Battalion chiefs can log in to access admin features: assign holds, manage roster, override rotation, and track metrics.
                </p>
                <ButtonM3
                  color="primary"
                  fullWidth
                  startIcon={<LogIn size={20} />}
                  onClick={() => {
                    onShowLogin();
                    onClose();
                  }}
                  className="shadow-materialm-2"
                >
                  Battalion Chief Login
                </ButtonM3>
              </>
            )}
          </CardM3>

          {/* Danger Zone */}
          {isAdminMode && (
            <CardM3 className="bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700">
              <div className="flex items-center gap-3 mb-3">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                <h3 className="text-lg font-bold text-red-700 dark:text-red-300">
                  Danger Zone
                </h3>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                Use this button to completely reset the system and start fresh. This will permanently delete all firefighters, holds, and history from all shifts.
              </p>
              <ButtonM3
                color="error"
                fullWidth
                startIcon={<Trash2 size={20} />}
                onClick={() => {
                  onMasterReset();
                  onClose();
                }}
              >
                Master Reset - Delete Everything
              </ButtonM3>
            </CardM3>
          )}
        </div>
      </DialogM3.Body>

      <DialogM3.Footer align="center">
        <ButtonM3 color="primary" onClick={onClose} fullWidth>
          Got It!
        </ButtonM3>
      </DialogM3.Footer>
    </DialogM3>
  );
}

/**
 * Help Modal Component with Feature Flag
 *
 * Switches between MaterialM and legacy versions.
 */
export function HelpModal(props: HelpModalProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <HelpModalLegacy {...props} />;
  }

  return <HelpModalM3 {...props} />;
}
