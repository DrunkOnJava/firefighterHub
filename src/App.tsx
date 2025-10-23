// TECHNICAL DEBT: This file has several critical architectural issues that need addressing:
// 1. AuthContext and LoginModal exist but are never used - dead code that should be integrated or removed
// 2. Uses hardcoded password instead of proper Supabase authentication
// 3. Dark mode preference not persisted to localStorage (always resets to true)
// 4. Admin mode stored in localStorage is insecure (client-side only, easily bypassed)
// 5. Large component file (266 lines) - consider breaking into smaller components

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
import { ToastContainer } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { useFirefighters } from './hooks/useFirefighters';
import { useScheduledHolds } from './hooks/useScheduledHolds';
import { useToast } from './hooks/useToast';
import { useAnnounce } from './hooks/useAnnounce';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// CRITICAL SECURITY ISSUE: Hardcoded password - move to environment variable
// RECOMMENDATION: Use proper Supabase auth with AuthContext (already exists but unused)
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Firerescue';

function App() {
  const [showHelp, setShowHelp] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showCompleteHoldModal, setShowCompleteHoldModal] = useState(false);
  const [showTransferShiftModal, setShowTransferShiftModal] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [selectedFirefighterForCompletion, setSelectedFirefighterForCompletion] = useState<Firefighter | null>(null);
  const [selectedFirefighterForTransfer, setSelectedFirefighterForTransfer] = useState<Firefighter | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  // TECHNICAL DEBT: Default shift hardcoded to 'C' - should be configurable or persist user preference
  const [currentShift, setCurrentShift] = useState<Shift>('C');

  // ISSUE: Client-side admin mode is insecure - anyone can set localStorage.setItem('isAdminMode', 'true')
  // RECOMMENDATION: Replace with server-side auth using the existing AuthContext
  const [isAdminMode, setIsAdminMode] = useState(() => {
    const saved = localStorage.getItem('isAdminMode');
    return saved === 'true';
  });

  // FIXED: Dark mode now persists to localStorage (was always resetting to true)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved !== 'false'; // Default to true (dark mode) if not set
  });

  const { toasts, showToast, hideToast } = useToast();
  const announce = useAnnounce();
  const shiftChangeAnnouncedRef = useRef(false);

  // CRITICAL SECURITY ISSUE: Password comparison in client-side code
  // This provides NO real security - anyone can read this password from the source code
  // RECOMMENDATION: Use Supabase authentication or at minimum hash comparison
  function handleToggleAdminMode(password: string): boolean {
    if (isAdminMode) {
      setIsAdminMode(false);
      localStorage.setItem('isAdminMode', 'false');
      showToast('Admin mode disabled', 'info');
      return true;
    }

    // SECURITY CRITICAL: Hardcoded password check - never do this in production!
    if (password === ADMIN_PASSWORD) {
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

  // Keyboard shortcuts configuration
  const { shortcuts } = useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'k',
        ctrl: true,
        meta: true,
        description: 'Focus search bar',
        action: () => {
          searchInputRef.current?.focus();
          searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      },
      {
        key: 'n',
        ctrl: true,
        meta: true,
        description: 'Quick add firefighter',
        action: () => {
          if (isAdminMode) {
            setShowQuickAdd(true);
          }
        },
        enabled: isAdminMode
      },
      {
        key: 'e',
        ctrl: true,
        meta: true,
        description: 'Export data',
        action: () => {
          // Trigger export menu - will be implemented when migrating FirefighterList
          console.log('Export shortcut pressed');
        }
      },
      {
        key: 'h',
        ctrl: true,
        meta: true,
        description: 'Show help',
        action: () => setShowHelp(true)
      },
      {
        key: '?',
        description: 'Show keyboard shortcuts',
        action: () => setShowKeyboardShortcuts(true)
      },
      {
        key: 'Escape',
        description: 'Close modal',
        action: () => {
          setShowHelp(false);
          setShowActivityLog(false);
          setShowQuickAdd(false);
          setShowCompleteHoldModal(false);
          setShowTransferShiftModal(false);
          setShowKeyboardShortcuts(false);
        }
      }
    ]
  });

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


  // Persist dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('isDarkMode', String(isDarkMode));
  }, [isDarkMode]);

  // ISSUE: Missing 'announce' in dependency array could cause stale closure
  // The announce function is stable from useAnnounce, but ESLint will warn about this
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
                <ErrorBoundary componentName="Calendar" resetKeys={[currentShift]}>
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
                </ErrorBoundary>
              </section>
            </div>

            <aside className="xl:col-span-3" role="complementary" aria-label="Team statistics and information">
              <ErrorBoundary componentName="Sidebar" resetKeys={[firefighters.length]}>
                <Sidebar
                  firefighters={firefighters}
                  scheduledHolds={scheduledHolds}
                  isDarkMode={isDarkMode}
                />
              </ErrorBoundary>
            </aside>
          </div>

          <div className="mb-8">
            <section aria-labelledby="roster-heading">
              <ErrorBoundary componentName="FirefighterList" resetKeys={[currentShift, firefighters.length]}>
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
                searchInputRef={searchInputRef}
              />
              </ErrorBoundary>
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
      <KeyboardShortcutsModal
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
        shortcuts={shortcuts}
        isDarkMode={isDarkMode}
      />
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

      <div role="alert" aria-live="polite" aria-atomic="true">
        <ToastContainer
          toasts={toasts}
          onClose={hideToast}
        />
      </div>
    </div>
  );
}

export default App;
