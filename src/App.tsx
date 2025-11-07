import { useState, useEffect, lazy, Suspense } from 'react';
import { useFirefighters } from './hooks/useFirefighters';
import { useScheduledHolds } from './hooks/useScheduledHolds';
import { useToast } from './hooks/useToast';
import { useDarkMode } from './hooks/useDarkMode';
import { Firefighter, Shift } from './lib/supabase';

// Header component (always visible)
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';

// Core components (always visible)
import { FirefighterList } from './components/FirefighterList';
import { NextUpBar } from './components/NextUpBar';

// Lazy-loaded components (code splitting for performance)
const BigCalendar = lazy(() => import('./components/calendar/BigCalendar').then(m => ({ default: m.BigCalendar })));
const HelpModal = lazy(() => import('./components/HelpModal').then(m => ({ default: m.HelpModal })));
const ActivityLogModal = lazy(() => import('./components/ActivityLogModal').then(m => ({ default: m.ActivityLogModal })));
const CompleteHoldModal = lazy(() => import('./components/CompleteHoldModal').then(m => ({ default: m.CompleteHoldModal })));
const TransferShiftModal = lazy(() => import('./components/TransferShiftModal').then(m => ({ default: m.TransferShiftModal })));
const QuickAddFirefighterModal = lazy(() => import('./components/QuickAddFirefighterModal').then(m => ({ default: m.QuickAddFirefighterModal })));
const BattalionChiefLogin = lazy(() => import('./components/BattalionChiefLogin').then(m => ({ default: m.BattalionChiefLogin })));

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
  const [showLogin, setShowLogin] = useState(false);

  // State: Selected firefighters for modals
  const [selectedFirefighterForCompletion, setSelectedFirefighterForCompletion] = useState<Firefighter | null>(null);
  const [selectedFirefighterForTransfer, setSelectedFirefighterForTransfer] = useState<Firefighter | null>(null);

  const { toasts, showToast } = useToast();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Battalion Chief authentication state
  const [isAdmin, setIsAdmin] = useState(false);

  // Check localStorage for existing auth on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('battalionChiefAuth');
    setIsAdmin(authStatus === 'true');
  }, []);

  // Handle successful Battalion Chief Mode activation
  const handleLoginSuccess = () => {
    setIsAdmin(true);
    showToast('Battalion Chief Mode enabled', 'success');
  };

  // Handle leaving Battalion Chief Mode
  const handleLogout = () => {
    localStorage.removeItem('battalionChiefAuth');
    setIsAdmin(false);
    showToast('Battalion Chief Mode disabled', 'success');
  };

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

  // Battalion Chief access - authenticated users with admin role
  const isAdminMode = isAdmin;

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
        onShowLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
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
          
          <Suspense fallback={
            <div className={`flex items-center justify-center h-96 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              Loading calendar...
            </div>
          }>
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
          </Suspense>
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

      {/* Modal components - Lazy loaded for performance */}
      <Suspense fallback={null}>
        <HelpModal
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
          onMasterReset={() => {}}
          isAdminMode={isAdminMode}
          onShowLogin={() => {
            setShowHelp(false);
            setShowLogin(true);
          }}
          user={null}
        />

        <BattalionChiefLogin
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
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
      </Suspense>

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
        onShowLogin={() => {
          setShowMobileMenu(false);
          setShowLogin(true);
        }}
        onLogout={() => {
          setShowMobileMenu(false);
          handleLogout();
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
