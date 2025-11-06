import { useState } from 'react';
import { useFirefighters } from './hooks/useFirefighters';
import { useScheduledHolds } from './hooks/useScheduledHolds';
import { useToast } from './hooks/useToast';
import { Shift } from './lib/supabase';
import { getMonthDays, attachScheduledHolds } from './utils/calendarUtils';

function App() {
  const [currentShift, setCurrentShift] = useState<Shift>('A');
  const [currentDate] = useState(new Date());
  const { toasts, showToast } = useToast();

  // Load ALL shifts for Next Up section
  const { firefighters: ffA = [], loading: loadingA } = useFirefighters(showToast, 'A');
  const { firefighters: ffB = [], loading: loadingB } = useFirefighters(showToast, 'B');
  const { firefighters: ffC = [], loading: loadingC } = useFirefighters(showToast, 'C');

  const {
    scheduledHolds = [],
    loading: holdsLoading,
  } = useScheduledHolds(showToast, currentShift);

  // Combine all firefighters and filter for current shift
  const allFirefighters = [...ffA, ...ffB, ...ffC];
  const firefighters = allFirefighters.filter(ff => ff.shift === currentShift);
  const firefightersLoading = loadingA || loadingB || loadingC;

  // Handle loading state
  if (firefightersLoading || holdsLoading) {
    return <div style={{ padding: 20, color: 'var(--text)' }}>Loading...</div>;
  }

  // Get calendar data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  let calendarDays = [];
  try {
    const monthDays = getMonthDays(year, month);
    calendarDays = attachScheduledHolds(monthDays, scheduledHolds, firefighters);
  } catch (error) {
    console.error('Calendar error:', error);
    calendarDays = [];
  }

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Get next up for each shift from their respective loaded data
  const shiftA = ffA.filter(ff => ff.is_available).sort((a, b) => a.order_position - b.order_position)[0];
  const shiftB = ffB.filter(ff => ff.is_available).sort((a, b) => a.order_position - b.order_position)[0];
  const shiftC = ffC.filter(ff => ff.is_available).sort((a, b) => a.order_position - b.order_position)[0];

  // Current shift firefighters (first 20)
  const currentShiftFFs = firefighters
    .filter(ff => ff.shift === currentShift)
    .sort((a, b) => a.order_position - b.order_position)
    .slice(0, 20);

  return (
    <>
      {/* Header */}
      <header>
        <div className="brand">
          <div className="logo" />
          <div>
            <div style={{ fontWeight: 800 }}>Hold List Manager</div>
            <span className="subtitle">Single-view — calendar + 20-roster sidebar (no scroll)</span>
          </div>
        </div>
        <div className="toolbar">
          <span style={{ cursor: 'pointer' }}>Activity</span>
          <span>•</span>
          <span style={{ cursor: 'pointer' }}>Light</span>
          <span>•</span>
          <span style={{ cursor: 'pointer' }}>Help</span>
          <div className="shift-badges">
            <span className="badge circle" title="Shift A" />
            <span className="badge square" title="Shift B" />
            <span className="badge diamond" title="Shift C" />
          </div>
        </div>
      </header>

      {/* Main Layout: Calendar + Roster */}
      <div className="layout">
        {/* Calendar Section */}
        <section className="calendar card">
          <div className="cal-head">
            <div className="cal-title">Hold Calendar</div>
            <div style={{ opacity: .85 }}>{monthName}</div>
            <div className="cal-shift">Shift {currentShift}</div>
          </div>

          <div className="grid">
            {/* Weekday Headers */}
            <div className="dow">
              <span>Sunday</span>
              <span>Monday</span>
              <span>Tuesday</span>
              <span>Wednesday</span>
              <span>Thursday</span>
              <span>Friday</span>
              <span>Saturday</span>
            </div>

            {/* Calendar Cells (6 rows x 7 days) */}
            <div className="cells">
              {calendarDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`cell ${!day.isCurrentMonth ? 'muted' : ''} ${day.isToday ? 'today' : ''}`}
                >
                  <span className="num">{day.dayNumber}</span>
                  {/* Event pills would go here */}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="legend">
            <span><span className="sw blue" /> Scheduled</span>
            <span><span className="sw green" /> Completed</span>
            <span><span className="sw red" /> Today</span>
          </div>
        </section>

        {/* Sidebar: Next Up + Roster */}
        <aside className="sidebar card">
          {/* Next Up Cards */}
          <div className="nextup">
            {shiftA && (
              <div className="chip">
                <span className="mini circle" />
                <b>A: {shiftA.name.split(' ').map(n => n[0]).join('. ')}.</b>
                <span className="meta">Stn #{shiftA.fire_station || '?'}</span>
              </div>
            )}
            {shiftB && (
              <div className="chip">
                <span className="mini square" />
                <b>B: {shiftB.name.split(' ').map(n => n[0]).join('. ')}.</b>
                <span className="meta">Stn #{shiftB.fire_station || '?'}</span>
              </div>
            )}
            {shiftC && (
              <div className="chip">
                <span className="mini diamond" />
                <b>C: {shiftC.name.split(' ').map(n => n[0]).join('. ')}.</b>
                <span className="meta">Stn #{shiftC.fire_station || '?'}</span>
              </div>
            )}
          </div>

          {/* Roster Table - 20 Rows */}
          <div className="roster">
            <div className="roster-head">
              <div>Firefighter Roster ({currentShiftFFs.length})</div>
              <div style={{ textAlign: 'center' }}>Station</div>
              <div style={{ textAlign: 'right' }}>Shift</div>
            </div>

            <div className="rows">
              {currentShiftFFs.map((ff) => (
                <div key={ff.id} className="row">
                  <div className="name">{ff.name}</div>
                  <div className="station">
                    <span className="tag">#{ff.fire_station || '?'}</span>
                  </div>
                  <div className="shifts">
                    {ff.shift === 'A' && <span className="mini circle" title="A" />}
                    {ff.shift === 'B' && <span className="mini square" title="B" />}
                    {ff.shift === 'C' && <span className="mini diamond" title="C" />}
                  </div>
                </div>
              ))}

              {/* Fill empty rows if less than 20 */}
              {Array.from({ length: Math.max(0, 20 - currentShiftFFs.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="row" style={{ opacity: 0.3 }}>
                  <div className="name">—</div>
                  <div className="station"><span className="tag">—</span></div>
                  <div className="shifts" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
          {toasts.map(toast => (
            <div key={toast.id} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '8px',
              color: 'var(--text)'
            }}>
              {toast.message}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
