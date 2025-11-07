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
  X,
} from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { colors, tokens } from "../styles";
import { IconButton } from "./ui/IconButton";

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
      className={`fixed inset-0 ${colors.components.modal.overlay} z-50 flex items-center justify-center ${tokens.spacing.card.md} animate-fade-in`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        ref={trapRef}
        className={`${colors.components.modal.background} ${colors.components.modal.border} ${tokens.borders.radius['2xl']} max-w-3xl w-full max-h-[90vh] overflow-hidden ${colors.components.modal.shadow} animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`${colors.structural.bg.surface} border-b-2 ${colors.structural.border.default} ${tokens.spacing.card.lg} flex items-center justify-between sticky top-0`}
        >
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            <div
              className={`${colors.semantic.scheduled.gradient} ${tokens.spacing.card.sm} ${tokens.borders.radius.lg}`}
            >
              <Calendar className="text-white" size={24} />
            </div>
            <h2
              id="help-modal-title"
              className={`${tokens.typography.heading.h2} ${colors.structural.text.primary}`}
            >
              How to Use Hold List Manager
            </h2>
          </div>
          <IconButton
            icon={X}
            label="Close help dialog"
            onClick={onClose}
            variant="default"
            size="md"
            isDarkMode={true}
          />
        </div>

        <div
          className={`${tokens.spacing.card.lg} overflow-y-auto max-h-[calc(90vh-100px)]`}
        >
          <div className="space-y-6 pb-8">
            <section
              className={`${colors.structural.bg.surface} ${colors.structural.border.default} border ${tokens.borders.radius.lg} ${tokens.spacing.section.lg}`}
            >
              <div
                className={`flex items-center ${tokens.spacing.gap.md} mb-4`}
              >
                <Calendar
                  className={colors.semantic.scheduled.text}
                  size={24}
                />
                <h3
                  className={`${tokens.typography.heading.h3} ${colors.structural.text.primary}`}
                >
                  Calendar Management
                </h3>
              </div>
              <ul className={`space-y-3 ${colors.structural.text.secondary}`}>
                <li className={`flex ${tokens.spacing.gap.md}`}>
                  <span
                    className={`${colors.semantic.scheduled.text} font-bold`}
                  >
                    •
                  </span>
                  <span>
                    <strong>Schedule holds:</strong> Click any future date on
                    the calendar to assign a firefighter
                  </span>
                </li>
                <li className={`flex ${tokens.spacing.gap.md}`}>
                  <span
                    className={`${colors.semantic.scheduled.text} font-bold`}
                  >
                    •
                  </span>
                  <span>
                    <strong>View details:</strong> Click on scheduled holds to
                    view or modify them
                  </span>
                </li>
                <li className={`flex ${tokens.spacing.gap.md}`}>
                  <span
                    className={`${colors.semantic.scheduled.text} font-bold`}
                  >
                    •
                  </span>
                  <span>
                    <strong>Navigate months:</strong> Use arrow buttons or
                    "Today" button to navigate
                  </span>
                </li>
                <li className={`flex ${tokens.spacing.gap.md}`}>
                  <span
                    className={`${colors.semantic.scheduled.text} font-bold`}
                  >
                    •
                  </span>
                  <span>
                    <strong>Color coding:</strong> Blue = scheduled, Green =
                    completed, Ring = today
                  </span>
                </li>
              </ul>
            </section>

            <section
              className={`${colors.structural.bg.surface} ${colors.structural.border.default} border ${tokens.borders.radius.lg} ${tokens.spacing.section.lg}`}
            >
              <div
                className={`flex items-center ${tokens.spacing.gap.md} mb-4`}
              >
                <Users className={colors.semantic.success.text} size={24} />
                <h3
                  className={`${tokens.typography.heading.h3} ${colors.structural.text.primary}`}
                >
                  Firefighter Management
                </h3>
              </div>
              <ul className={`space-y-3 ${colors.structural.text.secondary}`}>
                <li className={`flex ${tokens.spacing.gap.md}`}>
                  <span className={`${colors.semantic.success.text} font-bold`}>
                    •
                  </span>
                  <span>
                    <strong>Add firefighters:</strong> Click "Add Team Member"
                    button and enter name and station
                  </span>
                </li>
                <li className={`flex ${tokens.spacing.gap.md}`}>
                  <span className={`${colors.semantic.success.text} font-bold`}>
                    •
                  </span>
                  <span>
                    <strong>Rotation order:</strong> Firefighters automatically
                    rotate based on their position
                  </span>
                </li>
                <li className={`flex ${tokens.spacing.gap.md}`}>
                  <span className={`${colors.semantic.success.text} font-bold`}>
                    •
                  </span>
                  <span>
                    <strong>Next in line:</strong> The next firefighter is
                    highlighted with "NEXT FOR HOLD" badge
                  </span>
                </li>
                <li className={`flex ${tokens.spacing.gap.md}`}>
                  <span className={`${colors.semantic.success.text} font-bold`}>
                    •
                  </span>
                  <span>
                    <strong>On/Off duty:</strong> Toggle availability status -
                    off-duty members skip rotation
                  </span>
                </li>
              </ul>
            </section>

            <section
              className={`${colors.structural.bg.surface} ${colors.structural.border.default} border ${tokens.borders.radius.lg} ${tokens.spacing.section.lg}`}
            >
              <div
                className={`flex items-center ${tokens.spacing.gap.md} mb-4`}
              >
                <CheckCircle
                  className={colors.semantic.warning.text}
                  size={24}
                />
                <h3
                  className={`${tokens.typography.heading.h3} ${colors.structural.text.primary}`}
                >
                  Completing Holds
                </h3>
              </div>
              <ul className={`space-y-3 ${colors.structural.text.secondary}`}>
                <li className={`flex ${tokens.spacing.gap.md}`}>
                  <span className={`${colors.semantic.warning.text} font-bold`}>
                    •
                  </span>
                  <span>
                    <strong>Complete hold:</strong> Click "Complete Hold" button
                    on firefighter card
                  </span>
                </li>
                <li className={`flex ${tokens.spacing.gap.md}`}>
                  <span className={`${colors.semantic.warning.text} font-bold`}>
                    •
                  </span>
                  <span>
                    <strong>Auto-update:</strong> Calendar and scheduled holds
                    update automatically
                  </span>
                </li>
                <li className={`flex ${tokens.spacing.gap.md}`}>
                  <span className={`${colors.semantic.warning.text} font-bold`}>
                    •
                  </span>
                  <span>
                    <strong>Rotation:</strong> Firefighter moves to bottom of
                    rotation after completing hold
                  </span>
                </li>
                <li className={`flex ${tokens.spacing.gap.md}`}>
                  <span className={`${colors.semantic.warning.text} font-bold`}>
                    •
                  </span>
                  <span>
                    <strong>History:</strong> Last hold date is tracked for each
                    firefighter
                  </span>
                </li>
              </ul>
            </section>

            <section
              className={`${colors.structural.bg.surface} ${colors.structural.border.default} border ${tokens.borders.radius.lg} ${tokens.spacing.section.lg}`}
            >
              <div
                className={`flex items-center ${tokens.spacing.gap.md} mb-4`}
              >
                <TrendingUp className={colors.semantic.info.text} size={24} />
                <h3
                  className={`${tokens.typography.heading.h3} ${colors.structural.text.primary}`}
                >
                  Sidebar Features
                </h3>
              </div>
              <ul className={`space-y-3 ${colors.structural.text.secondary}`}>
                <li className={`flex ${tokens.spacing.gap.md}`}>
                  <span className={`${colors.semantic.info.text} font-bold`}>
                    •
                  </span>
                  <span>
                    <strong>Overview:</strong> See total, on-duty, and off-duty
                    firefighter counts
                  </span>
                </li>
                <li className={`flex ${tokens.spacing.gap.md}`}>
                  <span className={`${colors.semantic.info.text} font-bold`}>
                    •
                  </span>
                  <span>
                    <strong>Upcoming holds:</strong> View next 7 scheduled holds
                    at a glance
                  </span>
                </li>
                <li className={`flex ${tokens.spacing.gap.md}`}>
                  <span className={`${colors.semantic.info.text} font-bold`}>
                    •
                  </span>
                  <span>
                    <strong>Rotation order:</strong> See who's next in line for
                    holds
                  </span>
                </li>
                <li className={`flex ${tokens.spacing.gap.md}`}>
                  <span className={`${colors.semantic.info.text} font-bold`}>
                    •
                  </span>
                  <span>
                    <strong>Real-time sync:</strong> All updates happen
                    instantly across the app
                  </span>
                </li>
              </ul>
            </section>

            <div
              className={`${colors.semantic.scheduled.light} ${colors.semantic.scheduled.border} border ${tokens.borders.radius.lg} ${tokens.spacing.section.lg}`}
            >
              <h3
                className={`${tokens.typography.heading.h4} ${colors.structural.text.primary} mb-3`}
              >
                Pro Tips
              </h3>
              <ul
                className={`space-y-2 ${colors.structural.text.secondary} ${tokens.typography.body.secondary}`}
              >
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
            <div
              className={`border-2 ${tokens.borders.radius.lg} ${
                tokens.spacing.section.lg
              } ${
                user
                  ? `${colors.semantic.success.light} ${colors.semantic.success.border}`
                  : `${colors.semantic.scheduled.light} ${colors.semantic.scheduled.border}`
              }`}
            >
              <div
                className={`flex items-center ${tokens.spacing.gap.md} mb-3`}
              >
                {user ? (
                  <Shield className={colors.semantic.success.text} size={24} />
                ) : (
                  <Lock className={colors.semantic.scheduled.text} size={24} />
                )}
                <h3
                  className={`${tokens.typography.heading.h4} ${
                    user
                      ? colors.semantic.success.text
                      : colors.semantic.scheduled.text
                  }`}
                >
                  {user ? "Battalion Chief Mode" : "Battalion Chief Login"}
                </h3>
              </div>

              {user ? (
                <>
                  <div
                    className={`${colors.semantic.success.light} ${colors.semantic.success.border} border ${tokens.borders.radius.md} ${tokens.spacing.card.sm} mb-4`}
                  >
                    <p
                      className={`${colors.semantic.success.text} ${tokens.typography.body.secondary} font-semibold mb-1`}
                    >
                      Logged in as:
                    </p>
                    <p
                      className={`${colors.structural.text.primary} font-mono ${tokens.typography.body.secondary}`}
                    >
                      {user.email}
                    </p>
                  </div>
                  <p
                    className={`${colors.structural.text.secondary} ${tokens.typography.body.secondary} mb-4`}
                  >
                    You have full admin access to assign holds, manage the
                    roster, and override rotation.
                  </p>
                  <button
                    onClick={async () => {
                      await signOut();
                      onClose();
                    }}
                    className={`w-full ${colors.components.button.secondary} font-bold py-3 ${tokens.borders.radius.md} flex items-center justify-center ${tokens.spacing.gap.sm} focus-ring`}
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <p
                    className={`${colors.structural.text.secondary} ${tokens.typography.body.secondary} mb-4`}
                  >
                    Battalion chiefs can log in to access admin features: assign
                    holds, manage roster, override rotation, and track metrics.
                  </p>
                  <button
                    onClick={() => {
                      onShowLogin();
                      onClose();
                    }}
                    className={`w-full ${colors.semantic.scheduled.gradient} ${colors.semantic.scheduled.hover} text-white font-bold py-3 ${tokens.borders.radius.md} transition-colors flex items-center justify-center ${tokens.spacing.gap.sm} focus-ring`}
                  >
                    <LogIn size={20} />
                    Battalion Chief Login
                  </button>
                </>
              )}
            </div>

            {isAdminMode && (
              <div
                className={`${colors.semantic.error.light} border-2 ${colors.semantic.error.border} ${tokens.borders.radius.lg} ${tokens.spacing.section.lg}`}
              >
                <div
                  className={`flex items-center ${tokens.spacing.gap.md} mb-3`}
                >
                  <Trash2 className={colors.semantic.error.text} size={24} />
                  <h3
                    className={`${tokens.typography.heading.h4} ${colors.semantic.error.text}`}
                  >
                    Danger Zone
                  </h3>
                </div>
                <p
                  className={`${colors.structural.text.secondary} ${tokens.typography.body.secondary} mb-4`}
                >
                  Use this button to completely reset the system and start
                  fresh. This will permanently delete all firefighters, holds,
                  and history from all shifts.
                </p>
                <button
                  onClick={() => {
                    onMasterReset();
                    onClose();
                  }}
                  className={`w-full ${colors.components.button.danger} py-3 ${tokens.borders.radius.md} flex items-center justify-center ${tokens.spacing.gap.sm}`}
                >
                  <Trash2 size={20} />
                  Master Reset - Delete Everything
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          className={`${colors.structural.bg.surface} border-t-2 ${colors.structural.border.default} ${tokens.spacing.section.lg} sticky bottom-0`}
        >
          <button
            onClick={onClose}
            className={`w-full ${colors.semantic.scheduled.gradient} ${colors.semantic.scheduled.hover} text-white font-bold py-3 ${tokens.borders.radius.md} transition-colors focus-ring`}
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}
