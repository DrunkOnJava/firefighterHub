// FIXED: Integrated AuthContext and LoginModal for proper Supabase authentication
// FIXED: Dark mode now persists to localStorage
// TECHNICAL DEBT: Large component file (266 lines) - consider breaking into smaller components

import { useEffect, useRef, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { ActivityLogModal } from "./components/ActivityLogModal";
import { Calendar } from "./components/Calendar";
import { CompleteHoldModal } from "./components/CompleteHoldModal";
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
import { useAnnounce } from "./hooks/useAnnounce";
import { useFirefighters } from "./hooks/useFirefighters";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useScheduledHolds } from "./hooks/useScheduledHolds";
import { useToast } from "./hooks/useToast";
import { Firefighter, HoldDuration, Shift } from "./lib/supabase";

type View = "calendar" | "reports";

function App() {
  // FIXED: Using proper Supabase authentication instead of hardcoded password
  const { user, isAdmin: isAuthenticatedAdmin, isLoading: authLoading } = useAuth();

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

  // FIXED: Dark mode now persists to localStorage (was always resetting to true)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("isDarkMode");
    return saved !== "false"; // Default to true (dark mode) if not set
  });

  const { toasts, showToast, hideToast } = useToast();
  const announce = useAnnounce();
  const shiftChangeAnnouncedRef = useRef(false);

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
  } = useFirefighters(showToast, currentShift);

  const {
    scheduledHolds,
    loading: holdsLoading,
    scheduleHold,
    removeScheduledHold,
    markHoldCompleted,
  } = useScheduledHolds(showToast, currentShift);

  // Keyboard shortcuts configuration
  const { shortcuts } = useKeyboardShortcuts({
    shortcuts: [
      {
        key: "k",
        ctrl: true,
        meta: true,
        description: "Focus search bar",
        action: () => {
          searchInputRef.current?.focus();
          searchInputRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        },
      },
      {
        key: "n",
        ctrl: true,
        meta: true,
        description: "Quick add firefighter",
        action: () => {
          if (isAdminMode) {
            setShowQuickAdd(true);
          }
        },
        enabled: isAdminMode,
      },
      {
        key: "e",
        ctrl: true,
        meta: true,
        description: "Export data",
        action: () => {
          // Trigger export menu - will be implemented when migrating FirefighterList
          console.log("Export shortcut pressed");
        },
      },
      {
        key: "h",
        ctrl: true,
        meta: true,
        description: "Show help",
        action: () => setShowHelp(true),
      },
      {
        key: "?",
        description: "Show keyboard shortcuts",
        action: () => setShowKeyboardShortcuts(true),
      },
      {
        key: "Escape",
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

  // Persist dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem("isDarkMode", String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    if (shiftChangeAnnouncedRef.current) {
      announce(`Switched to Shift ${currentShift}`, "polite");
    }
    shiftChangeAnnouncedRef.current = true;
  }, [currentShift, announce]);

  // Show loading state while auth is initializing
  if (authLoading || firefightersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">
            {authLoading ? "Checking authentication..." : "Loading Hold List Manager..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${
        isDarkMode
          ? "from-gray-900 via-gray-900 to-gray-800 text-white"
          : "from-slate-50 via-slate-50 to-slate-100 text-slate-900"
      }`}
    >
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

        <main
          id="main-content"
          role="main"
          className="px-3 sm:px-6 py-4 sm:py-8"
        >
          {currentView === "calendar" ? (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-8 mb-8">
                <div className="xl:col-span-9">
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
                  className="xl:col-span-3"
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

              <div className="mb-8">
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
        isDarkMode={isDarkMode}
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
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
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

      {/* Update notification for new app versions */}
      <UpdateNotification />
    </div>
  );
}

export default App;
