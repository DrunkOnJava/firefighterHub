# FirefighterHub - Comprehensive TODO

**Last Updated**: January 9, 2025
**Project**: shadcn/ui Migration & Mobile-First Optimization
**Target URL**: https://firefighter-hub.vercel.app/
**Status**: 🟡 shadcn Migration 84.1% Complete - 10 Components Remaining

---

## 📊 Project Overview

### Current Priority: shadcn/ui Migration
**Goal**: Replace legacy style system with shadcn/ui semantic classes
**Progress**: 53/63 components migrated (84.1%)
**Remaining**: 10 components (5 small + 3 complex + 2 cleanup)
**Timeline**: 10-14 hours estimated completion

### Migration Benefits Achieved
- **Bundle Size**: Reduced by 12KB (290KB → 278KB, -4.1%)
- **Code Quality**: 50+ legacy imports removed
- **Maintainability**: Consistent theming with Tailwind semantic classes
- **Dark Mode**: Simplified with `dark:` variants (no isDarkMode props)

### Mobile Optimization Status
**Goal**: Mobile-optimized web application with PWA capabilities
**Status**: Core optimizations complete, ongoing refinements

- **Performance**: LCP 611ms ✅, CLS 0.00 ✅
- **Bundle Size**: 278KB gzipped ✅ (Target: <150KB after migration complete)
- **Touch Targets**: WCAG 2.1 AA compliant (44px minimum) ✅
- **PWA**: Service worker + manifest configured ✅

---

## 🎯 Active Sprint: shadcn/ui Migration Completion

### Phase 1: Quick Wins - Small Components (5 files, ~2-3 hours)
**Priority**: HIGH - Fix incorrectly marked components
**Assignee**: Bottom-up session

- [ ] `src/components/LoadingButton.tsx` (uses `colors`, `tokens`)
  - Replace with shadcn `Button` + loading state
  - Estimated: 30 minutes
  
- [ ] `src/components/ShiftIndicator.tsx` (uses `tokens`)
  - Replace with Tailwind utilities
  - Estimated: 20 minutes
  
- [ ] `src/components/Toast.tsx` (uses `tokens`)
  - Verify shadcn Sonner integration, remove token imports
  - Estimated: 30 minutes
  
- [ ] `src/components/roster/RosterHeader.tsx` (uses `colors`, `tokens`)
  - Replace theme objects with semantic classes
  - Estimated: 45 minutes
  
- [ ] `src/components/roster/RosterSearchBar.tsx` (uses `colors`, `tokens`)
  - Replace theme objects with semantic classes
  - Estimated: 45 minutes

**Checkpoint**: Run `pnpm build && pnpm typecheck` after completing small components

---

### Phase 2: Complex Components (3 files, ~8-11 hours)
**Priority**: HIGH - Main roster components
**Assignee**: Bottom-up session (use UI/UX Implementation Specialist agent)

- [ ] `src/components/FirefighterList.tsx` (1,001 lines)
  - Uses: `colors`, `tokens`
  - Strategy: Systematic search-replace, test after each section
  - Risk: HIGH (main roster view, drag-drop, sorting)
  - Estimated: 3-4 hours
  
- [ ] `src/components/FirefightersModal.tsx` (676 lines)
  - Uses: `colors`, `tokens`, `visualHeadings`, `gridUtilities`
  - Strategy: Section-by-section migration
  - Risk: MEDIUM (inline editing, validation)
  - Estimated: 2-3 hours
  
- [ ] `src/components/FirefighterProfileModal.tsx` (975 lines)
  - Uses: `colors`, `tokens`, `visualHeadings`, `gridUtilities`
  - Strategy: Tab-by-tab migration
  - Risk: MEDIUM (multiple tabs, form states)
  - Estimated: 2-3 hours

**Checkpoint**: Run `pnpm build && pnpm test:run` after each complex component

---

### Phase 3: Cleanup & Verification (~1 hour)
**Priority**: MEDIUM - Remove legacy code
**Assignee**: Bottom-up session

#### Step 1: Verify No Legacy Imports Remain
```bash
# Should return 0 matches:
grep -r "import.*from.*['\"].*styles" src/ --include="*.tsx" --include="*.ts" | \
  grep -E "(colors|tokens|colorSystem|gridUtilities|visualHeadings)"

# Alternative checks:
grep -r "from ['\"]@/styles" src/ --include="*.tsx" --include="*.ts"
grep -r "from ['\"]../styles" src/ --include="*.tsx" --include="*.ts"
```

#### Step 2: Delete Obsolete Component Files (8 files, ~15KB)
- [ ] `src/components/ListView.tsx` - Duplicate of FirefighterList
- [ ] `src/components/Breadcrumb.tsx` - Unused navigation breadcrumb
- [ ] `src/components/GridOverlay.tsx` - Dev-only grid overlay
- [ ] `src/components/Common/ResponsiveModal.tsx` - Duplicate of ui/Modal
- [ ] `src/components/Form/Checkbox.tsx` - Duplicate of ui/Checkbox
- [ ] `src/components/Form/RadioGroup.tsx` - Duplicate of ui/Radio
- [ ] `src/components/transitions/Collapsible.tsx` - Unused
- [ ] `src/components/transitions/EmptyState.tsx` - Duplicate

#### Step 3: Delete Legacy Style System (8 files, ~40KB)
- [ ] `src/styles/tokens.ts` (11KB)
- [ ] `src/styles/colorSystem.ts` (9KB)
- [ ] `src/styles/gridUtilities.ts` (8.6KB)
- [ ] `src/styles/colorTokens.ts` (5.5KB)
- [ ] `src/styles/spacingTokens.ts` (3.7KB)
- [ ] `src/styles/visualHeadings.ts` (if exists)
- [ ] `src/styles/index.ts` (1KB)
- [ ] `src/utils/calendarTheme.ts`
- [ ] `src/utils/sidebarTheme.ts`
- [ ] `src/utils/theme.ts` (if exists)

#### Step 4: Final Build Verification
```bash
pnpm build          # Should pass
pnpm typecheck      # Should pass
pnpm lint           # Should pass
pnpm test:run       # Check for failures
```

---

## 📋 Completed Migration Work (53/63 components - 84.1%)

### ✅ Priority 1: Core Layout (8/8) - 100% COMPLETE
- [x] Header.tsx, Sidebar.tsx, MobileNav.tsx, BottomNav.tsx
- [x] App.tsx, ErrorBoundary.tsx, ConnectionStatusIndicator.tsx, UpdateNotification.tsx

### ✅ Priority 2: Calendar System (12/12) - 100% COMPLETE
- [x] Calendar.tsx, CalendarView.tsx, MainCalendar.tsx, CalendarGrid.tsx
- [x] CalendarHeader.tsx, CalendarLegend.tsx, DayCell.tsx, DayModal.tsx
- [x] DayScheduleModal.tsx, HoldForm.tsx, HoldList.tsx, CalendarSubscribeModal.tsx

### ✅ Priority 3: Firefighter Management (5/10) - 50% COMPLETE
- [x] AddFirefighterForm.tsx, QuickAddFirefighterModal.tsx, CompleteHoldModal.tsx
- [x] TransferShiftModal.tsx, ReactivateModal.tsx
- [ ] RosterHeader.tsx - ⚠️ Needs migration (incorrectly marked complete)
- [ ] RosterSearchBar.tsx - ⚠️ Needs migration (incorrectly marked complete)
- [ ] FirefighterList.tsx - ⚠️ Partial only
- [ ] FirefighterProfileModal.tsx - ⚠️ Not started
- [ ] FirefightersModal.tsx - ⚠️ Not started

### ✅ Priority 4: Mobile Components (5/5) - 100% COMPLETE
- [x] FirefighterCard.tsx, SwipeableCard.tsx, MobileWeekView.tsx
- [x] FirefighterGrid.tsx, NextUpBar.tsx

### ✅ Priority 5: UI Primitives (10/10) - 100% COMPLETE
- [x] Modal.tsx, IconButton.tsx, FloatingActionButton.tsx, Checkbox.tsx
- [x] Skeleton.tsx, Spinner.tsx, PulseLoader.tsx, ProgressBar.tsx, AnimatedInput.tsx

### ✅ Priority 6: Utilities & Helpers (9/11) - 82% COMPLETE
- [x] Tooltip.tsx, ConfirmDialog.tsx, EmptyState.tsx, SkeletonLoader.tsx
- [x] LoginModal.tsx, BattalionChiefLogin.tsx, HelpModal.tsx
- [x] KeyboardShortcutsModal.tsx, ActivityLogModal.tsx, ActivityLog.tsx
- [ ] Toast.tsx - ⚠️ Needs migration (incorrectly marked complete)
- [ ] LoadingButton.tsx - ⚠️ Needs migration (not checked)

### ✅ Priority 7: Additional Features (7/7) - 100% COMPLETE
- [x] Reports.tsx, BulkActions.tsx, ExportMenu.tsx, FilterPanel.tsx
- [x] StationSelector.tsx, NextUpBarV2.tsx, MetricCard.tsx

---

## 🔄 Historical: Mobile Optimization Phases

### ✅ Phase 1: Mobile Performance Audit & Foundation [COMPLETE]
**Status**: ✅ 100% Complete (November 6, 2025)
**Documentation**: `docs/MOBILE_OPTIMIZATION_PHASE1_COMPLETE.md`

- [x] Performance baseline measurement (LCP 611ms, CLS 0.00)
- [x] Device detection infrastructure (`useMediaQuery`, `useDevice` hooks)
- [x] Mobile-first configuration (viewport meta, touch targets, safe areas)

### ✅ Phase 2: Bundle Optimization & Code Splitting [COMPLETE]
**Status**: ✅ 100% Complete (November 6, 2025)
**Documentation**: `docs/MOBILE_OPTIMIZATION_PHASE2_COMPLETE.md`

- [x] Moment.js migration to date-fns (15.29 KB savings)
- [x] Code splitting implementation (83.14 KB moved to separate chunks)
- [x] Total savings: 98.43 KB gzipped (48.6% reduction)

### ✅ Phase 3: Mobile-First Layout Refactor [COMPLETE]
**Status**: ✅ 100% Complete (November 7, 2025)
**Documentation**: `MOBILE_IMPLEMENTATION.md`

---

## ✅ Phase 1: Mobile Performance Audit & Foundation [COMPLETE]

**Status**: ✅ 100% Complete (November 6, 2025)  
**Documentation**: `docs/MOBILE_OPTIMIZATION_PHASE1_COMPLETE.md`

### Completed Tasks

- [x] **Performance Baseline Measurement**
  - [x] Lighthouse mobile audit (LCP 611ms, CLS 0.00)
  - [x] Core Web Vitals documentation
  - [x] Bundle size analysis (202.66 KB gzipped baseline)
  - [x] Network waterfall analysis (render delay identified: 511ms)
  - [x] Screenshot baseline at 375px viewport
  - **Deliverable**: `docs/MOBILE_BASELINE_METRICS.md`

- [x] **Device Detection Infrastructure**
  - [x] Breakpoint constants system (`src/constants/breakpoints.ts`)
  - [x] `useMediaQuery` hook for CSS media query detection
  - [x] `useDevice` hook for comprehensive device info
  - [x] Orientation detection (portrait/landscape)
  - [x] Touch capability detection
  - [x] Safe area insets for notched devices (iPhone X+)

- [x] **Mobile-First Configuration**
  - [x] Enhanced viewport meta tag with `viewport-fit=cover`
  - [x] CSS custom properties for safe area insets
  - [x] Touch target size constants (44px minimum)
  - [x] Mobile typography guidelines (16px minimum for inputs)
  - [x] Breakpoint alignment with Tailwind CSS

### Key Deliverables
- ✅ `docs/MOBILE_BASELINE_METRICS.md` - Performance baseline
- ✅ `docs/BUNDLE_ANALYSIS.md` - Bundle size breakdown
- ✅ `src/constants/breakpoints.ts` - Responsive breakpoints
- ✅ `src/hooks/useMediaQuery.ts` - Media query hook
- ✅ `src/hooks/useDevice.ts` - Device detection hook

---

## ✅ Phase 2: Bundle Optimization & Code Splitting [COMPLETE]

**Status**: ✅ 100% Complete (November 6, 2025)  
**Documentation**: `docs/MOBILE_OPTIMIZATION_PHASE2_COMPLETE.md`

### Completed Tasks

- [x] **Moment.js Migration**
  - [x] Replace deprecated moment.js with date-fns
  - [x] Update BigCalendar localizer to use date-fns
  - [x] Migrate all date formatting to date-fns functions
  - [x] Remove moment.js dependency from package.json
  - [x] Verify all date operations work correctly
  - **Impact**: 15.29 KB gzipped savings (7.5% reduction)

- [x] **Code Splitting Implementation**
  - [x] Lazy load BigCalendar component (59.21 KB chunk)
  - [x] Lazy load HelpModal (2.18 KB chunk)
  - [x] Lazy load ActivityLogModal (3.96 KB chunk)
  - [x] Lazy load CompleteHoldModal (2.02 KB chunk)
  - [x] Lazy load TransferShiftModal (2.32 KB chunk)
  - [x] Lazy load QuickAddFirefighterModal (2.11 KB chunk)
  - [x] Lazy load BattalionChiefLogin (1.69 KB chunk)
  - [x] Add Suspense boundaries with loading states
  - **Impact**: 83.14 KB gzipped moved to separate chunks (41% reduction)

- [x] **Build Verification**
  - [x] Production build passes with no errors
  - [x] Chunk analysis confirms proper splitting
  - [x] No regression in functionality
  - [x] Initial bundle: 202.66 KB → 119.52 KB ✅

### Performance Impact
- **Total Savings**: 98.43 KB gzipped (48.6% reduction)
- **Initial Bundle**: 202.66 KB → 119.52 KB ✅
- **Calendar Chunk**: 59.21 KB (loads on-demand)
- **Modal Chunks**: 14.28 KB total (load on interaction)

### Key Deliverables
- ✅ `docs/MOBILE_OPTIMIZATION_PHASE2_COMPLETE.md` - Phase 2 summary
- ✅ `src/App.tsx` - Code splitting with React.lazy()
- ✅ Updated package.json (moment.js removed, date-fns added)

---

## ✅ Phase 3: Mobile-First Layout Refactor [COMPLETE]

**Status**: ✅ 100% Complete (November 7, 2025)  
**Priority**: 🔴 HIGH - Core mobile experience  
**Documentation**: `MOBILE_IMPLEMENTATION.md`
