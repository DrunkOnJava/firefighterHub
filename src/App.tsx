import { useEffect, useState, useRef } from 'react';
import { Shift, Firefighter } from './lib/supabase';
import { Calendar } from './components/Calendar';
import { FirefighterList } from './components/FirefighterList';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HelpModal } from './components/HelpModal';
import { ActivityLogModal } from './components/ActivityLogModal';
import { CompleteHoldModal } from './components/CompleteHoldModal';
import { TransferShiftModal } from './components/TransferShiftModal';
import { MobileNav } from './components/MobileNav';
import { QuickAddFirefighterModal } from './components/QuickAddFirefighterModal';
import { Toast } from './components/Toast';
import { useFirefighters } from './hooks/useFirefighters';
import { useScheduledHolds } from './hooks/useScheduledHolds';
import { useToast } from './hooks/useToast';
import { useAnnounce } from './hooks/useAnnounce';

function App() {
  const [showHelp, setShowHelp] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showCompleteHoldModal, setShowCompleteHoldModal] = useState(false);
  const [showTransferShiftModal, setShowTransferShiftModal] = useState(false);
  const [selectedFirefighterForCompletion, setSelectedFirefighterForCompletion] = useState<Firefighter | null>(null);
  const [selectedFirefighterForTransfer, setSelectedFirefighterForTransfer] = useState<Firefighter | null>(null);
  const [currentShift, setCurrentShift] = useState<Shift>('C');
  const [isAdminMode, setIsAdminMode] = useState(() => {
    const saved = localStorage.getItem('isAdminMode');
    return saved === 'true';
  });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toast, showToast, hideToast } = useToast();
  const announce = useAnnounce();
  const shiftChangeAnnouncedRef = useRef(false);

  function handleToggleAdminMode(password: string): boolean {
    if (isAdminMode) {
      setIsAdminMode(false);
      localStorage.setItem('isAdminMode', 'false');
      showToast('Admin mode disabled', 'info');
      return true;
    }

    if (password === 'Firerescue') {
      setIsAdminMode(true);
      localStorage.setItem('isAdminMode', 'true');
      showToast('Admin mode enabled', 'success');
      return true;
    }

    return false;
  }

  const {
    firefighters,
    deactivatedFirefighters,
    loading: firefightersLoading,
    addFirefighter,
    completeHold,
    deleteFirefighter,
    deactivateFirefighter,
    reactivateFirefighter,
    transferShift,
    resetAll,
    masterReset,
    reorderFirefighters
  } = useFirefighters(showToast, currentShift);

  const {
    scheduledHolds,
    loading: holdsLoading,
    scheduleHold,
    removeScheduledHold,
    markHoldCompleted
  } = useScheduledHolds(showToast, currentShift);

  function handleCompleteHoldClick(id: string) {
    const firefighter = firefighters.find(ff => ff.id === id);
    if (firefighter) {
      setSelectedFirefighterForCompletion(firefighter);
      setShowCompleteHoldModal(true);
    }
  }

  function handleConfirmCompleteHold(firefighterId: string, holdDate: string, station?: string) {
    completeHold(firefighterId, holdDate, station);
    setShowCompleteHoldModal(false);
    setSelectedFirefighterForCompletion(null);
  }

  function handleTransferShiftClick(id: string) {
    const firefighter = firefighters.find(ff => ff.id === id);
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


  useEffect(() => {
    if (shiftChangeAnnouncedRef.current) {
      announce(`Switched to Shift ${currentShift}`, 'polite');
    }
    shiftChangeAnnouncedRef.current = true;
  }, [currentShift, announce]);

  if (firefightersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading Hold List Manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${
      isDarkMode
        ? 'from-gray-900 via-gray-900 to-gray-800 text-white'
        : 'from-slate-50 via-slate-50 to-slate-100 text-slate-900'
    }`}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="max-w-[1920px] mx-auto">
        <Header
          onShowHelp={() => setShowHelp(true)}
          onShowActivityLog={() => setShowActivityLog(true)}
          onQuickAddFirefighter={() => setShowQuickAdd(true)}
          onOpenMobileMenu={() => setShowMobileNav(true)}
          isAdminMode={isAdminMode}
          currentShift={currentShift}
          onShiftChange={setCurrentShift}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        <main id="main-content" role="main" className="px-3 sm:px-6 py-4 sm:py-8">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-8 mb-8">
            <div className="xl:col-span-9">
              <section aria-labelledby="calendar-heading">
                <Calendar
                firefighters={firefighters}
                scheduledHolds={scheduledHolds}
                onScheduleHold={isAdminMode ? scheduleHold : () => {}}
                onRemoveHold={isAdminMode ? removeScheduledHold : () => {}}
                onMarkCompleted={isAdminMode ? markHoldCompleted : () => {}}
                loading={holdsLoading}
                isAdminMode={isAdminMode}
                isDarkMode={isDarkMode}
                currentShift={currentShift}
              />
              </section>
            </div>

            <aside className="xl:col-span-3" role="complementary" aria-label="Team statistics and information">
              <Sidebar
                firefighters={firefighters}
                scheduledHolds={scheduledHolds}
                isDarkMode={isDarkMode}
              />
            </aside>
          </div>

          <div className="mb-8">
            <section aria-labelledby="roster-heading">
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
            </section>
          </div>
        </main>
      </div>

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        onMasterReset={masterReset}
        isAdminMode={isAdminMode}
        onToggleAdminMode={handleToggleAdminMode}
      />
      <ActivityLogModal isOpen={showActivityLog} onClose={() => setShowActivityLog(false)} />
      <CompleteHoldModal
        isOpen={showCompleteHoldModal}
        firefighter={selectedFirefighterForCompletion}
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
        isOpen={showMobileNav}
        onClose={() => setShowMobileNav(false)}
        onShowHelp={() => {
          setShowMobileNav(false);
          setShowHelp(true);
        }}
        onShowActivityLog={() => {
          setShowMobileNav(false);
          setShowActivityLog(true);
        }}
        onQuickAddFirefighter={() => {
          setShowMobileNav(false);
          setShowQuickAdd(true);
        }}
        isAdminMode={isAdminMode}
        currentShift={currentShift}
        onShiftChange={setCurrentShift}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      <QuickAddFirefighterModal
        isOpen={showQuickAdd}
        currentShift={currentShift}
        onClose={() => setShowQuickAdd(false)}
        onAdd={addFirefighter}
      />

      {toast && (
        <div role="alert" aria-live="polite" aria-atomic="true">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        </div>
      )}
    </div>
  );
}

export default App;
