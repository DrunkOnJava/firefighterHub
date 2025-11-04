import { BarChart3, Calendar, Users } from "lucide-react";
import { Firefighter, Shift } from "../lib/supabase";
import { ScheduledHold } from "../utils/calendarUtils";
import { ShiftBadge } from "./ShiftBadge";

interface SidebarProps {
  firefighters: Firefighter[];
  scheduledHolds: ScheduledHold[];
  isDarkMode?: boolean;
  currentShift: Shift;
  onNavigate?: (view: "calendar" | "reports") => void;
  isAdminMode?: boolean;
}

export function Sidebar({
  firefighters,
  scheduledHolds,
  currentShift,
  onNavigate,
  isAdminMode = false,
}: SidebarProps) {
  // Get next up firefighters from all shifts (available firefighters sorted by position)
  const nextUpAllShifts = firefighters
    .filter((ff) => ff.is_available)
    .sort((a, b) => a.order_position - b.order_position)
    .slice(0, 5);

  // Get current shift rotation order
  const currentShiftRotation = firefighters
    .filter((ff) => ff.shift === currentShift && ff.is_available)
    .sort((a, b) => a.order_position - b.order_position);

  // Group scheduled holds by date and sort
  const holdsByDate = scheduledHolds
    .filter((hold) => hold.status === "scheduled")
    .reduce(
      (acc, hold) => {
        const date = hold.hold_date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(hold);
        return acc;
      },
      {} as Record<string, ScheduledHold[]>
    );

  const displayedHolds = Object.entries(holdsByDate)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, holds]) => ({ date, holds }));

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  }

  return (
    <div className="h-full flex flex-col bg-[#2F3640] rounded-xl overflow-hidden shadow-xl">
      {/* Navigation Buttons - If needed */}
      {onNavigate && isAdminMode && (
        <div className="p-3 border-b border-[#252A32]">
          <button
            onClick={() => onNavigate("reports")}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-br from-cyan-600 to-teal-700 hover:from-cyan-500 hover:to-teal-600 text-white font-semibold rounded-lg transition-all focus-ring w-full"
            title="View Reports"
          >
            <BarChart3 size={18} />
            Reports
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#252A32] border-b border-[#1a1d23] px-4 py-3 flex-shrink-0">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wide">
          Upcoming Schedule
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Next Up Section */}
        {nextUpAllShifts.length > 0 && (
          <div className="border-b border-[#252A32]">
            <div className="bg-[#252A32] px-4 py-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Next Up (All Shifts)
              </h3>
            </div>
            <table className="w-full">
              <tbody>
                {nextUpAllShifts.map((ff, index) => (
                  <tr
                    key={ff.id}
                    className={`
                      h-16 border-b border-[#252A32] hover:bg-[#3A4149] transition-colors
                      ${index === 0 ? "bg-amber-900/10" : ""}
                    `}
                  >
                    <td className="px-4 py-3 w-12">
                      <span
                        className={`
                          inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold
                          ${
                            index === 0
                              ? "bg-amber-500 text-gray-900"
                              : "bg-slate-700 text-slate-300"
                          }
                        `}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="text-sm font-semibold text-slate-100 truncate">
                        {ff.name}
                      </div>
                    </td>
                    <td className="px-2 py-3 w-16">
                      <ShiftBadge shift={ff.shift as "A" | "B" | "C"} />
                    </td>
                    <td className="px-4 py-3 text-right w-24">
                      {ff.fire_station && (
                        <span className="text-xs text-slate-400">
                          Station #{ff.fire_station}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Current Shift Rotation */}
        {currentShiftRotation.length > 0 && (
          <div className="border-b border-[#252A32]">
            <div className="bg-[#252A32] px-4 py-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Shift {currentShift} Rotation
              </h3>
            </div>
            <table className="w-full">
              <tbody>
                {currentShiftRotation.map((ff, index) => (
                  <tr
                    key={ff.id}
                    className={`
                      h-14 border-b border-[#252A32] hover:bg-[#3A4149] transition-colors
                      ${index === 0 ? "bg-amber-900/10" : ""}
                    `}
                  >
                    <td className="px-4 py-2.5 w-12">
                      <span
                        className={`
                          inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                          ${
                            index === 0
                              ? "bg-amber-500/50 text-amber-200"
                              : "bg-slate-700 text-slate-400"
                          }
                        `}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="text-sm font-medium text-slate-200 truncate">
                        {ff.name}
                      </div>
                    </td>
                    <td className="px-2 py-2.5 w-16">
                      <ShiftBadge shift={ff.shift as "A" | "B" | "C"} />
                    </td>
                    {ff.fire_station && (
                      <td className="px-4 py-2.5 text-right w-24">
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          Station #{ff.fire_station}
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Scheduled Holds */}
        {displayedHolds.length > 0 && (
          <div>
            <div className="bg-[#252A32] px-4 py-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Scheduled Holds
              </h3>
            </div>
            {displayedHolds.map((group) => (
              <div key={group.date} className="border-b border-[#252A32]">
                {/* Date Row */}
                <div className="bg-[#252A32]/50 px-4 py-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400">
                    {formatDate(group.date)}
                  </span>
                  {group.holds.length > 1 && (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Users size={12} />
                      {group.holds.length} holds
                    </span>
                  )}
                </div>
                {/* Holds Table */}
                <table className="w-full">
                  <tbody>
                    {group.holds.map((hold) => (
                      <tr
                        key={hold.id}
                        className="h-12 border-b border-[#252A32] last:border-0 hover:bg-[#3A4149] transition-colors"
                      >
                        <td className="px-4 py-2.5">
                          <div className="text-sm font-medium text-slate-200 truncate">
                            {hold.firefighter_name}
                          </div>
                        </td>
                        {hold.fire_station && (
                          <td className="px-4 py-2.5 text-right w-24">
                            <span className="text-xs text-slate-400 whitespace-nowrap">
                              Station #{hold.fire_station}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {nextUpAllShifts.length === 0 && 
         currentShiftRotation.length === 0 && 
         displayedHolds.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No upcoming holds scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
}
