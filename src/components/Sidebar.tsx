import { useEffect, useState } from 'react';
import { Firefighter, supabase } from '../lib/supabase';
import { ScheduledHold } from '../utils/calendarUtils';
import { Calendar, Clock, Users } from 'lucide-react';
import { getSidebarTheme } from '../utils/sidebarTheme';

interface SidebarProps {
  firefighters: Firefighter[];
  scheduledHolds: ScheduledHold[];
  isDarkMode?: boolean;
}

interface GroupedHold {
  date: string;
  holds: ScheduledHold[];
}

export function Sidebar({ firefighters, scheduledHolds, isDarkMode = true }: SidebarProps) {
  const theme = getSidebarTheme(isDarkMode);
  const [allShiftFirefighters, setAllShiftFirefighters] = useState<Firefighter[]>([]);

  // Load first firefighter from each shift
  useEffect(() => {
    async function loadAllShiftsNextUp() {
      const { data } = await supabase
        .from('firefighters')
        .select('*')
        .eq('is_active', true)
        .order('order_position');

      if (data) {
        // Get first firefighter from each shift
        const shiftA = data.filter(ff => ff.shift === 'A')[0];
        const shiftB = data.filter(ff => ff.shift === 'B')[0];
        const shiftC = data.filter(ff => ff.shift === 'C')[0];
        setAllShiftFirefighters([shiftA, shiftB, shiftC].filter(Boolean));
      }
    }
    loadAllShiftsNextUp();
  }, [firefighters]); // Reload when any firefighter data changes

  const nextUpAllShifts = allShiftFirefighters;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingHolds = scheduledHolds
    .filter(h => {
      const holdDate = new Date(h.hold_date);
      holdDate.setHours(0, 0, 0, 0);
      return holdDate >= today && h.status === 'scheduled';
    })
    .sort((a, b) => new Date(a.hold_date).getTime() - new Date(b.hold_date).getTime());

  const groupedHolds: GroupedHold[] = [];
  const dateMap = new Map<string, ScheduledHold[]>();

  upcomingHolds.forEach(hold => {
    if (!dateMap.has(hold.hold_date)) {
      dateMap.set(hold.hold_date, []);
    }
    dateMap.get(hold.hold_date)!.push(hold);
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
      return 'Today';
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (holdDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    }

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6 sticky top-24 h-fit">
      <div className={`border-2 rounded-2xl shadow-xl overflow-hidden ${theme.container}`}>
        <div className={`border-b-2 p-4 ${theme.header.background}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme.header.iconBadge}`}>
              <Calendar className="text-white" size={20} />
            </div>
            <h2 className={`text-lg font-bold ${theme.header.title}`}>Upcoming Schedule</h2>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {displayedHolds.length === 0 ? (
            <div className="text-center py-6">
              <Clock className={`mx-auto mb-2 ${theme.emptyState.iconColor}`} size={32} />
              <p className={`text-base mb-1 ${theme.emptyState.primaryText}`}>No holds scheduled yet</p>
              <p className={`text-sm ${theme.emptyState.secondaryText}`}>Click a date on the calendar to assign one</p>
            </div>
          ) : (
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wide mb-2 ${theme.sectionTitle}`}>Scheduled Holds</h3>
              <div className="space-y-3">
                {displayedHolds.map(group => (
                  <div
                    key={group.date}
                    className={`border rounded-lg p-3 transition-colors ${theme.holdCard.background} ${theme.holdCard.hover}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${theme.holdCard.dateBadge}`}>
                        {formatDate(group.date)}
                      </span>
                      {group.holds.length > 1 && (
                        <span className={`px-2 py-0.5 text-xs font-bold rounded flex items-center gap-1 ${theme.holdCard.countBadge}`}>
                          <Users size={12} />
                          {group.holds.length}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {group.holds.map(hold => (
                        <div key={hold.id} className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`font-semibold text-sm ${theme.holdCard.firefighterName}`}>{hold.firefighter_name}</p>
                            {hold.fire_station && (
                              <p className={`text-xs ${theme.holdCard.stationText}`}>Station #{hold.fire_station}</p>
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

          {nextUpAllShifts.length > 0 && (
            <div className={`pt-4 border-t-2 ${theme.divider}`}>
              <h3 className={`text-sm font-bold uppercase tracking-wide mb-2 ${theme.sectionTitle}`}>Next Up for Hold (All Shifts)</h3>
              <div className="space-y-2">
                {nextUpAllShifts.map((ff, index) => (
                  <div
                    key={ff.id}
                    className={`rounded-lg p-3 border ${
                      index === 0
                        ? theme.rotation.nextUp.background
                        : theme.rotation.others.background
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0
                            ? theme.rotation.nextUp.numberBadge
                            : theme.rotation.others.numberBadge
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`font-semibold text-sm ${
                              index === 0 ? theme.rotation.nextUp.name : theme.rotation.others.name
                            }`}>
                              {ff.name}
                            </p>
                            <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                              ff.shift === 'A'
                                ? 'bg-red-900/70 text-red-300'
                                : ff.shift === 'B'
                                ? 'bg-blue-900/70 text-blue-300'
                                : 'bg-emerald-900/70 text-emerald-300'
                            }`}>
                              {ff.shift}
                            </span>
                          </div>
                          {ff.fire_station && (
                            <p className={`text-xs ${theme.holdCard.stationText}`}>Station #{ff.fire_station}</p>
                          )}
                        </div>
                      </div>
                      {index === 0 && (
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${theme.rotation.nextUp.badge}`}>
                          Next Up
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {nextUp.length === 0 && displayedHolds.length > 0 && (
            <div className={`pt-4 border-t-2 ${theme.divider}`}>
              <div className="text-center py-6">
                <p className={`text-base mb-1 ${theme.emptyState.primaryText}`}>No one in rotation</p>
                <p className={`text-sm ${theme.emptyState.secondaryText}`}>Add team members to establish rotation order</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
