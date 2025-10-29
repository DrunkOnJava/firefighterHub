import { useState, useEffect } from 'react';
import { Firefighter, supabase } from '../lib/supabase';
import { ScheduledHold } from '../utils/calendarUtils';
import {
  calculateHoldsPerFirefighter,
  // calculateHoldsByStation, // Removed - not used
  calculateHoldsByShift,
  // calculateHoldsByDuration, // Removed - per user feedback
  // getFirefighterWithMostHolds, // Removed - metric removed per user feedback
  getStationWithMostHolds,
  // calculateCompletionRate, // Removed - per user feedback
  // calculateAverageHoldDuration, // Removed - per user feedback
  getHoldsInDateRange,
  // calculateTotalHoursWorked, // Removed - hours worked metric removed per user feedback
} from '../utils/metricsCalculations';
import { MetricCard } from './MetricCard';
import {
  Calendar,
  // CheckCircle, // Removed - Completed Holds metric removed per user feedback
  // Clock, // Removed - Avg Duration metric removed per user feedback
  Building2,
  Download,
  Filter,
  ArrowLeft,
} from 'lucide-react';

interface ReportsProps {
  firefighters: Firefighter[];
  holds: ScheduledHold[];
  isDarkMode: boolean;
  onNavigate?: (view: 'calendar' | 'reports') => void;
}

export function Reports({ firefighters, holds, isDarkMode, onNavigate }: ReportsProps) {
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: '',
    end: '',
  });
  const [filterActive, setFilterActive] = useState(false);
  const [allHolds, setAllHolds] = useState<ScheduledHold[]>([]);

  // Fetch ALL holds across all shifts for comparison metrics
  useEffect(() => {
    let mounted = true;

    async function fetchAllHolds() {
      try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 3, 0);

        const startStr = startOfMonth.toISOString().split('T')[0];
        const endStr = endOfMonth.toISOString().split('T')[0];

        const { data, error } = await supabase
          .from('scheduled_holds')
          .select('*')
          // Don't filter by shift - get ALL holds
          .gte('hold_date', startStr)
          .lte('hold_date', endStr)
          .order('hold_date');

        if (error) {
          console.error('Error fetching all holds:', error);
          // Fall back to using the holds prop if fetch fails
          if (mounted) setAllHolds(holds);
          return;
        }

        if (mounted) {
          setAllHolds(data || []);
        }
      } catch (error) {
        console.error('Error fetching all holds:', error);
        // Fall back to using the holds prop if fetch fails
        if (mounted) setAllHolds(holds);
      }
    }

    fetchAllHolds();

    // Subscribe to real-time updates for all shifts
    const channel = supabase
      .channel('all_scheduled_holds_reports')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scheduled_holds',
        },
        () => {
          console.log('🔄 Holds changed, refreshing all holds for reports');
          fetchAllHolds();
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Reports: Real-time subscription error');
        } else if (status === 'SUBSCRIBED') {
          console.log('✅ Reports: Real-time subscription active');
        }
      });

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
      console.log('🛑 Reports: Unsubscribed from real-time updates');
    };
  }, [holds]);

  // Apply date range filter if active
  const filteredHolds = filterActive && dateRange.start && dateRange.end
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
    const headers = [
      'Firefighter',
      'Total Holds',
      'Avg Interval (days)',
    ];

    const rows = metrics.map(m => [
      m.name,
      m.totalHolds,
      m.averageIntervalDays,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hold-metrics-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const secondaryTextClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const inputBgClass = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const inputBorderClass = isDarkMode ? 'border-gray-600' : 'border-gray-300';
  const inputTextClass = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className={`${bgClass} min-h-screen p-6 transition-colors`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${textClass} mb-2`}>
              Hold Metrics Dashboard
            </h1>
            <p className={secondaryTextClass}>
              Comprehensive analytics for hold management
            </p>
          </div>
          <div className="flex items-center gap-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate('calendar')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors focus-ring"
                title="Return to Calendar"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus-ring"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className={`${cardBgClass} ${borderClass} border rounded-lg p-4 mb-6`}>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter size={18} className={secondaryTextClass} />
              <span className={`font-medium ${textClass}`}>Date Range Filter:</span>
            </div>
            <div className="flex items-center gap-2">
              <label className={secondaryTextClass}>From:</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className={`px-3 py-1 ${inputBgClass} ${inputBorderClass} ${inputTextClass} border rounded focus-ring`}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className={secondaryTextClass}>To:</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className={`px-3 py-1 ${inputBgClass} ${inputBorderClass} ${inputTextClass} border rounded focus-ring`}
              />
            </div>
            <button
              onClick={() => setFilterActive(!filterActive)}
              className={`px-4 py-2 rounded transition-colors focus-ring ${
                filterActive
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {filterActive ? 'Filter Active' : 'Apply Filter'}
            </button>
            {filterActive && (
              <button
                onClick={() => {
                  setFilterActive(false);
                  setDateRange({ start: '', end: '' });
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors focus-ring"
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
            value={topStation?.station || 'N/A'}
            subtitle={`${topStation?.count || 0} total holds`}
            icon={Building2}
            isDarkMode={isDarkMode}
            colorClass="green"
          />
          {/* REMOVED: 12h vs 24h Holds metric per user feedback */}
        </div>

        {/* Shift Breakdown */}
        <div className={`${cardBgClass} ${borderClass} border rounded-lg p-6 mb-6`}>
          <h2 className={`text-xl font-semibold ${textClass} mb-4`}>
            Holds by Shift
          </h2>
          <div className="space-y-4">
            {(['A', 'B', 'C'] as const).map(shift => {
              const count = shiftStats[shift];
              const total = shiftStats.A + shiftStats.B + shiftStats.C;
              const percentage = total > 0 ? (count / total) * 100 : 0;

              return (
                <div key={shift} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-semibold ${textClass}`}>
                      Shift {shift}
                    </span>
                    <span className={`text-2xl font-bold ${textClass}`}>
                      {count}
                    </span>
                  </div>
                  <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-6 overflow-hidden`}>
                    <div
                      className="bg-blue-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 15 && (
                        <span className="text-xs font-semibold text-white">
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
        <div className={`${cardBgClass} ${borderClass} border rounded-lg p-6`}>
          <h2 className={`text-xl font-semibold ${textClass} mb-4`}>
            Holds Per Firefighter
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <th className={`p-3 text-left ${textClass}`}>Name</th>
                  <th className={`p-3 text-right ${textClass}`}>Total Holds</th>
                  <th className={`p-3 text-right ${textClass}`}>Avg Interval (days)</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m, index) => (
                  <tr
                    key={m.firefighterId}
                    className={`${
                      index % 2 === 0
                        ? isDarkMode
                          ? 'bg-gray-800'
                          : 'bg-white'
                        : isDarkMode
                        ? 'bg-gray-750'
                        : 'bg-gray-50'
                    } ${borderClass} border-b`}
                  >
                    <td className={`p-3 ${textClass}`}>{m.name}</td>
                    <td className={`p-3 text-right ${textClass}`}>{m.totalHolds}</td>
                    <td className={`p-3 text-right ${textClass}`}>
                      {m.averageIntervalDays || 'N/A'}
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
