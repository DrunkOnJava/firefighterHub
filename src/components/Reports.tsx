import {
  ArrowLeft,
  Building2,
  Calendar,
  Download,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Firefighter, supabase } from "../lib/supabase";
import { ScheduledHold } from "../utils/calendarUtils";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
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
  onNavigate?: (view: "calendar" | "reports") => void;
}

export function Reports({
  firefighters,
  holds,
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
    <div className="min-h-screen p-6 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-foreground">
              Fire Department Hold Rotation Analytics
            </h2>
            <p className="text-muted-foreground">
              Comprehensive analytics for hold management
            </p>
          </div>
          <div className="flex items-center gap-3">
            {onNavigate && (
              <Button
                onClick={() => onNavigate("calendar")}
                variant="default"
                size="default"
                title="Return to Calendar"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Back</span>
              </Button>
            )}
            <Button
              onClick={handleExportCSV}
              variant="default"
              size="default"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Export</span>
            </Button>
          </div>
        </div>

        {/* Date Range Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  Date Range Filter:
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-muted-foreground text-sm">From:</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  className="px-3 py-1 border rounded-md bg-background text-foreground border-input focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-muted-foreground text-sm">To:</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  className="px-3 py-1 border rounded-md bg-background text-foreground border-input focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button
                onClick={() => setFilterActive(!filterActive)}
                variant={filterActive ? "default" : "secondary"}
                size="sm"
              >
                {filterActive ? "Filter Active" : "Apply Filter"}
              </Button>
              {filterActive && (
                <Button
                  onClick={() => {
                    setFilterActive(false);
                    setDateRange({ start: "", end: "" });
                  }}
                  variant="secondary"
                  size="sm"
                >
                  Clear Filter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <MetricCard
            title="Total Holds"
            value={filteredHolds.length}
            subtitle="All scheduled holds"
            icon={Calendar}
            colorClass="blue"
          />
          <MetricCard
            title="Top Station"
            value={topStation?.station || "N/A"}
            subtitle={`${topStation?.count || 0} total holds`}
            icon={Building2}
            colorClass="green"
          />
        </div>

        {/* Shift Breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Holds by Shift</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(["A", "B", "C"] as const).map((shift) => {
              const count = shiftStats[shift];
              const total = shiftStats.A + shiftStats.B + shiftStats.C;
              const percentage = total > 0 ? (count / total) * 100 : 0;

              return (
                <div key={shift} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Shift {shift}
                    </span>
                    <span className="text-2xl font-bold text-foreground">
                      {count}
                    </span>
                  </div>
                  <div className="w-full rounded-full h-6 overflow-hidden bg-secondary">
                    <div
                      className="h-6 rounded-full transition-all duration-200 flex items-center justify-end pr-2 bg-primary"
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 15 && (
                        <span className="text-xs font-semibold text-primary-foreground">
                          {percentage.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Per-Firefighter Metrics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Holds Per Firefighter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary">
                    <th className="px-4 py-3 text-left text-foreground font-semibold">
                      Name
                    </th>
                    <th className="px-4 py-3 text-right text-foreground font-semibold">
                      Total Holds
                    </th>
                    <th className="px-4 py-3 text-right text-foreground font-semibold">
                      Avg Interval (days)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((m, index) => (
                    <tr
                      key={m.firefighterId}
                      className={`border-b border-border ${
                        index % 2 === 0 ? "bg-card" : "bg-secondary"
                      }`}
                    >
                      <td className="px-4 py-3 text-foreground whitespace-nowrap">
                        {m.name}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground whitespace-nowrap">
                        {m.totalHolds}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground whitespace-nowrap">
                        {m.averageIntervalDays || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
