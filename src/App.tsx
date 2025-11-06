import { useState } from 'react';
import { useFirefighters } from './hooks/useFirefighters';
import { useScheduledHolds } from './hooks/useScheduledHolds';
import { useToast } from './hooks/useToast';
import { useDarkMode } from './hooks/useDarkMode';
import { Firefighter, Shift } from './lib/supabase';

// Header component
import { Header } from './components/Header';

// Modal components
import { HelpModal } from './components/HelpModal';
import { ActivityLogModal } from './components/ActivityLogModal';
import { CompleteHoldModal } from './components/CompleteHoldModal';
import { TransferShiftModal } from './components/TransferShiftModal';
import { QuickAddFirefighterModal } from './components/QuickAddFirefighterModal';

// Big Calendar
import { BigCalendar } from './components/calendar/BigCalendar';

// Interactive Roster
import { FirefighterList } from './components/FirefighterList';

function App() {
  // State: Shift
  const [currentShift, setCurrentShift] = useState<Shift>('A');

  // State: Modal visibility
  const [showHelp, setShowHelp] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showCompleteHoldModal, setShowCompleteHoldModal] = useState(false);
  const [showTransferShiftModal, setShowTransferShiftModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // State: Selected firefighters for modals
  const [selectedFirefighterForCompletion, setSelectedFirefighterForCompletion] = useState<Firefighter | null>(null);
  const [selectedFirefighterForTransfer, setSelectedFirefighterForTransfer] = useState<Firefighter | null>(null);

  const { toasts, showToast } = useToast();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Load ALL shifts for Next Up section
  const { firefighters: ffA = [], loading: loadingA } = useFirefighters(showToast, 'A');
  const { firefighters: ffB = [], loading: loadingB } = useFirefighters(showToast, 'B');
  const { firefighters: ffC = [], loading: loadingC } = useFirefighters(showToast, 'C');

  // Get CRUD operations from current shift's hook
  const {
    deactivatedFirefighters,
    addFirefighter,
    completeHold,
    deleteFirefighter,
    deactivateFirefighter,
    reactivateFirefighter,
    transferShift,
    resetAll,
    reorderFirefighters,
  } = useFirefighters(showToast, currentShift);

  const {
    scheduledHolds = [],
    loading: holdsLoading,
    scheduleHold,
    removeScheduledHold,
    markHoldCompleted,
  } = useScheduledHolds(showToast, currentShift);

  // Admin mode (will be integrated in Phase 6: Authentication)
  const isAdminMode = false; // Phase 6: Will integrate authentication

  // Combine all firefighters and filter for current shift
  const allFirefighters = [...ffA, ...ffB, ...ffC];
  const firefighters = allFirefighters.filter(ff => ff.shift === currentShift);
  const firefightersLoading = loadingA || loadingB || loadingC;

  // Handle loading state
  if (firefightersLoading || holdsLoading) {
    return <div style={{ padding: 20, color: 'var(--text)' }}>Loading...</div>;
  }

  // Get next up for each shift from their respective loaded data
  const shiftA = ffA.filter(ff => ff.is_available).sort((a, b) => a.order_position - b.order_position)[0];
  const shiftB = ffB.filter(ff => ff.is_available).sort((a, b) => a.order_position - b.order_position)[0];
  const shiftC = ffC.filter(ff => ff.is_available).sort((a, b) => a.order_position - b.order_position)[0];

  // Current shift firefighters (first 20)
  const currentShiftFFs = firefighters
    .filter(ff => ff.shift === currentShift)
    .sort((a, b) => a.order_position - b.order_position)
    .slice(0, 20);

  // Event handlers for modals
  function handleCompleteHoldClick(id: string) {
    const firefighter = firefighters.find((ff) => ff.id === id);
    if (firefighter) {
      setSelectedFirefighterForCompletion(firefighter);
      setShowCompleteHoldModal(true);
    }
  }

  function handleConfirmCompleteHold(
    firefighterId: string,
    holdDate: string,
    newPosition: number,
    station?: string,
    lentToShift?: Shift | null,
    duration?: any,
    startTime?: string
  ) {
    completeHold(
      firefighterId,
      holdDate,
      newPosition,
      station,
      lentToShift,
      duration,
      startTime
    );
    setShowCompleteHoldModal(false);
    setSelectedFirefighterForCompletion(null);
  }

  function handleTransferShiftClick(id: string) {
    const firefighter = firefighters.find((ff) => ff.id === id);
    if (firefighter) {
      setSelectedFirefighterForTransfer(firefighter);
      setShowTransferShiftModal(true);
    }
  }

  function handleConfirmTransferShift(firefighterId: string, newShift: Shift) {
    transferShift(firefighterId, newShift);
    setShowTransferShiftModal(false);
    setSelectedFirefighterForTransfer(null);
  }

  return (
    <>
      {/* Header */}
      <Header
        onShowHelp={() => setShowHelp(true)}
        onShowActivityLog={() => setShowActivityLog(true)}
        onQuickAddFirefighter={() => setShowQuickAdd(true)}
        onOpenMobileMenu={() => setShowMobileMenu(true)}
        isAdminMode={isAdminMode}
        currentShift={currentShift}
        onShiftChange={setCurrentShift}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Layout: Calendar + Roster */}
      <div className="layout">
        {/* Calendar Section */}
        <section className="calendar card">
          <BigCalendar
            firefighters={firefighters}
            scheduledHolds={scheduledHolds}
            onScheduleHold={scheduleHold}
            onRemoveHold={removeScheduledHold}
            onMarkCompleted={markHoldCompleted}
            loading={holdsLoading}
            isAdminMode={isAdminMode}
            isDarkMode={isDarkMode}
            currentShift={currentShift}
          />
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

          {/* Interactive Firefighter List */}
          <FirefighterList
            firefighters={firefighters}
            deactivatedFirefighters={deactivatedFirefighters}
            onAdd={addFirefighter}
            onCompleteHold={handleCompleteHoldClick}
            onDelete={deleteFirefighter}
            onDeactivate={deactivateFirefighter}
            onReactivate={reactivateFirefighter}
            onTransferShift={handleTransferShiftClick}
            onResetAll={resetAll}
            onReorder={reorderFirefighters}
            currentShift={currentShift}
            isAdminMode={isAdminMode}
            isDarkMode={isDarkMode}
          />
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

      {/* Modal components */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        onMasterReset={() => {}}
        isAdminMode={false}
        onShowLogin={() => {}}
        user={null}
      />

      <ActivityLogModal
        isOpen={showActivityLog}
        onClose={() => setShowActivityLog(false)}
      />

      <QuickAddFirefighterModal
        isOpen={showQuickAdd}
        currentShift={currentShift}
        onClose={() => setShowQuickAdd(false)}
        onAdd={addFirefighter}
      />

      <CompleteHoldModal
        isOpen={showCompleteHoldModal}
        firefighter={selectedFirefighterForCompletion}
        totalFirefighters={firefighters.filter((ff) => ff.is_available).length}
        onClose={() => {
          setShowCompleteHoldModal(false);
          setSelectedFirefighterForCompletion(null);
        }}
        onConfirm={handleConfirmCompleteHold}
      />

      <TransferShiftModal
        isOpen={showTransferShiftModal}
        firefighter={selectedFirefighterForTransfer}
        onClose={() => {
          setShowTransferShiftModal(false);
          setSelectedFirefighterForTransfer(null);
        }}
        onConfirm={handleConfirmTransferShift}
      />
    </>
  );
}

export default App;
