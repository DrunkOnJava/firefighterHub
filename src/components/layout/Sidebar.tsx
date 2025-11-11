import { BarChart3, Calendar, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Firefighter, Shift, supabase } from '@/lib/supabase';
import { ScheduledHold } from '@/utils/calendarUtils';
import { NoScheduledHoldsEmptyState } from '@/components/EmptyState';
import { ShiftBadge } from "@/features/shifts/components/ShiftBadge";

type View = "calendar" | "reports";

interface SidebarProps {
  firefighters: Firefighter[];
  scheduledHolds: ScheduledHold[];
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
  currentShift,
  onNavigate,
  isAdminMode = false,
}: SidebarProps) {
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
          className="
            flex items-center justify-center gap-2
            p-4
            bg-gradient-to-r from-blue-500 to-blue-600
            hover:from-blue-600 hover:to-blue-700
            text-white font-semibold
            rounded-lg
            transition-all duration-200
            focus-ring w-full
          "
          title="View Reports"
        >
          <BarChart3 className="w-5 h-5" />
          <span className="hidden sm:inline">Reports</span>
        </button>
      )}

      <div
        className="
          border-2 rounded-xl shadow-md
          overflow-hidden
          bg-card
          border-border
        "
      >
        <div
          className="
            border-b-2 p-4
            bg-muted
            border-border
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                p-3
                rounded-lg
                bg-gradient-to-r from-blue-600 to-blue-700
              "
            >
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2
              className="
                text-lg font-bold
                text-foreground
              "
            >
              Upcoming Schedule
            </h2>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Empty state when no firefighters and no holds */}
          {nextUpAllShifts.length === 0 && 
           currentShiftRotation.length === 0 && 
           displayedHolds.length === 0 && (
            <div className="py-4">
              <NoScheduledHoldsEmptyState 
                onScheduleHold={() => {
                  // This will be handled by the calendar click
                  // Empty state guides user to use calendar
                }}
                isAdminMode={isAdminMode}
              />
            </div>
          )}

          {/* Always show Next Up for Hold (All Shifts) */}
          {nextUpAllShifts.length > 0 && (
            <div>
              <h3
                className="
                  text-sm
                  font-bold
                  uppercase tracking-wide mb-2
                  text-muted-foreground
                "
              >
                Next Up for Hold (All Shifts)
              </h3>
              <div className="space-y-2">
                {nextUpAllShifts.map((ff, index) => (
                  <div
                    key={ff.id}
                    className={`
                      rounded-lg
                      p-4
                      border
                      ${
                        index === 0
                          ? "bg-amber-500/10 border-amber-500/50"
                          : "bg-muted border-border"
                      }
                    `}
                  >
                    <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3">
                      {/* Position Number */}
                      <span
                        className={`
                          w-6 h-6 rounded-full flex items-center justify-center
                          text-sm
                          font-bold
                          border-2 shadow-sm
                          ${
                            index === 0
                              ? "bg-amber-500 text-slate-900 border-black shadow-black/50"
                              : "bg-card text-muted-foreground border-slate-700"
                          }
                        `}
                      >
                        {index + 1}
                      </span>

                      {/* Shift Badge - Centered Column */}
                      <div className="flex justify-center">
                        <ShiftBadge shift={ff.shift as "A" | "B" | "C"} />
                      </div>

                      {/* Name and Station */}
                      <div>
                        <p
                          className={`
                            font-semibold
                            text-sm
                            ${
                              index === 0
                                ? "text-amber-700 dark:text-amber-400"
                                : "text-foreground"
                            }
                          `}
                        >
                          {ff.name}
                        </p>
                        {ff.fire_station && (
                          <p
                            className="
                              text-sm
                              text-muted-foreground
                            "
                          >
                            Station #{ff.fire_station}
                          </p>
                        )}
                      </div>

                      {/* Next Up Badge */}
                      {index === 0 && (
                        <span
                          className="
                            px-2 py-0.5
                            text-sm
                            font-bold
                            rounded-md
                            bg-amber-500 text-white
                            border-2 border-black
                          "
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
              className="
                pt-4 border-t-2
                border-border
              "
            >
              <h3
                className="
                  text-sm
                  font-bold
                  uppercase tracking-wide mb-2
                  text-muted-foreground
                "
              >
                Shift {currentShift} Rotation (Next 5)
              </h3>
              <div className="space-y-2">
                {currentShiftRotation.map((ff, index) => (
                  <div
                    key={ff.id}
                    className={`
                      rounded-lg
                      p-4
                      border
                      ${
                        index === 0
                          ? "bg-amber-500/10 border-amber-500/50"
                          : "bg-muted border-border"
                      }
                    `}
                  >
                    <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3">
                      {/* Position Number */}
                      <span
                        className={`
                          w-6 h-6 rounded-full flex items-center justify-center
                          text-sm
                          font-bold
                          border-2 shadow-sm
                          ${
                            index === 0
                              ? "bg-amber-500 text-slate-900 border-black shadow-black/50"
                              : "bg-card text-muted-foreground border-slate-700"
                          }
                        `}
                      >
                        {index + 1}
                      </span>

                      {/* Shift Badge - Centered Column */}
                      <div className="flex justify-center">
                        <ShiftBadge shift={ff.shift as "A" | "B" | "C"} />
                      </div>

                      {/* Name and Station */}
                      <div>
                        <p
                          className={`
                            font-semibold
                            text-sm
                            ${
                              index === 0
                                ? "text-amber-700 dark:text-amber-400"
                                : "text-foreground"
                            }
                          `}
                        >
                          {ff.name}
                        </p>
                        {ff.fire_station && (
                          <p
                            className="
                              text-sm
                              text-muted-foreground
                            "
                          >
                            Station #{ff.fire_station}
                          </p>
                        )}
                      </div>

                      {/* Next Up Badge */}
                      {index === 0 && (
                        <span
                          className="
                            px-2 py-0.5
                            text-sm
                            font-bold
                            rounded-md
                            bg-amber-500 text-white
                            border-2 border-black
                          "
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
              className="
                pt-4 border-t-2
                border-border
              "
            >
              <h3
                className="
                  text-sm
                  font-bold
                  uppercase tracking-wide mb-2
                  text-muted-foreground
                "
              >
                Scheduled Holds
              </h3>
              <div className="space-y-3">
                {displayedHolds.map((group) => (
                  <div
                    key={group.date}
                    className="
                      border rounded-lg
                      p-4
                      transition-all duration-200
                      bg-muted
                      border-border
                      hover:border-blue-500
                    "
                  >
                    <div
                      className="flex items-center justify-between mb-2"
                    >
                      <span
                        className="
                          px-2 py-0.5
                          text-sm
                          font-bold
                          rounded-md
                          bg-blue-600
                          text-white
                        "
                      >
                        {formatDate(group.date)}
                      </span>
                      {group.holds.length > 1 && (
                        <span
                          className="
                            px-2 py-0.5
                            text-sm
                            font-bold
                            rounded-md
                            flex items-center gap-1
                            bg-card
                            text-muted-foreground
                          "
                        >
                          <Users className="w-3 h-3" />
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
                              className="
                                font-semibold
                                text-sm
                                text-foreground
                              "
                            >
                              {hold.firefighter_name}
                            </p>
                            {hold.fire_station && (
                              <p
                                className="
                                  text-sm
                                  text-muted-foreground
                                "
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
          
          {/* Empty state for no scheduled holds (but firefighters exist) */}
          {displayedHolds.length === 0 && 
           (nextUpAllShifts.length > 0 || currentShiftRotation.length > 0) && (
            <div
              className="
                pt-4 border-t-2
                border-border
              "
            >
              <div className="text-center py-8">
                <Calendar 
                  className="w-12 h-12 mx-auto mb-3 text-muted-foreground" 
                />
                <p className="text-sm text-muted-foreground mb-1">
                  No Upcoming Holds
                </p>
                <p className="text-sm text-muted-foreground">
                  Click any date to schedule
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
