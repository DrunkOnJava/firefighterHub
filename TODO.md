# FirefighterHub - Comprehensive TODO

**Last Updated**: January 9, 2025 (Evening Session)
**Project**: Legacy UI Cleanup & Viewport Lock Implementation
**Target URL**: https://firefighter-hub.vercel.app/
**Status**: 🟡 CRITICAL CLEANUP IN PROGRESS - 6/9 Legacy Components Remaining

---

## 📊 Project Overview

### 🔴 CRITICAL DISCOVERY: Legacy UI Cleanup Required

**Deep Audit Findings** (January 9, 2025 - Evening):
- **221 isDarkMode prop usages** found (should be 0 with dark: variants)
- **9 legacy UI components** with hardcoded colors discovered
- **29 inline style={{}}** objects need cleanup
- **Previous "100% migration" claim was inaccurate**

See `LEGACY_STYLING_AUDIT.md` for complete audit report.

**Current Status**:
- ✅ 3/9 legacy components migrated (Modal, AnimatedButton, AnimatedInput)
- ⏳ 6/9 legacy components remaining
- 📉 isDarkMode usage: 221 → 150 (-71, -32% reduction)

---

### ✅ COMPLETED: Viewport-Locked Layout
**Status**: Applied to source code (eliminates page scroll)
**Completion Date**: January 9, 2025
**Impact**:
- No more ephemeral DevTools fixes
- App constrained to 100vh viewport
- Proper flexbox hierarchy with min-h-0
- Calendar + Sidebar fit perfectly in viewport

See commit `c6fbfed` for implementation details.

---

### ✅ COMPLETED: Table Auto-Fit System
**Status**: Full implementation with utilities and hooks
**Files Created**:
- `src/utils/sidebarTableAutofit.ts` (254 lines)
- `src/hooks/useSidebarTableAutofit.ts` (145 lines)
- `src/components/examples/RotationScheduleTable.tsx` (139 lines)
- `docs/SIDEBAR_TABLE_AUTOFIT.md` (comprehensive guide)

**Features**:
- Binary search algorithm (O(log n)) for optimal font-size
- ResizeObserver integration with debouncing
- React hooks for declarative usage
- Ready to use in Sidebar or any constrained container

---

### 🎯 ACTIVE SPRINT: Legacy UI Component Cleanup

**Goal**: Eliminate ALL isDarkMode props and hardcoded colors
**Timeline**: 3-4 hours remaining
**Risk**: Medium (Modal was critical, now complete)

---

## 📋 Session Progress (January 9, 2025)

### Morning Session: shadcn/ui Migration Completion
**Status**: 63/63 components claimed complete (later found inaccurate)
**Documentation**: `SHADCN_MIGRATION_FINAL_REPORT.md`

- ✅ Top-down migration (Priorities 1-7)
- ✅ Bottom-up completion (5 remaining components)
- ✅ Legacy style system removal (src/styles/ directory)
- ⚠️ Did not verify with grep for legacy patterns

### Afternoon Session: Table Auto-Fit System
**Status**: Complete implementation
**Files Created**: 4 (utilities, hooks, examples, docs)

- ✅ Binary search algorithm for font-size optimization
- ✅ ResizeObserver integration
- ✅ React hooks (useTableAutofit, useTableAutofitManual)
- ✅ Comprehensive documentation

### Evening Session: Critical Discovery & Cleanup
**Status**: Deep audit revealed significant legacy code remaining

**Discoveries**:
- 🔴 221 isDarkMode prop usages (should be 0)
- 🔴 9 legacy UI components with hardcoded colors
- 🔴 29 inline style={{}} objects
- 🔴 CSS variable usage (var(--text), var(--bg-card))

**Actions Taken**:
- ✅ Created LEGACY_STYLING_AUDIT.md (comprehensive report)
- ✅ Implemented viewport-locked layout (index.css + App.tsx)
- ✅ Migrated Modal.tsx → shadcn Dialog (CRITICAL)
- ✅ Migrated AnimatedButton.tsx → shadcn Button wrapper
- ✅ Migrated AnimatedInput.tsx → shadcn Input + Label
- 📉 Reduced isDarkMode usage: 221 → 150 (-71 usages)

**Remaining**:
- ⏳ 6 legacy UI components
- ⏳ Hardcoded color cleanup
- ⏳ Inline style conversion
- ⏳ CSS variable removal

**Commits**:
- `c6fbfed` - Viewport-locked layout
- `7eadf91` - Legacy UI cleanup Phase 1 & 2

---

## 🎯 ACTIVE SPRINT: Legacy UI Cleanup (Phases 3 & 4)

**Discovered via deep audit**: 9 legacy UI components still using isDarkMode props and hardcoded colors.

### ✅ Phase 1: Critical Modal (COMPLETE)
- [x] **Modal.tsx** → Migrated to shadcn Dialog
  - Removed isDarkMode prop
  - Replaced hardcoded colors with semantic classes
  - Used @radix-ui/react-dialog primitives
  - Maintained all accessibility features
  - **Impact**: Used in 15+ components

### ✅ Phase 2: Form Components (2/3 COMPLETE)
- [x] **AnimatedButton.tsx** → Migrated to shadcn Button wrapper
  - Removed hardcoded variant colors (bg-orange-600, bg-slate-700, etc.)
  - Uses CVA for variant management
  - Replaced custom spinner with Loader2
  - Maintained all animations (ripple, shake, scale, loading)
  
- [x] **AnimatedInput.tsx** → Migrated to shadcn Input + Label wrapper
  - Removed isDarkMode prop
  - Replaced hardcoded colors with semantic classes
  - Maintained floating label, success/error states
  - Preserved auto-resize textarea

- [ ] **AnimatedToggle.tsx** → Need shadcn Switch
  - Current: Uses bg-blue-600, bg-green-600, bg-gray-300
  - Target: shadcn Switch component
  - Estimated: 30 minutes

### ⏳ Phase 3: Loading Components (NEXT)
- [ ] **Spinner.tsx** → Use Loader2 from lucide-react
  - Current: isDarkMode conditionals, bg-blue-500/bg-blue-600
  - Target: Semantic colors with Loader2 icon
  - Estimated: 30 minutes

- [ ] **ProgressBar.tsx** → Use shadcn Progress
  - Current: bg-blue-600, bg-green-600, bg-red-600
  - Target: shadcn Progress component
  - Estimated: 30 minutes

- [ ] **PulseLoader.tsx** → Use Skeleton or Loader2
  - Current: bg-blue-500, bg-green-500, bg-red-500
  - Target: shadcn Skeleton or Loader2 with semantic colors
  - Estimated: 20 minutes

### ⏳ Phase 4: Other Components
- [ ] **FloatingActionButton.tsx** → shadcn Button (fixed positioning)
  - Current: isDarkMode conditionals, bg-slate-800/bg-slate-900
  - Target: shadcn Button with fixed positioning classes
  - Estimated: 30 minutes

- [ ] **Radio.tsx** → shadcn RadioGroup
  - Current: hover:bg-slate-800/50, text-blue-600, bg-slate-800
  - Target: shadcn RadioGroup component
  - Estimated: 30 minutes

### Phase 5: Hardcoded Color Cleanup
- [ ] Fix skip link in App.tsx (focus:bg-blue-600 → focus:bg-primary)
- [ ] Fix ConfirmDialog.tsx (bg-red-100, bg-blue-100 → semantic)
- [ ] Fix LoginModal.tsx (bg-red-50 → bg-destructive/10)
- [ ] Clean up remaining inline styles (29 occurrences)
- [ ] Verify zero CSS variable usage (var(--text) → className)

**Total Remaining**: 6 components + cleanup tasks
**Estimated Time**: 3-4 hours

---

## 📋 Historical: shadcn/ui Migration Details (COMPLETE)

### Session A: Top-Down Migration
- Priority 1: Core Layout (8/8) ✅
- Priority 2: Calendar System (12/12) ✅
- Priority 3: Firefighter Management (5/10) ✅
- Priority 4: Mobile Components (5/5) ✅
- Priority 5: UI Primitives (10/10) ✅
- Priority 6: Utilities (8/11) ✅
- Priority 7: Additional Features (7/7) ✅

### Session B: Bottom-Up Completion (This Session)
- Phase 1: Quick Wins (5/5) ✅
- Phase 2: Complex Components (3/3) ✅
- Phase 3: Cleanup (100%) ✅

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
