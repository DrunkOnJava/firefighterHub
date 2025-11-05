// FIXED: Integrated AuthContext and LoginModal for proper Supabase authentication
// FIXED: Dark mode now persists to localStorage
// TECHNICAL DEBT: Large component file (266 lines) - consider breaking into smaller components

import { useEffect, useRef, useState } from "react";
import { ActivityLogModal } from "./components/ActivityLogModal";
import { Calendar } from "./components/Calendar";
import { CompleteHoldModal } from "./components/CompleteHoldModal";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { FirefighterList } from "./components/FirefighterList";
import { Header } from "./components/Header";
import { HelpModal } from "./components/HelpModal";
import { KeyboardShortcutsModal } from "./components/KeyboardShortcutsModal";
import { LoginModal } from "./components/LoginModal";
import { MobileNav } from "./components/MobileNav";
import { QuickAddFirefighterModal } from "./components/QuickAddFirefighterModal";
import { Reports } from "./components/Reports";
import { Sidebar } from "./components/Sidebar";
import { ToastContainer } from "./components/Toast";
import { TransferShiftModal } from "./components/TransferShiftModal";
import { UpdateNotification } from "./components/UpdateNotification";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import {
  A11Y,
  GRID_COLS,
  KEYBOARD_SHORTCUTS,
  LAYOUT,
  SCROLL_BEHAVIOR,
} from "./config/constants";
import { useAuth } from "./contexts/AuthContext";
import { useAnnounce } from "./hooks/useAnnounce";
import { useConfirm } from "./hooks/useConfirm";
import { useDarkMode } from "./hooks/useDarkMode";
import { useFirefighters } from "./hooks/useFirefighters";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useScheduledHolds } from "./hooks/useScheduledHolds";
import { useToast } from "./hooks/useToast";
import { Firefighter, HoldDuration, Shift } from "./lib/supabase";
import { getTheme } from "./utils/theme";

type View = "calendar" | "reports";

function App() {
  // FIXED: Using proper Supabase authentication instead of hardcoded password
  const {
    user,
    isAdmin: isAuthenticatedAdmin,
    isLoading: authLoading,
  } = useAuth();

  const [currentView, setCurrentView] = useState<View>("calendar");
  const [showHelp, setShowHelp] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showCompleteHoldModal, setShowCompleteHoldModal] = useState(false);
  const [showTransferShiftModal, setShowTransferShiftModal] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [
    selectedFirefighterForCompletion,
    setSelectedFirefighterForCompletion,
  ] = useState<Firefighter | null>(null);
  const [selectedFirefighterForTransfer, setSelectedFirefighterForTransfer] =
    useState<Firefighter | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  // Default to Shift A
  const [currentShift, setCurrentShift] = useState<Shift>("A");

  // FIXED: Admin mode now based on Supabase authentication
  // Battalion chiefs who are authenticated have admin access
  const isAdminMode = isAuthenticatedAdmin;

  // BEST PRACTICE: Dark mode with localStorage persistence via custom hook
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const { toasts, showToast, hideToast } = useToast();
  const announce = useAnnounce();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const shiftChangeAnnouncedRef = useRef(false);

  // Get theme based on current mode
  const theme = getTheme(isDarkMode);

  // FIXED: Authentication now handled by Supabase Auth
  // Battalion chiefs log in with email/password
  function handleShowLogin() {
    setShowLoginModal(true);
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
    reorderFirefighters,
  } = useFirefighters(showToast, currentShift, confirm);

  const {
    scheduledHolds,
    loading: holdsLoading,
    scheduleHold,
    removeScheduledHold,
    markHoldCompleted,
  } = useScheduledHolds(showToast, currentShift);

  // BEST PRACTICE: Keyboard shortcuts configuration using constants
  const { shortcuts } = useKeyboardShortcuts({
    shortcuts: [
      {
        ...KEYBOARD_SHORTCUTS.SEARCH,
        description: "Focus search bar",
        action: () => {
          searchInputRef.current?.focus();
          searchInputRef.current?.scrollIntoView({
            behavior: SCROLL_BEHAVIOR.SMOOTH,
            block: SCROLL_BEHAVIOR.CENTER,
          });
        },
      },
      {
        ...KEYBOARD_SHORTCUTS.QUICK_ADD,
        description: "Quick add firefighter",
        action: () => {
          if (isAdminMode) {
            setShowQuickAdd(true);
          }
        },
        enabled: isAdminMode,
      },
      {
        ...KEYBOARD_SHORTCUTS.EXPORT,
        description: "Export data",
        action: () => {
          // Trigger export menu - will be implemented when migrating FirefighterList
          console.log("Export shortcut pressed");
        },
      },
      {
        ...KEYBOARD_SHORTCUTS.HELP,
        description: "Show help",
        action: () => setShowHelp(true),
      },
      {
        ...KEYBOARD_SHORTCUTS.SHORTCUTS_MODAL,
        description: "Show keyboard shortcuts",
        action: () => setShowKeyboardShortcuts(true),
      },
      {
        ...KEYBOARD_SHORTCUTS.ESCAPE,
        description: "Close modal",
        action: () => {
          setShowHelp(false);
          setShowActivityLog(false);
          setShowQuickAdd(false);
          setShowCompleteHoldModal(false);
          setShowTransferShiftModal(false);
          setShowKeyboardShortcuts(false);
        },
      },
    ],
  });

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
    duration?: HoldDuration,
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

  // BEST PRACTICE: Announce shift changes for screen readers
  useEffect(() => {
    if (shiftChangeAnnouncedRef.current) {
      announce(`Switched to Shift ${currentShift}`, "polite");
    }
    shiftChangeAnnouncedRef.current = true;
  }, [currentShift, announce]);

  // Show loading state while auth is initializing
  if (authLoading || firefightersLoading) {
    return (
      <LoadingSpinner
        size="xl"
        text={
          authLoading
            ? "Checking authentication..."
            : "Loading Hold List Manager..."
        }
        fullPage
      />
    );
  }

  return (
    <div className={`min-h-screen ${theme.appBackground} ${theme.textPrimary}`}>
      <a href={`#${A11Y.SKIP_LINK_ID}`} className="skip-link">
        Skip to main content
      </a>

      <div className={`max-w-[${LAYOUT.MAX_WIDTH}] mx-auto`}>
        <Header
          onShowHelp={() => setShowHelp(true)}
          onShowActivityLog={() => setShowActivityLog(true)}
          onQuickAddFirefighter={() => setShowQuickAdd(true)}
          onOpenMobileMenu={() => setShowMobileNav(true)}
          isAdminMode={isAdminMode}
          currentShift={currentShift}
          onShiftChange={setCurrentShift}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        <main
          id={A11Y.SKIP_LINK_ID}
          role="main"
          className={`${LAYOUT.PADDING.MOBILE} ${LAYOUT.PADDING.DESKTOP}`}
        >
          {currentView === "calendar" ? (
            <>
              <div
                className={`grid grid-cols-1 xl:grid-cols-12 ${LAYOUT.GRID_GAP.MOBILE} ${LAYOUT.GRID_GAP.DESKTOP} ${LAYOUT.SPACING.SECTION}`}
              >
                <div className={GRID_COLS.CALENDAR}>
                  <section aria-labelledby="calendar-heading">
                    <ErrorBoundary componentName="Calendar">
                      <Calendar
                        firefighters={firefighters}
                        scheduledHolds={scheduledHolds}
                        onScheduleHold={isAdminMode ? scheduleHold : () => {}}
                        onRemoveHold={
                          isAdminMode ? removeScheduledHold : () => {}
                        }
                        onMarkCompleted={
                          isAdminMode ? markHoldCompleted : () => {}
                        }
                        loading={holdsLoading}
                        isAdminMode={isAdminMode}
                        isDarkMode={isDarkMode}
                        currentShift={currentShift}
                      />
                    </ErrorBoundary>
                  </section>
                </div>

                <aside
                  className={GRID_COLS.SIDEBAR}
                  role="complementary"
                  aria-label="Team statistics and information"
                >
                  <ErrorBoundary componentName="Sidebar">
                    <Sidebar
                      firefighters={firefighters}
                      scheduledHolds={scheduledHolds}
                      isDarkMode={isDarkMode}
                      currentShift={currentShift}
                      onNavigate={setCurrentView}
                      isAdminMode={isAdminMode}
                    />
                  </ErrorBoundary>
                </aside>
              </div>

              <div className={LAYOUT.SPACING.SECTION}>
                <section aria-labelledby="roster-heading">
                  <ErrorBoundary componentName="FirefighterList">
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
                      confirmAction={confirm}
                    />
                  </ErrorBoundary>
                </section>
              </div>
            </>
          ) : (
            <ErrorBoundary componentName="Reports">
              <Reports
                firefighters={firefighters}
                holds={scheduledHolds}
                isDarkMode={isDarkMode}
                onNavigate={setCurrentView}
              />
            </ErrorBoundary>
          )}
        </main>
      </div>

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        onMasterReset={masterReset}
        isAdminMode={isAdminMode}
        onShowLogin={handleShowLogin}
        user={user}
      />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          showToast("Battalion Chief mode enabled", "success");
        }}
      />
      <ActivityLogModal
        isOpen={showActivityLog}
        onClose={() => setShowActivityLog(false)}
      />
      <KeyboardShortcutsModal
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
        shortcuts={shortcuts}
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
        onToggleDarkMode={toggleDarkMode}
      />
      <QuickAddFirefighterModal
        isOpen={showQuickAdd}
        currentShift={currentShift}
        onClose={() => setShowQuickAdd(false)}
        onAdd={addFirefighter}
      />

      <div role="alert" aria-live="polite" aria-atomic="true">
        <ToastContainer toasts={toasts} onClose={hideToast} />
      </div>

      {/* Non-blocking confirmation dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
        consequences={confirmState.consequences}
        isDarkMode={isDarkMode}
      />

      {/* Update notification for new app versions */}
      <UpdateNotification />
    </div>
  );
}

export default App;
