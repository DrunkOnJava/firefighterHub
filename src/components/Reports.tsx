import {
  ArrowLeft,
  // CheckCircle, // Removed - Completed Holds metric removed per user feedback
  // Clock, // Removed - Avg Duration metric removed per user feedback
  Building2,
  Calendar,
  Download,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Firefighter, supabase } from "../lib/supabase";
import { colors, tokens } from "../styles";
import { ScheduledHold } from "../utils/calendarUtils";
import {
  // calculateHoldsByStation, // Removed - not used
  calculateHoldsByShift,
  calculateHoldsPerFirefighter,
  // calculateCompletionRate, // Removed - per user feedback
  // calculateAverageHoldDuration, // Removed - per user feedback
  getHoldsInDateRange,
  // calculateHoldsByDuration, // Removed - per user feedback
  // getFirefighterWithMostHolds, // Removed - metric removed per user feedback
  getStationWithMostHolds,
} from "../utils/metricsCalculations";
import { MetricCard } from "./MetricCard";

interface ReportsProps {
  firefighters: Firefighter[];
  holds: ScheduledHold[];
  isDarkMode: boolean;
  onNavigate?: (view: "calendar" | "reports") => void;
}

export function Reports({
  firefighters,
  holds,
  isDarkMode,
  onNavigate,
}: ReportsProps) {
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: "",
    end: "",
  });
  const [filterActive, setFilterActive] = useState(false);
  const [allHolds, setAllHolds] = useState<ScheduledHold[]>([]);

  // Fetch ALL holds across all shifts for comparison metrics
  useEffect(() => {
    let mounted = true;

    async function fetchAllHolds() {
      try {
        const today = new Date();
        const startOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 3,
          0
        );

        const startStr = startOfMonth.toISOString().split("T")[0];
        const endStr = endOfMonth.toISOString().split("T")[0];

        const { data, error } = await supabase
          .from("scheduled_holds")
          .select("*")
          // Don't filter by shift - get ALL holds
          .gte("hold_date", startStr)
          .lte("hold_date", endStr)
          .order("hold_date");

        if (error) {
          console.error("Error fetching all holds:", error);
          // Fall back to using the holds prop if fetch fails
          if (mounted) setAllHolds(holds);
          return;
        }

        if (mounted) {
          setAllHolds(data || []);
        }
      } catch (error) {
        console.error("Error fetching all holds:", error);
        // Fall back to using the holds prop if fetch fails
        if (mounted) setAllHolds(holds);
      }
    }

    fetchAllHolds();

    // Subscribe to real-time updates for all shifts
    const channel = supabase
      .channel("all_scheduled_holds_reports")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "scheduled_holds",
        },
        () => {
          console.log("🔄 Holds changed, refreshing all holds for reports");
          fetchAllHolds();
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error("❌ Reports: Real-time subscription error");
        } else if (status === "SUBSCRIBED") {
          console.log("✅ Reports: Real-time subscription active");
        }
      });

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
      console.log("🛑 Reports: Unsubscribed from real-time updates");
    };
  }, [holds]);

  // Apply date range filter if active
  const filteredHolds =
    filterActive && dateRange.start && dateRange.end
      ? getHoldsInDateRange(
          holds,
          new Date(dateRange.start),
          new Date(dateRange.end)
        )
      : holds;

  // Calculate metrics
  // Use allHolds for per-firefighter metrics to include all shifts
  const metrics = calculateHoldsPerFirefighter(allHolds, firefighters);
  // Calculate shift stats from ALL holds for comparison (across all shifts)
  const shiftStats = calculateHoldsByShift(allHolds);
  // REMOVED: Duration stats per user feedback
  // const durationStats = calculateHoldsByDuration(filteredHolds);
  // REMOVED: Completion rate per user feedback (Completed Holds metric removed)
  // const completionRate = calculateCompletionRate(filteredHolds);
  // REMOVED: Average duration per user feedback
  // const avgDuration = calculateAverageHoldDuration(filteredHolds);
  // REMOVED: Top firefighter metric per user feedback
  // const topFirefighter = getFirefighterWithMostHolds(filteredHolds, firefighters);
  const topStation = getStationWithMostHolds(filteredHolds);
  // REMOVED: Total hours worked metric per user feedback
  // const totalHoursWorked = calculateTotalHoursWorked(
  //   filteredHolds,
  //   filterActive && dateRange.start ? new Date(dateRange.start) : undefined,
  //   filterActive && dateRange.end ? new Date(dateRange.end) : undefined
  // );

  // REMOVED: Completed holds count per user feedback
  // const completedHolds = filteredHolds.filter(h => h.status === 'completed').length;

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["Firefighter", "Total Holds", "Avg Interval (days)"];

    const rows = metrics.map((m) => [
      m.name,
      m.totalHolds,
      m.averageIntervalDays,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hold-metrics-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`
        min-h-screen ${tokens.spacing.card.xl}
        ${tokens.transitions.fast}
        ${isDarkMode ? colors.structural.bg.app : "bg-gray-50"}
      `}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`${tokens.spacing.margin.xl} flex items-center justify-between`}
        >
          <div>
            <h1
              className={`
                ${tokens.typography.heading.h1}
                ${tokens.spacing.margin.sm}
                ${isDarkMode ? colors.structural.text.primary : "text-gray-900"}
              `}
            >
              Hold Metrics Dashboard
            </h1>
            <p
              className={
                isDarkMode ? colors.structural.text.secondary : "text-gray-600"
              }
            >
              Comprehensive analytics for hold management
            </p>
          </div>
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            {onNavigate && (
              <button
                onClick={() => onNavigate("calendar")}
                className={`
                  flex items-center ${tokens.spacing.gap.sm}
                  ${tokens.spacing.card.md}
                  ${colors.interactive.button.default}
                  ${colors.interactive.hover.bg}
                  text-white
                  ${tokens.borders.radius.lg}
                  ${tokens.transitions.fast}
                  focus-ring
                `}
                title="Return to Calendar"
              >
                <ArrowLeft className={tokens.icons.sm} />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
            <button
              onClick={handleExportCSV}
              className={`
                flex items-center ${tokens.spacing.gap.sm}
                ${tokens.spacing.card.md}
                ${colors.semantic.scheduled.gradient}
                ${colors.semantic.scheduled.hover}
                text-white
                ${tokens.borders.radius.lg}
                ${tokens.transitions.fast}
                focus-ring
              `}
            >
              <Download className={tokens.icons.sm} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div
          className={`
            border ${tokens.borders.radius.lg}
            ${tokens.spacing.card.md}
            ${tokens.spacing.margin.xl}
            ${
              isDarkMode
                ? `${colors.structural.bg.card} ${colors.structural.border.default}`
                : "bg-white border-gray-200"
            }
          `}
        >
          <div className="flex items-center gap-4 flex-wrap">
            <div className={`flex items-center ${tokens.spacing.gap.sm}`}>
              <Filter
                className={`${tokens.icons.sm} ${
                  isDarkMode
                    ? colors.structural.text.secondary
                    : "text-gray-600"
                }`}
              />
              <span
                className={`
                  ${tokens.typography.weight.medium}
                  ${
                    isDarkMode
                      ? colors.structural.text.primary
                      : "text-gray-900"
                  }
                `}
              >
                Date Range Filter:
              </span>
            </div>
            <div className={`flex items-center ${tokens.spacing.gap.sm}`}>
              <label
                className={
                  isDarkMode
                    ? colors.structural.text.secondary
                    : "text-gray-600"
                }
              >
                From:
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className={`
                  px-3 py-1 border ${tokens.borders.radius.md}
                  focus-ring
                  ${
                    isDarkMode
                      ? `${colors.components.input.default}`
                      : "bg-white border-gray-300 text-gray-900"
                  }
                `}
              />
            </div>
            <div className={`flex items-center ${tokens.spacing.gap.sm}`}>
              <label
                className={
                  isDarkMode
                    ? colors.structural.text.secondary
                    : "text-gray-600"
                }
              >
                To:
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className={`
                  px-3 py-1 border ${tokens.borders.radius.md}
                  focus-ring
                  ${
                    isDarkMode
                      ? `${colors.components.input.default}`
                      : "bg-white border-gray-300 text-gray-900"
                  }
                `}
              />
            </div>
            <button
              onClick={() => setFilterActive(!filterActive)}
              className={`
                ${tokens.spacing.card.md}
                ${tokens.borders.radius.md}
                ${tokens.transitions.fast}
                focus-ring
                ${
                  filterActive
                    ? `${colors.semantic.scheduled.gradient} ${colors.semantic.scheduled.hover} text-white`
                    : `${colors.interactive.button.default} ${colors.interactive.hover.bg} text-white`
                }
              `}
            >
              {filterActive ? "Filter Active" : "Apply Filter"}
            </button>
            {filterActive && (
              <button
                onClick={() => {
                  setFilterActive(false);
                  setDateRange({ start: "", end: "" });
                }}
                className={`
                  ${tokens.spacing.card.md}
                  ${colors.interactive.button.default}
                  ${colors.interactive.hover.bg}
                  text-white
                  ${tokens.borders.radius.md}
                  ${tokens.transitions.fast}
                  focus-ring
                `}
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <MetricCard
            title="Total Holds"
            value={filteredHolds.length}
            subtitle="All scheduled holds"
            icon={Calendar}
            isDarkMode={isDarkMode}
            colorClass="blue"
          />
          {/* REMOVED: Completed Holds metric per user feedback */}
          {/* REMOVED: Avg Duration metric per user feedback */}
          <MetricCard
            title="Top Station"
            value={topStation?.station || "N/A"}
            subtitle={`${topStation?.count || 0} total holds`}
            icon={Building2}
            isDarkMode={isDarkMode}
            colorClass="green"
          />
          {/* REMOVED: 12h vs 24h Holds metric per user feedback */}
        </div>

        {/* Shift Breakdown */}
        <div
          className={`
            border ${tokens.borders.radius.lg}
            ${tokens.spacing.card.xl}
            ${tokens.spacing.margin.xl}
            ${
              isDarkMode
                ? `${colors.structural.bg.card} ${colors.structural.border.default}`
                : "bg-white border-gray-200"
            }
          `}
        >
          <h2
            className={`
              ${tokens.typography.heading.h2}
              ${tokens.spacing.margin.lg}
              ${isDarkMode ? colors.structural.text.primary : "text-gray-900"}
            `}
          >
            Holds by Shift
          </h2>
          <div className="space-y-4">
            {(["A", "B", "C"] as const).map((shift) => {
              const count = shiftStats[shift];
              const total = shiftStats.A + shiftStats.B + shiftStats.C;
              const percentage = total > 0 ? (count / total) * 100 : 0;

              return (
                <div key={shift} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`
                        ${tokens.typography.heading.h4}
                        ${
                          isDarkMode
                            ? colors.structural.text.primary
                            : "text-gray-900"
                        }
                      `}
                    >
                      Shift {shift}
                    </span>
                    <span
                      className={`
                        ${tokens.typography.heading.h1}
                        ${
                          isDarkMode
                            ? colors.structural.text.primary
                            : "text-gray-900"
                        }
                      `}
                    >
                      {count}
                    </span>
                  </div>
                  <div
                    className={`
                      w-full ${tokens.borders.radius.full} h-6 overflow-hidden
                      ${
                        isDarkMode
                          ? colors.structural.bg.surface
                          : "bg-gray-200"
                      }
                    `}
                  >
                    <div
                      className={`
                        h-6 ${tokens.borders.radius.full}
                        ${tokens.transitions.fast}
                        flex items-center justify-end pr-2
                        ${colors.semantic.scheduled.solid}
                      `}
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 15 && (
                        <span
                          className={`
                            ${tokens.typography.body.small}
                            ${tokens.typography.weight.semibold}
                            text-white
                          `}
                        >
                          {percentage.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per-Firefighter Metrics Table */}
        <div
          className={`
            border ${tokens.borders.radius.lg}
            ${tokens.spacing.card.xl}
            ${
              isDarkMode
                ? `${colors.structural.bg.card} ${colors.structural.border.default}`
                : "bg-white border-gray-200"
            }
          `}
        >
          <h2
            className={`
              ${tokens.typography.heading.h2}
              ${tokens.spacing.margin.lg}
              ${isDarkMode ? colors.structural.text.primary : "text-gray-900"}
            `}
          >
            Holds Per Firefighter
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={
                    isDarkMode ? colors.structural.bg.surface : "bg-gray-100"
                  }
                >
                  <th
                    className={`
                      ${tokens.spacing.section.lg} text-left
                      ${
                        isDarkMode
                          ? colors.structural.text.primary
                          : "text-gray-900"
                      }
                    `}
                  >
                    Name
                  </th>
                  <th
                    className={`
                      ${tokens.spacing.section.lg} text-right
                      ${
                        isDarkMode
                          ? colors.structural.text.primary
                          : "text-gray-900"
                      }
                    `}
                  >
                    Total Holds
                  </th>
                  <th
                    className={`
                      ${tokens.spacing.section.lg} text-right
                      ${
                        isDarkMode
                          ? colors.structural.text.primary
                          : "text-gray-900"
                      }
                    `}
                  >
                    Avg Interval (days)
                  </th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m, index) => (
                  <tr
                    key={m.firefighterId}
                    className={`
                      border-b
                      ${
                        index % 2 === 0
                          ? isDarkMode
                            ? colors.structural.bg.card
                            : "bg-white"
                          : isDarkMode
                          ? colors.structural.bg.surface
                          : "bg-gray-50"
                      }
                      ${
                        isDarkMode
                          ? colors.structural.border.default
                          : "border-gray-200"
                      }
                    `}
                  >
                    <td
                      className={`
                        ${tokens.spacing.section.lg}
                        ${
                          isDarkMode
                            ? colors.structural.text.primary
                            : "text-gray-900"
                        }
                      `}
                    >
                      {m.name}
                    </td>
                    <td
                      className={`
                        ${tokens.spacing.section.lg} text-right
                        ${
                          isDarkMode
                            ? colors.structural.text.primary
                            : "text-gray-900"
                        }
                      `}
                    >
                      {m.totalHolds}
                    </td>
                    <td
                      className={`
                        ${tokens.spacing.section.lg} text-right
                        ${
                          isDarkMode
                            ? colors.structural.text.primary
                            : "text-gray-900"
                        }
                      `}
                    >
                      {m.averageIntervalDays || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
