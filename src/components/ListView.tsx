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
import { colors, tokens } from "../styles";
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
        border-2 rounded-xl p-5 transition-all
        ${
          entry.status === "scheduled"
            ? `${colors.structural.bg.card} ${colors.structural.border.default} hover:${colors.structural.border.hover} ${tokens.shadows.md}`
            : `${colors.structural.bg.surface} ${colors.semantic.success.border} hover:${colors.structural.border.hover}`
        }
        ${
          entry.isToday
            ? `ring-4 ring-red-500 ring-offset-2 ring-offset-${colors.structural.bg.app} ${tokens.shadows.lg}`
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
                    ? colors.semantic.scheduled.text
                    : colors.semantic.success.text
                }
              />
              <div>
                <h3 className={`${tokens.typography.heading.h4} ${colors.structural.text.primary}`}>
                  {formatDate(entry.date)}
                </h3>
                {relativeDate && (
                  <p className={`text-sm ${colors.structural.text.secondary} mt-0.5`}>{relativeDate}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 ml-8">
              <div className="flex items-center gap-2">
                <User size={18} className={colors.structural.text.secondary} />
                <span className={`text-lg font-semibold ${colors.structural.text.primary}`}>
                  {entry.firefighterName}
                </span>
              </div>

              {entry.fireStation && (
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 ${colors.semantic.warning.light} rounded-md flex items-center justify-center border ${colors.semantic.warning.border}`}>
                    <span className={`${colors.semantic.warning.text} text-sm font-bold`}>
                      {entry.fireStation}
                    </span>
                  </div>
                  <MapPin size={18} className={colors.semantic.warning.text} />
                  <span className={`text-lg ${colors.structural.text.primary} font-bold`}>
                    Station #{entry.fireStation}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                {entry.status === "scheduled" ? (
                  <>
                    <Clock size={18} className={colors.semantic.scheduled.text} />
                    <span className={`text-sm ${colors.semantic.scheduled.text} font-semibold`}>
                      Scheduled
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} className={colors.semantic.success.text} />
                    <span className={`text-sm ${colors.semantic.success.text} font-semibold`}>
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
                <div className={`${colors.structural.bg.app} border ${colors.semantic.error.border} rounded-lg p-3 space-y-2`}>
                  <p className={`text-sm ${colors.semantic.error.text} font-semibold mb-2`}>
                    Cancel this hold?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRemoveHold(entry.id)}
                      className={`flex-1 ${colors.semantic.error.solid} ${colors.semantic.error.hover} text-white font-semibold py-2 px-3 rounded-lg transition-colors ${tokens.shadows.lg} whitespace-nowrap text-sm`}
                    >
                      Yes, Cancel
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className={`flex-1 ${colors.interactive.button.default} ${colors.interactive.hover.bg} text-white font-semibold py-2 px-3 rounded-lg transition-colors ${tokens.shadows.lg} whitespace-nowrap text-sm`}
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
                      className={`px-4 py-2 ${colors.semantic.success.solid} ${colors.semantic.success.hover} text-white font-semibold rounded-lg transition-colors ${tokens.shadows.lg} whitespace-nowrap flex items-center justify-center gap-2`}
                    >
                      <CheckCircle2 size={16} />
                      Mark Completed
                    </button>
                  )}
                  {entry.status === "scheduled" &&
                    !entry.id.startsWith("past-") && (
                      <button
                        onClick={() => setShowDeleteConfirm(entry.id)}
                        className={`px-4 py-2 ${colors.semantic.error.solid} ${colors.semantic.error.hover} text-white font-semibold rounded-lg transition-colors ${tokens.shadows.lg} whitespace-nowrap flex items-center justify-center gap-2`}
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
      <div className={`${colors.structural.bg.card} border-2 ${colors.structural.border.default} ${tokens.borders.radius.lg} ${tokens.shadows['2xl']} p-8`}>
        <div className="text-center py-20">
          <div className={`w-12 h-12 border-4 ${colors.semantic.warning.border} border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
          <p className={`${colors.structural.text.secondary} text-lg`}>Loading holds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${colors.structural.bg.card} border-2 ${colors.structural.border.default} ${tokens.borders.radius.lg} ${tokens.shadows['2xl']} overflow-hidden`}>
      <div className={`${colors.structural.bg.surface} border-b-2 ${colors.structural.border.default} p-6`}>
        <div className="flex items-center gap-4">
          <div className={`${colors.semantic.warning.gradient} p-3 ${tokens.borders.radius.lg} ${tokens.shadows.lg}`}>
            <CalendarIcon className="text-white" size={28} />
          </div>
          <div>
            <h2 id="list-heading" className={`${tokens.typography.heading.h2} ${colors.structural.text.primary}`}>
              Hold List View
            </h2>
            <p className={`text-base ${colors.structural.text.secondary}`}>
              All scheduled and completed holds
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {upcomingHolds.length > 0 && (
          <div>
            <h3 className={`${tokens.typography.heading.h3} ${colors.structural.text.primary} mb-4 flex items-center gap-2`}>
              <Clock className={colors.semantic.scheduled.text} size={24} />
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
            <Clock className={`${colors.structural.text.tertiary} mx-auto mb-4`} size={48} />
            <p className={`${colors.structural.text.secondary} text-lg font-semibold`}>
              No upcoming holds scheduled
            </p>
            <p className={`${colors.structural.text.tertiary} text-sm mt-2`}>
              Switch to calendar view to schedule holds
            </p>
          </div>
        )}

        {pastHolds.length > 0 && (
          <div>
            <h3 className={`${tokens.typography.heading.h3} ${colors.structural.text.primary} mb-4 flex items-center gap-2`}>
              <CheckCircle2 className={colors.semantic.success.text} size={24} />
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
