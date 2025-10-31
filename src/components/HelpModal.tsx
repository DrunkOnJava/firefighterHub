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
  X,
} from "lucide-react";
import { useEffect } from "react";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useAuth } from "../contexts/AuthContext";
import type { User } from '@supabase/supabase-js';

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
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        ref={trapRef}
        className="bg-gradient-to-br from-gray-800 to-gray-850 border-2 border-gray-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b-2 border-gray-700 p-6 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
              <Calendar className="text-white" size={24} />
            </div>
            <h2 id="help-modal-title" className="text-2xl font-bold text-white">
              How to Use Hold List Manager
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors focus-ring"
            aria-label="Close help dialog"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="space-y-6 pb-8">
            <section className="bg-gray-900/50 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="text-blue-400" size={24} />
                <h3 className="text-xl font-bold text-white">
                  Calendar Management
                </h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>
                    <strong>Schedule holds:</strong> Click any future date on
                    the calendar to assign a firefighter
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>
                    <strong>View details:</strong> Click on scheduled holds to
                    view or modify them
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>
                    <strong>Navigate months:</strong> Use arrow buttons or
                    "Today" button to navigate
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>
                    <strong>Color coding:</strong> Blue = scheduled, Green =
                    completed, Ring = today
                  </span>
                </li>
              </ul>
            </section>

            <section className="bg-gray-900/50 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-green-400" size={24} />
                <h3 className="text-xl font-bold text-white">
                  Firefighter Management
                </h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">•</span>
                  <span>
                    <strong>Add firefighters:</strong> Click "Add Team Member"
                    button and enter name and station
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">•</span>
                  <span>
                    <strong>Rotation order:</strong> Firefighters automatically
                    rotate based on their position
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">•</span>
                  <span>
                    <strong>Next in line:</strong> The next firefighter is
                    highlighted with "NEXT FOR HOLD" badge
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">•</span>
                  <span>
                    <strong>On/Off duty:</strong> Toggle availability status -
                    off-duty members skip rotation
                  </span>
                </li>
              </ul>
            </section>

            <section className="bg-gray-900/50 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-orange-400" size={24} />
                <h3 className="text-xl font-bold text-white">
                  Completing Holds
                </h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>
                    <strong>Complete hold:</strong> Click "Complete Hold" button
                    on firefighter card
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>
                    <strong>Auto-update:</strong> Calendar and scheduled holds
                    update automatically
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>
                    <strong>Rotation:</strong> Firefighter moves to bottom of
                    rotation after completing hold
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>
                    <strong>History:</strong> Last hold date is tracked for each
                    firefighter
                  </span>
                </li>
              </ul>
            </section>

            <section className="bg-gray-900/50 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-purple-400" size={24} />
                <h3 className="text-xl font-bold text-white">
                  Sidebar Features
                </h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>
                    <strong>Overview:</strong> See total, on-duty, and off-duty
                    firefighter counts
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>
                    <strong>Upcoming holds:</strong> View next 7 scheduled holds
                    at a glance
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>
                    <strong>Rotation order:</strong> See who's next in line for
                    holds
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>
                    <strong>Real-time sync:</strong> All updates happen
                    instantly across the app
                  </span>
                </li>
              </ul>
            </section>

            <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-5">
              <h3 className="text-lg font-bold text-white mb-3">Pro Tips</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  • The system automatically maintains fair rotation by tracking
                  each firefighter's position
                </li>
                <li>
                  • Hold dates can't be double-booked - only one firefighter per
                  day
                </li>
                <li>• All changes sync in real-time using Supabase database</li>
                <li>• Activity log tracks all actions for accountability</li>
              </ul>
            </div>

            {/* Battalion Chief Authentication */}
            <div className={`border-2 rounded-xl p-5 ${
              user
                ? "bg-emerald-900/20 border-emerald-700"
                : "bg-blue-900/20 border-blue-700"
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {user ? (
                  <Shield className="text-emerald-400" size={24} />
                ) : (
                  <Lock className="text-blue-400" size={24} />
                )}
                <h3 className={`text-lg font-bold ${
                  user ? "text-emerald-300" : "text-blue-300"
                }`}>
                  {user ? "Battalion Chief Mode" : "Battalion Chief Login"}
                </h3>
              </div>

              {user ? (
                <>
                  <div className="bg-emerald-950/30 border border-emerald-800 rounded-lg p-3 mb-4">
                    <p className="text-emerald-200 text-sm font-semibold mb-1">
                      Logged in as:
                    </p>
                    <p className="text-white font-mono text-sm">
                      {user.email}
                    </p>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    You have full admin access to assign holds, manage the roster, and override rotation.
                  </p>
                  <button
                    onClick={async () => {
                      await signOut();
                      onClose();
                    }}
                    className="w-full bg-gray-700 hover:bg-gray-600 border-2 border-gray-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 focus-ring"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-300 text-sm mb-4">
                    Battalion chiefs can log in to access admin features: assign holds, manage roster, override rotation, and track metrics.
                  </p>
                  <button
                    onClick={() => {
                      onShowLogin();
                      onClose();
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 border-2 border-blue-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 focus-ring"
                  >
                    <LogIn size={20} />
                    Battalion Chief Login
                  </button>
                </>
              )}
            </div>

            {isAdminMode && (
              <div className="bg-red-900/20 border-2 border-red-700 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Trash2 className="text-red-400" size={24} />
                  <h3 className="text-lg font-bold text-red-300">
                    Danger Zone
                  </h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Use this button to completely reset the system and start
                  fresh. This will permanently delete all firefighters, holds,
                  and history from all shifts.
                </p>
                <button
                  onClick={() => {
                    onMasterReset();
                    onClose();
                  }}
                  className="w-full bg-red-900/50 hover:bg-red-800/70 border-2 border-red-600 text-red-200 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={20} />
                  Master Reset - Delete Everything
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-t-2 border-gray-700 p-5 sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors focus-ring"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}
