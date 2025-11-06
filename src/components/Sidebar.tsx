/**
 * Sidebar - Upcoming Schedule Panel
 *
 * Displays upcoming holds and rotation information.
 * Uses MaterialM design system.
 *
 * @example
 * ```tsx
 * <Sidebar
 *   firefighters={firefighters}
 *   scheduledHolds={holds}
 *   currentShift={currentShift}
 *   isDarkMode={isDarkMode}
 * />
 * ```
 */

import { BarChart3, Calendar, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Firefighter, Shift, supabase } from "../lib/supabase";
import { ScheduledHold } from "../utils/calendarUtils";
import { CardM3 } from "./m3/CardM3";
import { ButtonM3 } from "./m3/ButtonM3";
import { BadgeM3, CountBadgeM3 } from "./m3/BadgeM3";
import { NoScheduledHoldsEmptyState } from "./EmptyState";
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

function formatDate(dateString: string) {
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
}

/**
 * MaterialM Sidebar Component
 */
function SidebarM3({
  firefighters,
  scheduledHolds,
  currentShift,
  onNavigate,
  isAdminMode = false,
}: SidebarProps) {
  const [allShiftFirefighters, setAllShiftFirefighters] = useState<Firefighter[]>([]);
  const [currentShiftRotation, setCurrentShiftRotation] = useState<Firefighter[]>([]);

  // Load rotation data
  useEffect(() => {
    async function loadRotationData() {
      const { data } = await supabase
        .from("firefighters")
        .select("*")
        .eq("is_active", true)
        .eq("is_available", true)
        .order("order_position");

      if (data) {
        const shiftA = data.filter((ff) => ff.shift === "A")[0];
        const shiftB = data.filter((ff) => ff.shift === "B")[0];
        const shiftC = data.filter((ff) => ff.shift === "C")[0];

        const nextUpAll = [shiftA, shiftB, shiftC].filter(Boolean);
        setAllShiftFirefighters(nextUpAll);

        const currentShiftFFs = data
          .filter((ff) => ff.shift === currentShift)
          .slice(0, 5);
        setCurrentShiftRotation(currentShiftFFs);
      }
    }
    loadRotationData();
  }, [firefighters.length, currentShift]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingHolds = scheduledHolds
    .filter((h) => {
      if (!h.hold_date) return false;
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
    if (!holdDate) return;
    if (!dateMap.has(holdDate)) {
      dateMap.set(holdDate, []);
    }
    dateMap.get(holdDate)!.push(hold);
  });

  dateMap.forEach((holds, date) => {
    groupedHolds.push({ date, holds });
  });

  const displayedHolds = groupedHolds.slice(0, 10);

  return (
    <div className="space-y-6 sticky top-24 h-fit">
      {/* Navigation Button */}
      {onNavigate && isAdminMode && (
        <ButtonM3
          color="info"
          size="md"
          fullWidth
          startIcon={<BarChart3 size={18} />}
          onClick={() => onNavigate("reports")}
        >
          <span className="hidden sm:inline">Reports</span>
        </ButtonM3>
      )}

      {/* Main Sidebar Card */}
      <CardM3 elevation={2} className="overflow-hidden">
        {/* Header */}
        <CardM3.Header>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-materialm-primary">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-materialm-text dark:text-materialm-text-dark">
              Upcoming Schedule
            </h2>
          </div>
        </CardM3.Header>

        <CardM3.Body>
          <div className="space-y-6">
            {/* Empty State */}
            {allShiftFirefighters.length === 0 &&
             currentShiftRotation.length === 0 &&
             displayedHolds.length === 0 && (
              <NoScheduledHoldsEmptyState
                onScheduleHold={() => {}}
                isAdminMode={isAdminMode}
              />
            )}

            {/* Next Up for Hold (All Shifts) */}
            {allShiftFirefighters.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide mb-3 text-materialm-text-secondary dark:text-materialm-text-secondary-dark">
                  Next Up for Hold (All Shifts)
                </h3>
                <div className="space-y-2">
                  {allShiftFirefighters.map((ff, index) => (
                    <div
                      key={ff.id}
                      className={`
                        p-3 rounded-lg border-2
                        ${index === 0 ? 'bg-materialm-warning/10 dark:bg-materialm-warning/20 border-materialm-warning' : 'bg-materialm-surface dark:bg-materialm-dark border-materialm-border dark:border-materialm-border-dark'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 shadow-sm
                            ${index === 0 ? 'bg-materialm-warning text-materialm-on-warning border-materialm-border-dark' : 'bg-materialm-surface-light dark:bg-materialm-darkgray text-materialm-text dark:text-materialm-text-dark border-materialm-border dark:border-materialm-border-dark'}
                          `}
                        >
                          {index + 1}
                        </div>
                        <ShiftBadge shift={ff.shift as "A" | "B" | "C"} />
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm truncate ${index === 0 ? 'text-materialm-warning dark:text-materialm-warning-light' : 'text-materialm-text dark:text-materialm-text-dark'}`}>
                            {ff.name}
                          </p>
                          {ff.fire_station && (
                            <p className="text-xs text-materialm-text-secondary dark:text-materialm-text-secondary-dark">
                              Station #{ff.fire_station}
                            </p>
                          )}
                        </div>
                        {index === 0 && (
                          <BadgeM3 color="warning" size="xs">
                            Next Up
                          </BadgeM3>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Shift Rotation */}
            {currentShiftRotation.length > 0 && (
              <div className="pt-4 border-t-2 border-materialm-border dark:border-materialm-border-dark">
                <h3 className="text-xs font-bold uppercase tracking-wide mb-3 text-materialm-text-secondary dark:text-materialm-text-secondary-dark">
                  Shift {currentShift} Rotation (Next 5)
                </h3>
                <div className="space-y-2">
                  {currentShiftRotation.map((ff, index) => (
                    <div
                      key={ff.id}
                      className={`
                        p-3 rounded-lg border
                        ${index === 0 ? 'bg-materialm-warning/10 dark:bg-materialm-warning/20 border-materialm-warning' : 'bg-materialm-surface dark:bg-materialm-dark border-materialm-border dark:border-materialm-border-dark'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2
                            ${index === 0 ? 'bg-materialm-warning text-materialm-on-warning border-materialm-border-dark' : 'bg-materialm-surface-light dark:bg-materialm-darkgray text-materialm-text dark:text-materialm-text-dark border-materialm-border dark:border-materialm-border-dark'}
                          `}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm truncate ${index === 0 ? 'text-materialm-warning dark:text-materialm-warning-light' : 'text-materialm-text dark:text-materialm-text-dark'}`}>
                            {ff.name}
                          </p>
                          {ff.fire_station && (
                            <p className="text-xs text-materialm-text-secondary dark:text-materialm-text-secondary-dark">
                              Station #{ff.fire_station}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scheduled Holds */}
            {displayedHolds.length > 0 && (
              <div className="pt-4 border-t-2 border-materialm-border dark:border-materialm-border-dark">
                <h3 className="text-xs font-bold uppercase tracking-wide mb-3 text-materialm-text-secondary dark:text-materialm-text-secondary-dark">
                  Scheduled Holds
                </h3>
                <div className="space-y-3">
                  {displayedHolds.map((group) => (
                    <div
                      key={group.date}
                      className="p-3 border rounded-lg bg-materialm-surface dark:bg-materialm-dark border-materialm-border dark:border-materialm-border-dark hover:border-materialm-primary dark:hover:border-materialm-primary-light transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <BadgeM3 color="primary" size="xs">
                          {formatDate(group.date)}
                        </BadgeM3>
                        {group.holds.length > 1 && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-materialm-text-secondary dark:text-materialm-text-secondary-dark" />
                            <CountBadgeM3 count={group.holds.length} color="neutral" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {group.holds.map((hold) => (
                          <div key={hold.id}>
                            <p className="font-semibold text-sm text-materialm-text dark:text-materialm-text-dark">
                              {hold.firefighter_name}
                            </p>
                            {hold.fire_station && (
                              <p className="text-xs text-materialm-text-secondary dark:text-materialm-text-secondary-dark">
                                Station #{hold.fire_station}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State for No Scheduled Holds */}
            {displayedHolds.length === 0 &&
             (allShiftFirefighters.length > 0 || currentShiftRotation.length > 0) && (
              <div className="pt-4 border-t-2 border-materialm-border dark:border-materialm-border-dark">
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-materialm-text-disabled dark:text-materialm-text-disabled-dark" />
                  <p className="text-sm text-materialm-text-secondary dark:text-materialm-text-secondary-dark mb-1">
                    No Upcoming Holds
                  </p>
                  <p className="text-xs text-materialm-text-disabled dark:text-materialm-text-disabled-dark">
                    Click any date to schedule
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardM3.Body>
      </CardM3>
    </div>
  );
}

/**
 * Sidebar Component
 *
 * Uses MaterialM design system.
 */
export const Sidebar = SidebarM3;
