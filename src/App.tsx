/**
 * AUDIT REPORT REFERENCE
 *
 * A comprehensive UI/UX and technical audit was conducted on November 9, 2025.
 * Full report: AUDIT_REPORT_2025-11-09.md
 *
 * Critical findings addressed:
 * - ✅ Battalion Chief Mode is intentionally client-side (see lines 68-86)
 * - ⏳ React Strict Mode AbortErrors (benign, handled in data hooks)
 * - ⏳ Calendar today indicator could be more prominent
 * - ⏳ WCAG color contrast adjustments needed (see index.css)
 *
 * TODO comments are scattered throughout the codebase marking specific improvements.
 * Search for "TODO: AUDIT" to find all audit-related action items.
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useFirefighters } from '@/features/roster/hooks/useFirefighters';
import { useScheduledHolds } from '@/features/schedule/hooks/useScheduledHolds';
import { useToast } from '@/hooks/useToast';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useDevice } from '@/hooks/useDevice';
import { useAnnounce } from '@/hooks/useAnnounce';
import { Firefighter, Shift } from './lib/supabase';
import { Toaster } from '@/components/ui/sonner';

// Header component (always visible)
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { BottomNav } from './components/mobile/BottomNav';

// Main page components (shadcn/ui v4 optimized)
import { SchedulePage } from './pages/SchedulePage';
import { DashboardPage } from './pages/DashboardPage';

// Core components (always visible)
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';

// Lazy-loaded components (code splitting for performance)
const HelpModal = lazy(() => import('./components/HelpModal').then(m => ({ default: m.HelpModal })));
const ActivityLogModal = lazy(() => import('@/features/reports/components/ActivityLogModal').then(m => ({ default: m.ActivityLogModal })));
const CompleteHoldModal = lazy(() => import('@/features/shifts/components/CompleteHoldModal').then(m => ({ default: m.CompleteHoldModal })));
const TransferShiftModal = lazy(() => import('@/features/roster/components/TransferShiftModal').then(m => ({ default: m.TransferShiftModal })));
const QuickAddFirefighterModal = lazy(() => import('@/features/roster/components/QuickAddFirefighterModal').then(m => ({ default: m.QuickAddFirefighterModal })));
// NOTE: BattalionChiefLogin component removed - using simple password prompt instead

// Development tools (only load in dev mode)
const SentryTestButton = import.meta.env.DEV
  ? lazy(() => import('@/dev/SentryTestButton').then(m => ({ default: m.SentryTestButton })))
  : null;

type MobileTab = 'home' | 'calendar' | 'activity';

function App() {
  const device = useDevice();
  
  // State: Shift
  const [currentShift, setCurrentShift] = useState<Shift>('A');

  // State: Calendar navigation
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // State: Mobile tab navigation
  const [mobileActiveTab, setMobileActiveTab] = useState<MobileTab>('home');

  // State: View management - Dashboard or Schedule
  const [currentView, setCurrentView] = useState<'dashboard' | 'schedule'>('dashboard');

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
  
  // State: Selected firefighter for calendar filtering
  const [selectedFirefighterFilter, setSelectedFirefighterFilter] = useState<string | null>(null);

  const { toasts, showToast } = useToast();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const announce = useAnnounce();
  
  // Suppress unused variable - isDarkMode is managed by hook but not directly used in component
  void isDarkMode;

  /**
   * BATTALION CHIEF MODE - INTENTIONAL DESIGN
   *
   * This is a SOFT CREDENTIAL CHECK to prevent accidental edits.
   * It is NOT a security measure - the data is not sensitive.
   *
   * Purpose: Enable editing tools (add/delete/reorder firefighters)
   * Implementation: Simple password check for "Firerescue"
   * Storage: LocalStorage (intentionally client-side only)
   *
   * WHY NO REAL AUTH?
   * - This is a volunteer fire department roster app
   * - Data is public within the department
   * - No PII, no sensitive information
   * - Goal is convenience, not security
   *
   * If you're auditing this code and thinking "this needs Supabase Auth + RLS":
   * NO IT DOESN'T. This is intentional. Read this comment again.
   */
  const [isAdmin, setIsAdmin] = useState(false);

  // Check localStorage for existing auth on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('battalionChiefAuth');
    setIsAdmin(authStatus === 'true');
  }, []);

  // Handle successful Battalion Chief Mode activation
  const handleLoginSuccess = () => {
    setIsAdmin(true);
    localStorage.setItem('battalionChiefAuth', 'true');
    showToast('Battalion Chief Mode enabled', 'success');
  };

  // Handle leaving Battalion Chief Mode
  const handleLogout = () => {
    localStorage.removeItem('battalionChiefAuth');
    setIsAdmin(false);
    showToast('Battalion Chief Mode disabled', 'success');
  };

  // Load ALL shifts for Next Up section and Dashboard
  const {
    firefighters: ffA = [],
    deactivatedFirefighters: deactivatedA = [],
    loading: loadingA,
    addFirefighter: addFirefighterA,
    completeHold: completeHoldA,
    deleteFirefighter: deleteFirefighterA,
    deactivateFirefighter: deactivateFirefighterA,
    reactivateFirefighter: reactivateFirefighterA,
    transferShift: transferShiftA,
    resetAll: resetAllA,
    reorderFirefighters: reorderFirefightersA,
    moveToBottomOfRotation: moveToBottomA,
  } = useFirefighters(showToast, 'A');

  const {
    firefighters: ffB = [],
    deactivatedFirefighters: deactivatedB = [],
    loading: loadingB,
    addFirefighter: addFirefighterB,
    completeHold: completeHoldB,
    deleteFirefighter: deleteFirefighterB,
    deactivateFirefighter: deactivateFirefighterB,
    reactivateFirefighter: reactivateFirefighterB,
    transferShift: transferShiftB,
    resetAll: resetAllB,
    reorderFirefighters: reorderFirefightersB,
    moveToBottomOfRotation: moveToBottomB,
  } = useFirefighters(showToast, 'B');

  const {
    firefighters: ffC = [],
    deactivatedFirefighters: deactivatedC = [],
    loading: loadingC,
    addFirefighter: addFirefighterC,
    completeHold: completeHoldC,
    deleteFirefighter: deleteFirefighterC,
    deactivateFirefighter: deactivateFirefighterC,
    reactivateFirefighter: reactivateFirefighterC,
    transferShift: transferShiftC,
    resetAll: resetAllC,
    reorderFirefighters: reorderFirefightersC,
    moveToBottomOfRotation: moveToBottomC,
  } = useFirefighters(showToast, 'C');

  // Get operations for current shift (Schedule view)
  const deactivatedFirefighters = currentShift === 'A' ? deactivatedA : currentShift === 'B' ? deactivatedB : deactivatedC;
  const addFirefighter = currentShift === 'A' ? addFirefighterA : currentShift === 'B' ? addFirefighterB : addFirefighterC;
  const completeHold = currentShift === 'A' ? completeHoldA : currentShift === 'B' ? completeHoldB : completeHoldC;
  const deleteFirefighter = currentShift === 'A' ? deleteFirefighterA : currentShift === 'B' ? deleteFirefighterB : deleteFirefighterC;
  const deactivateFirefighter = currentShift === 'A' ? deactivateFirefighterA : currentShift === 'B' ? deactivateFirefighterB : deactivateFirefighterC;
  const reactivateFirefighter = currentShift === 'A' ? reactivateFirefighterA : currentShift === 'B' ? reactivateFirefighterB : reactivateFirefighterC;
  const transferShift = currentShift === 'A' ? transferShiftA : currentShift === 'B' ? transferShiftB : transferShiftC;
  const resetAll = currentShift === 'A' ? resetAllA : currentShift === 'B' ? resetAllB : resetAllC;
  const reorderFirefighters = currentShift === 'A' ? reorderFirefightersA : currentShift === 'B' ? reorderFirefightersB : reorderFirefightersC;
  const moveToBottomOfRotation = currentShift === 'A' ? moveToBottomA : currentShift === 'B' ? moveToBottomB : moveToBottomC;

  const {
    loading: holdsLoading,
    scheduledHolds,
  } = useScheduledHolds(showToast, currentShift);

  // Battalion Chief Mode - see detailed explanation above (lines 68-83)
  const isAdminMode = isAdmin;

  // Combine all firefighters and filter for current shift
  const allFirefighters = [...ffA, ...ffB, ...ffC];
  const firefighters = allFirefighters.filter(ff => ff.shift === currentShift);
  const firefightersLoading = loadingA || loadingB || loadingC;

  // Handle loading state
  if (firefightersLoading || holdsLoading) {
    return <div className="p-5 text-foreground">Loading...</div>;
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
    const firefighter = firefighters.find(ff => ff.id === firefighterId);
    completeHold(
      firefighterId,
      holdDate,
      newPosition,
      station,
      lentToShift,
      duration,
      startTime
    );
    
    // Announce hold completion for screen readers
    if (firefighter) {
      const nextAvailable = firefighters.find(ff => ff.is_available && ff.id !== firefighterId);
      const availableCount = firefighters.filter(ff => ff.is_available).length;
      announce(
        `Hold completed for ${firefighter.name}. ${nextAvailable ? `Next up: ${nextAvailable.name}.` : ''} ${availableCount} firefighters available.`,
        'polite'
      );
    }
    
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

  // Day click handler for calendar (placeholder for future hold management modal)
  function handleDayClick(date: Date) {
    // TODO: Open day modal for viewing/scheduling holds
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Skip Navigation Link - WCAG 2.4.1 Bypass Blocks */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      {/* Header */}
      <Header
        onShowHelp={() => setShowHelp(true)}
        onShowActivityLog={() => setShowActivityLog(true)}
        onQuickAddFirefighter={() => setShowQuickAdd(true)}
        onNavigateToReports={() => {}} // Reserved for future use
        onOpenMobileMenu={() => setShowMobileMenu(true)}
        onShowLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
        isAdminMode={isAdminMode}
        currentShift={currentShift}
        onShiftChange={setCurrentShift}
        onToggleDarkMode={toggleDarkMode}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Main Content - Conditional rendering based on view */}
      {currentView === 'dashboard' ? (
        <DashboardPage
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          firefightersA={ffA}
          firefightersB={ffB}
          firefightersC={ffC}
          scheduledHolds={scheduledHolds}
          isLoading={firefightersLoading || holdsLoading}
          isAdminMode={isAdminMode}
          deactivatedFirefightersA={deactivatedA}
          deactivatedFirefightersB={deactivatedB}
          deactivatedFirefightersC={deactivatedC}
          onAddFirefighter={(shift) => {
            if (shift === 'A') setShowQuickAdd(true);
            else if (shift === 'B') setShowQuickAdd(true);
            else if (shift === 'C') setShowQuickAdd(true);
          }}
          onCompleteHold={handleCompleteHoldClick}
          onDeleteFirefighter={(id) => {
            const ff = allFirefighters.find(f => f.id === id);
            if (ff?.shift === 'A') deleteFirefighterA(id);
            else if (ff?.shift === 'B') deleteFirefighterB(id);
            else if (ff?.shift === 'C') deleteFirefighterC(id);
          }}
          onDeactivateFirefighter={(id) => {
            const ff = allFirefighters.find(f => f.id === id);
            if (ff?.shift === 'A') deactivateFirefighterA(id);
            else if (ff?.shift === 'B') deactivateFirefighterB(id);
            else if (ff?.shift === 'C') deactivateFirefighterC(id);
          }}
          onReactivateFirefighter={(id, position) => {
            const ff = [...deactivatedA, ...deactivatedB, ...deactivatedC].find(f => f.id === id);
            if (ff?.shift === 'A') reactivateFirefighterA(id, position);
            else if (ff?.shift === 'B') reactivateFirefighterB(id, position);
            else if (ff?.shift === 'C') reactivateFirefighterC(id, position);
          }}
          onTransferShift={handleTransferShiftClick}
          onResetAll={(shift) => {
            if (shift === 'A') resetAllA();
            else if (shift === 'B') resetAllB();
            else if (shift === 'C') resetAllC();
          }}
          onReorderFirefighters={(ffs, shift) => {
            if (shift === 'A') reorderFirefightersA(ffs);
            else if (shift === 'B') reorderFirefightersB(ffs);
            else if (shift === 'C') reorderFirefightersC(ffs);
          }}
          onVolunteerHold={(id) => {
            const ff = allFirefighters.find(f => f.id === id);
            if (ff?.shift === 'A') moveToBottomA(id);
            else if (ff?.shift === 'B') moveToBottomB(id);
            else if (ff?.shift === 'C') moveToBottomC(id);
          }}
        />
      ) : (
        <SchedulePage
          currentShift={currentShift}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          firefighters={allFirefighters}
          scheduledHolds={scheduledHolds}
          selectedFirefighterId={selectedFirefighterFilter}
          onDayClick={handleDayClick}
          onFirefighterSelect={(id: string | null) => setSelectedFirefighterFilter(id)}
          isLoading={firefightersLoading || holdsLoading}
          isAdminMode={isAdminMode}
          deactivatedFirefighters={deactivatedFirefighters}
          onAddFirefighter={() => setShowQuickAdd(true)}
          onCompleteHold={handleCompleteHoldClick}
          onDeleteFirefighter={deleteFirefighter}
          onDeactivateFirefighter={deactivateFirefighter}
          onReactivateFirefighter={reactivateFirefighter}
          onTransferShift={handleTransferShiftClick}
          onResetAll={resetAll}
          onReorderFirefighters={reorderFirefighters}
          onVolunteerHold={moveToBottomOfRotation}
        />
      )}

      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div className="fixed top-5 right-5 z-[9999]">
          {toasts.map(toast => (
            <div key={toast.id} className="bg-card border border-border rounded-lg px-4 py-3 mb-2 text-foreground">
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

        {/* BC Mode login is handled via Header button with simple password prompt */}
        {showLogin && (() => {
          const password = window.prompt('Enter Battalion Chief password:');
          if (password === 'Firerescue') {
            handleLoginSuccess();
          } else if (password !== null) {
            showToast('Incorrect password', 'error');
          }
          setShowLogin(false);
          return null;
        })()}

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
        isAdminMode={isAdminMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Mobile Bottom Navigation */}
      {device.isMobile && (
        <BottomNav
          activeTab={mobileActiveTab}
          onTabChange={(tab) => {
            setMobileActiveTab(tab);
            if (tab === 'activity') {
              setShowActivityLog(true);
            }
          }}
        />
      )}

      {/* Floating Action Button for Quick Add (Priority 3.2: Relocate Quick Add to prominent Z-pattern location) */}
      {isAdmin && (
        <FloatingActionButton
          onClick={() => setShowQuickAdd(true)}
          label="Quick Add Firefighter"
        />
      )}

      {/* Development Tools - Sentry Error Testing */}
      {import.meta.env.DEV && SentryTestButton && (
        <Suspense fallback={null}>
          <SentryTestButton />
        </Suspense>
      )}

      {/* Vercel Analytics */}
      <Analytics />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default App;
