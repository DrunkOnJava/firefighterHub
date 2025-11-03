import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  MapPin,
  Trash2,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Firefighter } from "../lib/supabase";
import { ScheduledHold } from "../utils/calendarUtils";

interface ListViewProps {
  firefighters: Firefighter[];
  scheduledHolds: ScheduledHold[];
  onScheduleHold: (
    holdDate: string,
    firefighter: Firefighter,
    station?: string
  ) => void;
  onRemoveHold: (holdId: string) => void;
  onMarkCompleted: (hold: ScheduledHold) => void;
  loading: boolean;
  isAdminMode?: boolean;
}

interface HoldEntry {
  id: string;
  date: Date;
  dateString: string;
  firefighterName: string;
  fireStation: string | null;
  status: "scheduled" | "completed" | "skipped";
  isPast: boolean;
  isToday: boolean;
  hold?: ScheduledHold;
}

export function ListView({
  firefighters,
  scheduledHolds,
  onRemoveHold,
  onMarkCompleted,
  loading,
  isAdminMode = false,
}: ListViewProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const holdsList = useMemo(() => {
    const entries: HoldEntry[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    scheduledHolds.forEach((hold) => {
      if (!hold.hold_date) return; // Skip holds without dates

      const holdDate = new Date(hold.hold_date);
      holdDate.setHours(0, 0, 0, 0);

      entries.push({
        id: hold.id,
        date: holdDate,
        dateString: hold.hold_date,
        firefighterName: hold.firefighter_name || "Unknown",
        fireStation: hold.fire_station,
        status: (hold.status || "scheduled") as
          | "scheduled"
          | "completed"
          | "skipped",
        isPast: holdDate < today,
        isToday: holdDate.getTime() === today.getTime(),
        hold,
      });
    });

    firefighters.forEach((ff) => {
      if (ff.last_hold_date) {
        const exists = entries.some(
          (e) =>
            e.dateString === ff.last_hold_date && e.firefighterName === ff.name
        );
        if (!exists) {
          const holdDate = new Date(ff.last_hold_date);
          holdDate.setHours(0, 0, 0, 0);

          entries.push({
            id: `past-${ff.id}`,
            date: holdDate,
            dateString: ff.last_hold_date,
            firefighterName: ff.name,
            fireStation: ff.fire_station,
            status: "completed",
            isPast: holdDate < today,
            isToday: holdDate.getTime() === today.getTime(),
          });
        }
      }
    });

    return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [scheduledHolds, firefighters]);

  const upcomingHolds = holdsList.filter((h) => !h.isPast);
  const pastHolds = holdsList.filter((h) => h.isPast);

  function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatRelativeDate(date: Date): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

    return "";
  }

  function handleRemoveHold(holdId: string) {
    onRemoveHold(holdId);
    setShowDeleteConfirm(null);
  }

  function HoldCard({ entry }: { entry: HoldEntry }) {
    const relativeDate = formatRelativeDate(entry.date);

    return (
      <div
        className={`
        bg-gradient-to-br border-2 rounded-xl p-5 transition-all
        ${
          entry.status === "scheduled"
            ? "from-blue-900/30 to-blue-800/20 border-blue-600/50 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
            : "from-green-900/30 to-green-800/20 border-green-600/50 hover:border-green-500"
        }
        ${
          entry.isToday
            ? "ring-4 ring-red-500 ring-offset-2 ring-offset-gray-800 shadow-lg shadow-red-500/30"
            : ""
        }
      `}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <CalendarIcon
                size={20}
                className={
                  entry.status === "scheduled"
                    ? "text-blue-400"
                    : "text-green-400"
                }
              />
              <div>
                <h3 className="text-xl font-bold text-white">
                  {formatDate(entry.date)}
                </h3>
                {relativeDate && (
                  <p className="text-sm text-gray-400 mt-0.5">{relativeDate}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 ml-8">
              <div className="flex items-center gap-2">
                <User size={18} className="text-gray-400" />
                <span className="text-lg font-semibold text-white">
                  {entry.firefighterName}
                </span>
              </div>

              {entry.fireStation && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-orange-500/20 rounded-md flex items-center justify-center border border-orange-500/30">
                    <span className="text-orange-300 text-sm font-bold">
                      {entry.fireStation}
                    </span>
                  </div>
                  <MapPin size={18} className="text-orange-400" />
                  <span className="text-lg text-white font-bold">
                    Station #{entry.fireStation}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                {entry.status === "scheduled" ? (
                  <>
                    <Clock size={18} className="text-blue-400" />
                    <span className="text-sm text-blue-300 font-semibold">
                      Scheduled
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} className="text-green-400" />
                    <span className="text-sm text-green-300 font-semibold">
                      Completed
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {entry.hold && isAdminMode && (
            <div className="flex flex-col gap-2 md:ml-4">
              {showDeleteConfirm === entry.id ? (
                <div className="bg-gray-900/80 border border-red-600 rounded-lg p-3 space-y-2">
                  <p className="text-sm text-red-300 font-semibold mb-2">
                    Cancel this hold?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRemoveHold(entry.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors shadow-lg whitespace-nowrap text-sm"
                    >
                      Yes, Cancel
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors shadow-lg whitespace-nowrap text-sm"
                    >
                      No, Keep
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {entry.status === "scheduled" && !entry.isPast && (
                    <button
                      onClick={() => onMarkCompleted(entry.hold!)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-lg whitespace-nowrap flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      Mark Completed
                    </button>
                  )}
                  {entry.status === "scheduled" &&
                    !entry.id.startsWith("past-") && (
                      <button
                        onClick={() => setShowDeleteConfirm(entry.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-lg whitespace-nowrap flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        Cancel Hold
                      </button>
                    )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-850 border-2 border-gray-700 rounded-2xl shadow-2xl p-8">
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading holds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-850 border-2 border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-orange-900/30 via-gray-900 to-gray-800 border-b-2 border-gray-700 p-6">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
            <CalendarIcon className="text-white" size={28} />
          </div>
          <div>
            <h2 id="list-heading" className="text-2xl font-bold text-white">
              Hold List View
            </h2>
            <p className="text-base text-gray-400">
              All scheduled and completed holds
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {upcomingHolds.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="text-blue-400" size={24} />
              Upcoming Holds ({upcomingHolds.length})
            </h3>
            <div className="space-y-3">
              {upcomingHolds.map((entry) => (
                <HoldCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        )}

        {upcomingHolds.length === 0 && (
          <div className="text-center py-12">
            <Clock className="text-gray-600 mx-auto mb-4" size={48} />
            <p className="text-gray-400 text-lg font-semibold">
              No upcoming holds scheduled
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Switch to calendar view to schedule holds
            </p>
          </div>
        )}

        {pastHolds.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={24} />
              Past Holds ({pastHolds.length})
            </h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {pastHolds.map((entry) => (
                <HoldCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
