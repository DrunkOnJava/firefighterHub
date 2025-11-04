import { BarChart3, Calendar, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Firefighter, Shift, supabase } from "../lib/supabase";
import { colors, tokens } from "../styles";
import { ScheduledHold } from "../utils/calendarUtils";
import { ShiftBadge } from "./ShiftBadge";

type View = "calendar" | "reports";

interface SidebarProps {
  firefighters: Firefighter[];
  scheduledHolds: ScheduledHold[];
  isDarkMode?: boolean;
  currentShift: Shift;
  onNavigate?: (view: View) => void;
  isAdminMode?: boolean;
}

interface GroupedHold {
  date: string;
  holds: ScheduledHold[];
}

export function Sidebar({
  firefighters,
  scheduledHolds,
  isDarkMode, // Unused - design tokens handle dark mode automatically
  currentShift,
  onNavigate,
  isAdminMode = false,
}: SidebarProps) {
  // Suppress unused variable warning - kept for API compatibility
  void isDarkMode;
  const [allShiftFirefighters, setAllShiftFirefighters] = useState<
    Firefighter[]
  >([]);
  const [currentShiftRotation, setCurrentShiftRotation] = useState<
    Firefighter[]
  >([]);

  // Load next 3 firefighters across all shifts (one from each)
  useEffect(() => {
    async function loadRotationData() {
      const { data } = await supabase
        .from("firefighters")
        .select("*")
        .eq("is_active", true)
        .eq("is_available", true)
        .order("order_position");

      if (data) {
        // Get first firefighter from each shift (3 total for all shifts)
        const shiftA = data.filter((ff) => ff.shift === "A")[0];
        const shiftB = data.filter((ff) => ff.shift === "B")[0];
        const shiftC = data.filter((ff) => ff.shift === "C")[0];

        const nextUpAll = [shiftA, shiftB, shiftC].filter(Boolean);
        setAllShiftFirefighters(nextUpAll);

        // Get first 5 from current shift for rotation display
        const currentShiftFFs = data
          .filter((ff) => ff.shift === currentShift)
          .slice(0, 5);
        setCurrentShiftRotation(currentShiftFFs);
      }
    }
    loadRotationData();
  }, [firefighters.length, currentShift]); // Reload when count or shift changes

  const nextUpAllShifts = allShiftFirefighters;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingHolds = scheduledHolds
    .filter((h) => {
      if (!h.hold_date) return false; // Skip holds without dates
      const holdDate = new Date(h.hold_date);
      holdDate.setHours(0, 0, 0, 0);
      return holdDate >= today && h.status === "scheduled";
    })
    .sort((a, b) => {
      const dateA = a.hold_date ? new Date(a.hold_date).getTime() : 0;
      const dateB = b.hold_date ? new Date(b.hold_date).getTime() : 0;
      return dateA - dateB;
    });

  const groupedHolds: GroupedHold[] = [];
  const dateMap = new Map<string, ScheduledHold[]>();

  upcomingHolds.forEach((hold) => {
    const holdDate = hold.hold_date;
    if (!holdDate) return; // Skip holds without dates - type guard
    if (!dateMap.has(holdDate)) {
      dateMap.set(holdDate, []);
    }
    dateMap.get(holdDate)!.push(hold);
  });

  dateMap.forEach((holds, date) => {
    groupedHolds.push({ date, holds });
  });

  const displayedHolds = groupedHolds.slice(0, 10);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const holdDate = new Date(dateString);
    holdDate.setHours(0, 0, 0, 0);

    if (holdDate.getTime() === today.getTime()) {
      return "Today";
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (holdDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    }

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-6 sticky top-24 h-fit">
      {/* Navigation Buttons */}
      {onNavigate && isAdminMode && (
        <button
          onClick={() => onNavigate("reports")}
          className={`
            flex items-center justify-center gap-2
            ${tokens.spacing.card.md}
            ${colors.semantic.info.gradient}
            ${colors.semantic.info.hover}
            text-white font-semibold
            ${tokens.borders.radius.lg}
            ${tokens.transitions.fast}
            focus-ring w-full
          `}
          title="View Reports"
        >
          <BarChart3 size={18} />
          <span className="hidden sm:inline">Reports</span>
        </button>
      )}

      <div
        className={`
          border-2 ${tokens.borders.radius.xl} ${tokens.shadows.lg}
          overflow-hidden
          ${colors.structural.bg.card}
          ${colors.structural.border.default}
        `}
      >
        <div
          className={`
            border-b-2 ${tokens.spacing.card.md}
            ${colors.structural.bg.surface}
            ${colors.structural.border.default}
          `}
        >
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            <div
              className={`
                ${tokens.spacing.section.md}
                ${tokens.borders.radius.lg}
                ${colors.semantic.primary.gradient}
              `}
            >
              <Calendar className="text-white" size={20} />
            </div>
            <h2
              className={`
                ${tokens.typography.heading.h4}
                ${colors.structural.text.primary}
              `}
            >
              Upcoming Schedule
            </h2>
          </div>
        </div>

        <div className={`${tokens.spacing.card.md} space-y-4`}>
          {/* Always show Next Up for Hold (All Shifts) */}
          {nextUpAllShifts.length > 0 && (
            <div>
              <h3
                className={`
                  ${tokens.typography.body.small}
                  ${tokens.typography.weight.bold}
                  uppercase tracking-wide ${tokens.spacing.margin.sm}
                  ${colors.structural.text.secondary}
                `}
              >
                Next Up for Hold (All Shifts)
              </h3>
              <div className={`space-y-2`}>
                {nextUpAllShifts.map((ff, index) => (
                  <div
                    key={ff.id}
                    className={`
                      ${tokens.borders.radius.lg}
                      ${tokens.spacing.section.lg}
                      border
                      ${
                        index === 0
                          ? `${colors.semantic.warning.light} ${colors.semantic.warning.border}`
                          : `${colors.structural.bg.surface} ${colors.structural.border.default}`
                      }
                    `}
                  >
                    <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3">
                      {/* Position Number */}
                      <span
                        className={`
                          w-6 h-6 rounded-full flex items-center justify-center
                          ${tokens.typography.body.small}
                          ${tokens.typography.weight.bold}
                          border-2 shadow-sm
                          ${
                            index === 0
                              ? "bg-amber-500 text-gray-900 border-black shadow-black/50"
                              : `${colors.structural.bg.card} ${colors.structural.text.secondary} border-gray-700`
                          }
                        `}
                      >
                        {index + 1}
                      </span>

                      {/* Shift Badge - Centered Column */}
                      <div className="flex justify-center">
                        <ShiftBadge shift={ff.shift} />
                      </div>

                      {/* Name and Station */}
                      <div>
                        <p
                          className={`
                            ${tokens.typography.weight.semibold}
                            ${tokens.typography.body.secondary}
                            ${
                              index === 0
                                ? colors.semantic.warning.text
                                : colors.structural.text.primary
                            }
                          `}
                        >
                          {ff.name}
                        </p>
                        {ff.fire_station && (
                          <p
                            className={`
                              ${tokens.typography.body.small}
                              ${colors.structural.text.tertiary}
                            `}
                          >
                            Station #{ff.fire_station}
                          </p>
                        )}
                      </div>

                      {/* Next Up Badge */}
                      {index === 0 && (
                        <span
                          className={`
                            px-2 py-0.5
                            ${tokens.typography.body.small}
                            ${tokens.typography.weight.bold}
                            ${tokens.borders.radius.md}
                            bg-amber-500 text-white
                            border-2 border-black
                          `}
                        >
                          Next Up
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Shift Rotation (5 positions) */}
          {currentShiftRotation.length > 0 && (
            <div
              className={`
                pt-4 border-t-2
                ${colors.structural.border.default}
              `}
            >
              <h3
                className={`
                  ${tokens.typography.body.small}
                  ${tokens.typography.weight.bold}
                  uppercase tracking-wide ${tokens.spacing.margin.sm}
                  ${colors.structural.text.secondary}
                `}
              >
                Shift {currentShift} Rotation (Next 5)
              </h3>
              <div className="space-y-2">
                {currentShiftRotation.map((ff, index) => (
                  <div
                    key={ff.id}
                    className={`
                      ${tokens.borders.radius.lg}
                      ${tokens.spacing.section.lg}
                      border
                      ${
                        index === 0
                          ? `${colors.semantic.warning.light} ${colors.semantic.warning.border}`
                          : `${colors.structural.bg.surface} ${colors.structural.border.default}`
                      }
                    `}
                  >
                    <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3">
                      {/* Position Number */}
                      <span
                        className={`
                          w-6 h-6 rounded-full flex items-center justify-center
                          ${tokens.typography.body.small}
                          ${tokens.typography.weight.bold}
                          border-2 shadow-sm
                          ${
                            index === 0
                              ? "bg-amber-500 text-gray-900 border-black shadow-black/50"
                              : `${colors.structural.bg.card} ${colors.structural.text.secondary} border-gray-700`
                          }
                        `}
                      >
                        {index + 1}
                      </span>

                      {/* Shift Badge - Centered Column */}
                      <div className="flex justify-center">
                        <ShiftBadge shift={ff.shift} />
                      </div>

                      {/* Name and Station */}
                      <div>
                        <p
                          className={`
                            ${tokens.typography.weight.semibold}
                            ${tokens.typography.body.secondary}
                            ${
                              index === 0
                                ? colors.semantic.warning.text
                                : colors.structural.text.primary
                            }
                          `}
                        >
                          {ff.name}
                        </p>
                        {ff.fire_station && (
                          <p
                            className={`
                              ${tokens.typography.body.small}
                              ${colors.structural.text.tertiary}
                            `}
                          >
                            Station #{ff.fire_station}
                          </p>
                        )}
                      </div>

                      {/* Next Up Badge */}
                      {index === 0 && (
                        <span
                          className={`
                            px-2 py-0.5
                            ${tokens.typography.body.small}
                            ${tokens.typography.weight.bold}
                            ${tokens.borders.radius.md}
                            bg-amber-500 text-white
                            border-2 border-black
                          `}
                        >
                          Next Up
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scheduled Holds */}
          {displayedHolds.length > 0 && (
            <div
              className={`
                pt-4 border-t-2
                ${colors.structural.border.default}
              `}
            >
              <h3
                className={`
                  ${tokens.typography.body.small}
                  ${tokens.typography.weight.bold}
                  uppercase tracking-wide ${tokens.spacing.margin.sm}
                  ${colors.structural.text.secondary}
                `}
              >
                Scheduled Holds
              </h3>
              <div className="space-y-3">
                {displayedHolds.map((group) => (
                  <div
                    key={group.date}
                    className={`
                      border ${tokens.borders.radius.lg}
                      ${tokens.spacing.section.lg}
                      ${tokens.transitions.fast}
                      ${colors.structural.bg.surface}
                      ${colors.structural.border.default}
                      hover:${colors.structural.border.hover}
                    `}
                  >
                    <div
                      className={`flex items-center justify-between ${tokens.spacing.margin.sm}`}
                    >
                      <span
                        className={`
                          px-2 py-0.5
                          ${tokens.typography.body.small}
                          ${tokens.typography.weight.bold}
                          ${tokens.borders.radius.md}
                          ${colors.semantic.scheduled.solid}
                          text-white
                        `}
                      >
                        {formatDate(group.date)}
                      </span>
                      {group.holds.length > 1 && (
                        <span
                          className={`
                            px-2 py-0.5
                            ${tokens.typography.body.small}
                            ${tokens.typography.weight.bold}
                            ${tokens.borders.radius.md}
                            flex items-center gap-1
                            ${colors.structural.bg.card}
                            ${colors.structural.text.secondary}
                          `}
                        >
                          <Users size={12} />
                          {group.holds.length}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {group.holds.map((hold) => (
                        <div
                          key={hold.id}
                          className="flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <p
                              className={`
                                ${tokens.typography.weight.semibold}
                                ${tokens.typography.body.secondary}
                                ${colors.structural.text.primary}
                              `}
                            >
                              {hold.firefighter_name}
                            </p>
                            {hold.fire_station && (
                              <p
                                className={`
                                  ${tokens.typography.body.small}
                                  ${colors.structural.text.tertiary}
                                `}
                              >
                                Station #{hold.fire_station}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
