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
import { MobileNav } from './components/MobileNav';

// Big Calendar
import { BigCalendar } from './components/calendar/BigCalendar';

// Interactive Roster
import { FirefighterList } from './components/FirefighterList';

// Next Up Bar
import { NextUpBar } from './components/NextUpBar';

function App() {
  // State: Shift
  const [currentShift, setCurrentShift] = useState<Shift>('A');

  // State: View management (reserved for future Reports feature)
  // const [currentView, setCurrentView] = useState<'calendar' | 'reports'>('calendar');

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

  // Admin mode (TEMP: Enabled for testing - will integrate authentication in Phase 6)
  const isAdminMode = true; // TEMP: Enable all features for testing

  // Combine all firefighters and filter for current shift
  const allFirefighters = [...ffA, ...ffB, ...ffC];
  const firefighters = allFirefighters.filter(ff => ff.shift === currentShift);
  const firefightersLoading = loadingA || loadingB || loadingC;

  // Handle loading state
  if (firefightersLoading || holdsLoading) {
    return <div style={{ padding: 20, color: 'var(--text)' }}>Loading...</div>;
  }

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
        onNavigateToReports={() => {}} // TODO: Implement Reports view
        onOpenMobileMenu={() => setShowMobileMenu(true)}
        isAdminMode={isAdminMode}
        currentShift={currentShift}
        onShiftChange={setCurrentShift}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Layout: Calendar + Roster */}
      <div className="layout">
        {/* Calendar Section with Next Up Bar */}
        <section className="calendar card flex flex-col">
          {/* Next Up Bar - Shows all shifts */}
          <NextUpBar
            firefighters={allFirefighters}
            isDarkMode={isDarkMode}
          />
          
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
        {/* Sidebar: Roster */}
        <aside className="sidebar card">
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

      <MobileNav
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        onShowHelp={() => {
          setShowMobileMenu(false);
          setShowHelp(true);
        }}
        onShowActivityLog={() => {
          setShowMobileMenu(false);
          setShowActivityLog(true);
        }}
        onQuickAddFirefighter={() => {
          setShowMobileMenu(false);
          setShowQuickAdd(true);
        }}
        currentShift={currentShift}
        onShiftChange={(shift) => {
          setShowMobileMenu(false);
          setCurrentShift(shift);
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        isAdminMode={isAdminMode}
      />
    </>
  );
}

export default App;
