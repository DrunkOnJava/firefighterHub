/**
 * Sidebar - Upcoming Schedule Panel
 *
 * Displays upcoming holds and rotation information.
 * Automatically switches between MaterialM and legacy styling based on feature flag.
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
import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { Firefighter, Shift, supabase } from "../lib/supabase";
import { ScheduledHold } from "../utils/calendarUtils";
import { CardM3 } from "./m3/CardM3";
import { ButtonM3 } from "./m3/ButtonM3";
import { BadgeM3, CountBadgeM3 } from "./m3/BadgeM3";
import { NoScheduledHoldsEmptyState } from "./EmptyState";
import { ShiftBadge } from "./ShiftBadge";
import { SidebarLegacy } from "./SidebarLegacy";

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
            <div className="p-2 rounded-lg bg-blue-600">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
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
                <h3 className="text-xs font-bold uppercase tracking-wide mb-3 text-gray-500 dark:text-gray-400">
                  Next Up for Hold (All Shifts)
                </h3>
                <div className="space-y-2">
                  {allShiftFirefighters.map((ff, index) => (
                    <div
                      key={ff.id}
                      className={`
                        p-3 rounded-lg border-2
                        ${index === 0 ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500' : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 shadow-sm
                            ${index === 0 ? 'bg-amber-500 text-white border-amber-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-600'}
                          `}
                        >
                          {index + 1}
                        </div>
                        <ShiftBadge shift={ff.shift as "A" | "B" | "C"} />
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm truncate ${index === 0 ? 'text-amber-900 dark:text-amber-100' : 'text-gray-900 dark:text-white'}`}>
                            {ff.name}
                          </p>
                          {ff.fire_station && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
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
              <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-xs font-bold uppercase tracking-wide mb-3 text-gray-500 dark:text-gray-400">
                  Shift {currentShift} Rotation (Next 5)
                </h3>
                <div className="space-y-2">
                  {currentShiftRotation.map((ff, index) => (
                    <div
                      key={ff.id}
                      className={`
                        p-3 rounded-lg border
                        ${index === 0 ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2
                            ${index === 0 ? 'bg-amber-500 text-white border-amber-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-600'}
                          `}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm truncate ${index === 0 ? 'text-amber-900 dark:text-amber-100' : 'text-gray-900 dark:text-white'}`}>
                            {ff.name}
                          </p>
                          {ff.fire_station && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
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
              <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-xs font-bold uppercase tracking-wide mb-3 text-gray-500 dark:text-gray-400">
                  Scheduled Holds
                </h3>
                <div className="space-y-3">
                  {displayedHolds.map((group) => (
                    <div
                      key={group.date}
                      className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <BadgeM3 color="primary" size="xs">
                          {formatDate(group.date)}
                        </BadgeM3>
                        {group.holds.length > 1 && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-gray-500" />
                            <CountBadgeM3 count={group.holds.length} color="neutral" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {group.holds.map((hold) => (
                          <div key={hold.id}>
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">
                              {hold.firefighter_name}
                            </p>
                            {hold.fire_station && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">
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
              <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    No Upcoming Holds
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
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
 * Sidebar Component with Feature Flag
 *
 * Switches between MaterialM and legacy versions.
 */
export function Sidebar(props: SidebarProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <SidebarLegacy {...props} />;
  }

  return <SidebarM3 {...props} />;
}
