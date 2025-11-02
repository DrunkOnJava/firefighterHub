# Comprehensive Remaining Tasks - FirefighterHub

**Generated**: November 2, 2025  
**Current State**: 72% of audit remediation complete  
**Estimated Total Remaining Time**: 18-25 hours

---

## 🔴 CRITICAL: Complete Type Integration (20-30 minutes)

**Status**: 72% Complete - 56 TypeScript errors remaining  
**Priority**: HIGH - Should finish before moving to other tasks

### A. Fix Nullable Field Mismatches (10-15 minutes)

#### 1. FirefighterProfileModal.tsx
**Location**: `src/components/FirefighterProfileModal.tsx`

**Current Error** (Line 80):
```
Argument of type '{ id: string; hold_date: string | null; ... }[]' 
is not assignable to parameter of type 'SetStateAction<HoldRecord[]>'
```

**Fix Required**:
```typescript
// Line ~15 - Update interface
interface HoldRecord {
  id: string;
  hold_date: string | null;  // Change from: string
  fire_station: string | null;
  status: string | null;
  completed_at: string | null;
  created_at: string;
}

// Line ~291 - Add type assertion
const shift = firefighter.shift as Shift;  // Change from: Shift

// Display code - Add null checks where HoldRecord is rendered
{record.hold_date ? new Date(record.hold_date).toLocaleDateString() : 'N/A'}
{record.status || 'Unknown'}
```

#### 2. ListView.tsx
**Location**: `src/components/ListView.tsx`

**Current Errors** (Lines 44, 50, 51, 53):
```
Line 44: No overload matches this call (new Date with null)
Line 50: Type 'string | null' is not assignable to type 'string'
Line 51: Type 'string | null' is not assignable to type 'string'  
Line 53: Type 'string | null' is not assignable to type '"scheduled" | "completed" | "skipped"'
```

**Fix Required**:
```typescript
// Line ~40 - Update interface to match database
interface ViewHold {
  id: string;
  firefighter_name: string | null;  // Add | null
  hold_date: string | null;          // Add | null
  status: 'scheduled' | 'completed' | 'skipped' | null;  // Add | null
  fire_station: string | null;
  shift: string | null;              // Add | null
}

// Line ~44 - Add null check
const date = hold.hold_date ? new Date(hold.hold_date) : null;

// Lines 50-53 - Add null coalescing in map function
{
  id: hold.id,
  name: hold.firefighter_name || 'Unknown',
  date: hold.hold_date || 'N/A',
  status: hold.status || 'scheduled',
  station: hold.fire_station,
  shift: hold.shift || 'Unknown',
}
```

#### 3. Sidebar.tsx
**Location**: `src/components/Sidebar.tsx`

**Current Errors** (Lines 75, 81, 88, 89, 91):
```
Line 75: No overload matches this call (new Date with null)
Line 81: No overload matches this call (twice - new Date with null)
Lines 88-91: Type 'string | null' is not assignable to type 'string'
```

**Fix Required**:
```typescript
// Line ~75 - Add null check
const nextHoldDate = nextHold?.hold_date 
  ? new Date(nextHold.hold_date) 
  : null;

// Line ~81 - Add null checks (2 occurrences)
const date1 = a.hold_date ? new Date(a.hold_date).getTime() : 0;
const date2 = b.hold_date ? new Date(b.hold_date).getTime() : 0;

// Lines ~88-91 - Add null coalescing
firefighter_name: hold.firefighter_name || 'Unknown',
hold_date: hold.hold_date || 'Unknown',
fire_station: hold.fire_station || 'N/A',
```

### B. Fix Type Assertions (5 minutes)

#### 1. FirefighterItem.tsx
**Location**: `src/components/FirefighterItem.tsx`  
**Line**: 116

**Current Error**:
```
Type 'string' is not assignable to type 'Shift'
```

**Fix**:
```typescript
// Line 116
const shift = firefighter.shift as Shift;
```

#### 2. FirefightersModal.tsx
**Location**: `src/components/FirefightersModal.tsx`  
**Line**: 462

**Current Error**:
```
Type 'string' is not assignable to type 'Shift'
```

**Fix**:
```typescript
// Line 462
const shift = firefighter.shift as Shift;
```

#### 3. FirefighterProfileModal.tsx
**Location**: `src/components/FirefighterProfileModal.tsx`  
**Line**: 291

**Current Error**:
```
Type 'string' is not assignable to type 'Shift'
```

**Fix**:
```typescript
// Line 291
const shift = firefighter.shift as Shift;
```

### C. Fix Test Infrastructure (5-10 minutes)

#### 1. useFirefighters.test.ts
**Location**: `src/hooks/__tests__/useFirefighters.test.ts`  
**Line**: 37

**Current Error**:
```
Expected 0-1 type arguments, but got 2
```

**Fix**:
```typescript
// Line 37 - Remove extra type argument
const mockFrom = vi.mocked(supabase.from);
// Instead of: vi.mocked(supabase.from<Database, 'firefighters'>);
```

---

## 🟡 HIGH PRIORITY: Design Tokens (Session 1 - 6-8 hours)

**Status**: Pattern established, 30 components remain  
**Reference**: See `FINAL_COMPREHENSIVE_SESSION_REPORT.md` for detailed patterns

### 1. Core UI Components (2-3 hours)

#### Sidebar.tsx (30 minutes)
**Location**: `src/components/Sidebar.tsx` (348 lines)

**Current**: Uses inline sidebarTheme object  
**Target**: Use design tokens from `src/styles`

**Pattern**:
```typescript
import { colors, tokens } from '../styles';

// Replace sidebarTheme object with:
className={`
  ${colors.structural.bg.card}
  ${colors.structural.border.default}
  ${tokens.spacing.card.lg}
`}
```

**Components to update**:
- Container backgrounds
- Border colors
- Text colors (heading, body, muted)
- Hover states
- Focus states

#### MobileNav.tsx (30 minutes)
**Location**: `src/components/MobileNav.tsx` (~200 lines)

**Similar to Sidebar.tsx**:
- Replace inline color values
- Use structural colors
- Add proper spacing tokens
- Update state colors (hover, active)

#### Reports.tsx (45 minutes)
**Location**: `src/components/Reports.tsx`

**Components**:
- Metric cards
- Chart backgrounds
- Table styling
- Export buttons

### 2. Modal Components (4-5 hours)

**Pattern**: All modals follow same structure
```typescript
// Modal overlay
${colors.structural.overlay}

// Modal container
${colors.structural.bg.card}
${colors.structural.border.default}
${tokens.borders.radius.xl}
${tokens.spacing.card.lg}

// Buttons
${colors.interactive.button.primary}
${colors.interactive.button.secondary}
```

#### High-Use Modals (2 hours)
- [ ] `CompleteHoldModal.tsx` - Hold completion dialog
- [ ] `FirefighterProfileModal.tsx` - Profile details (ALSO needs nullable fixes)
- [ ] `FirefightersModal.tsx` - Firefighter selection (ALSO needs type assertion fix)
- [ ] `HelpModal.tsx` - Help documentation
- [ ] `KeyboardShortcutsModal.tsx` - Keyboard shortcuts
- [ ] `LoginModal.tsx` - Authentication modal

#### Secondary Modals (2-3 hours)
- [ ] `ActivityLogModal.tsx` - Activity history
- [ ] `CalendarSubscribeModal.tsx` - Calendar subscription
- [ ] `QuickAddFirefighterModal.tsx` - Quick add form
- [ ] `ReactivateModal.tsx` - Reactivation dialog
- [ ] `TransferShiftModal.tsx` - Shift transfer
- [ ] `FilterPanel.tsx` - Advanced filtering

### 3. Form & UI Components (1-2 hours)

#### Forms (45 minutes)
- [ ] `AddFirefighterForm.tsx` (~150 lines)
- [ ] `StationSelector.tsx` (~77 lines)

#### UI Elements (30 minutes)
- [ ] `ShiftSelector.tsx` (~80 lines) - Shift A/B/C buttons
- [ ] `ShiftIndicator.tsx` (~40 lines) - Shift badge display

#### State Components (45 minutes)
- [ ] `EmptyState.tsx` (~100 lines) - Empty state displays
- [ ] `SkeletonLoader.tsx` (~120 lines) - Loading skeletons

### 4. Other Components (1 hour)

- [ ] `ActivityLog.tsx` - Activity log display (ALSO needs nullable fixes - partially done)
- [ ] `Breadcrumb.tsx` - Breadcrumb navigation
- [ ] `ConnectionStatusIndicator.tsx` - Connection status
- [ ] `ErrorBoundary.tsx` - Error boundary wrapper
- [ ] `FirefighterItem.tsx` - Individual firefighter card (ALSO needs type assertion fix)
- [ ] `ListView.tsx` - List view alternative (ALSO needs nullable fixes)
- [ ] `LoadingButton.tsx` - Loading button component
- [ ] `Tooltip.tsx` - Tooltip component
- [ ] `UpdateNotification.tsx` - Update notification

---

## 🟡 MEDIUM PRIORITY: Hook Refactoring (4-6 hours)

### 1. Split useScheduledHolds Hook (4-6 hours)

**Current**: `src/hooks/useScheduledHolds.ts` (446 lines)  
**Target**: 3 focused hooks

#### New Structure:
```
src/hooks/
├── useScheduledHoldsData.ts (~120 lines)
│   └── loadScheduledHolds()
│
├── useScheduledHoldsMutations.ts (~200 lines)
│   ├── scheduleHold()
│   ├── removeScheduledHold()
│   └── markHoldCompleted()
│
└── useScheduledHoldsRealtime.ts (~130 lines)
    └── Real-time subscription setup
```

#### Files to Update After Split:
- [ ] `src/components/Calendar.tsx` (main consumer)
- [ ] `src/components/Sidebar.tsx` (uses holds data)
- [ ] `src/hooks/__tests__/useScheduledHolds.test.ts`

**Pattern**: Follow `useFirefighters` refactoring (already done)

---

## 🟢 OPTIONAL: Component Extraction (2-4 hours)

### 1. Further FirefighterList Extraction (2-4 hours)

**Current**: `src/components/FirefighterList.tsx` (915 lines - down from 1,123)  
**Optional Target**: ~400-500 lines

**Potential Extractions**:
- [ ] `RosterTable.tsx` - Table structure and headers (~200 lines)
- [ ] `RosterTableRow.tsx` - Individual row rendering (~150 lines)
- [ ] `DeactivatedList.tsx` - Deactivated firefighters section (~100 lines)

**Status**: OPTIONAL - Current state is acceptable

### 2. Refactor App.tsx (3-5 hours)

**Current**: `src/components/App.tsx` (429 lines)  
**Optional Target**: ~200-250 lines

**Potential Extractions**:
- [ ] `AppProviders.tsx` - Context providers wrapper
- [ ] `ViewRouter.tsx` - Calendar vs Reports routing
- [ ] `ModalManager.tsx` - All modal state management
- [ ] `KeyboardShortcuts.tsx` - Keyboard shortcut setup

**Status**: OPTIONAL - Current state is functional

---

## 🔵 TESTING: Expand Test Coverage (2-3 hours)

### 1. Visual Testing with Playwright (2-3 hours)

**Current**: 4 baseline screenshots  
**Location**: `tests/visual/`

#### Additional Tests Needed:

**Responsive Testing** (45 minutes):
- [ ] Mobile viewport (375px width)
- [ ] Tablet viewport (768px width)
- [ ] Desktop viewport (1920px width)

**Confirmation Dialogs** (45 minutes):
Requires admin mode for screenshots:
- [ ] Delete firefighter dialog
- [ ] Deactivate firefighter dialog
- [ ] Reset all dialog
- [ ] Master reset (double confirmation)
- [ ] Bulk delete dialog
- [ ] Bulk deactivate dialog

**Workflows** (30 minutes):
- [ ] Hold scheduling flow (full workflow)
- [ ] Drag-and-drop validation
- [ ] Export menu screenshots
- [ ] Filter panel screenshots

**Commands**:
```bash
# Run visual tests
pnpm test:e2e:headed

# Update baselines
pnpm test:e2e -- --update-snapshots
```

---

## 📝 DOCUMENTATION: Updates (30 minutes)

### 1. README.md Updates (30 minutes)

**Location**: `README.md`

**Tasks**:
- [ ] Update color description (change "dark blue-gray" to accurate description)
- [ ] Add design system section
- [ ] Document component architecture
- [ ] Add visual testing section
- [ ] Update tech stack (mention design tokens)
- [ ] Add type generation workflow

**Example Section to Add**:
```markdown
## Design System

This project uses a token-based design system located in `src/styles/`:

- **Colors**: Semantic color tokens (structural, interactive, feedback, status)
- **Tokens**: Spacing, borders, shadows, typography
- **Usage**: Import via `import { colors, tokens } from '../styles'`

See `src/styles/README.md` for complete documentation.
```

---

## 🐛 TECHNICAL DEBT: Known Issues (1 hour)

### 1. Remove TECHNICAL DEBT Comments (1 hour)

**Files with comments to remove/update**:
- [ ] `src/hooks/useFirefighters.ts` - Comment about splitting (already partially done)
- [ ] `src/hooks/useScheduledHolds.ts` - Comment about hook size (needs splitting)
- [ ] `src/App.tsx` - Comment about component size
- [ ] `src/components/FirefighterList.tsx` - Comment about extractions (partially done)

**Action**: Update or remove comments since issues are now addressed

---

## 🔐 SECURITY: Authentication Migration (Future)

**Status**: Not started - Low priority  
**Current**: Client-side admin mode (insecure)

### Migration Path:
- [ ] Integrate `AuthContext` (already built, unused)
- [ ] Integrate `LoginModal` (already built, unused)
- [ ] Apply RLS policies (defined but not enabled)
  - File: `supabase/migrations/20251022_enable_rls_policies.sql`
- [ ] Replace `isAdminMode` boolean with auth check
- [ ] Add user roles/permissions

**Estimated Time**: 6-8 hours

---

## 🚀 PERFORMANCE: Optimizations (Optional - 4-6 hours)

**Status**: OPTIONAL - Current performance is acceptable

### Potential Optimizations:
- [ ] Code splitting (lazy load routes)
- [ ] Lazy load modals (React.lazy)
- [ ] Memoize expensive components
- [ ] Virtual scrolling for long lists (>50 firefighters)
- [ ] Debounce search inputs

**When to Consider**:
- Roster has >100 firefighters
- Users report slow loading
- Lighthouse scores drop below 90

---

## 📦 REMAINING FROM ORIGINAL AUDIT (Low Priority)

From `CODE_AUDIT_REPORT.md` - These were identified but are lower priority:

### Future Enhancements:
- [ ] React Query for caching (reduce API calls)
- [ ] Pagination for large rosters
- [ ] Feature flags system
- [ ] Analytics/telemetry integration
- [ ] CSV/PDF export enhancements
- [ ] iCalendar integration improvements
- [ ] Multi-tenancy support

**Estimated Time**: 20-30 hours total

---

## 📊 PRIORITY MATRIX

### Do Immediately (< 1 hour)
1. ✅ **Complete Type Integration** (20-30 min)
   - Fix 3 nullable field files
   - Add 3 type assertions
   - Fix 1 test file
   - **Blockers**: TypeScript errors prevent clean builds

### Do Next (6-8 hours)
2. **Apply Design Tokens to Core UI** (Session 1)
   - Sidebar.tsx (30 min)
   - MobileNav.tsx (30 min)  
   - Reports.tsx (45 min)
   - 6 high-use modals (2 hours)
   - **Value**: Immediate visual consistency improvement

### Do Soon (4-6 hours)
3. **Split useScheduledHolds Hook** (Session 2)
   - Better code organization
   - Easier to test
   - Follows established pattern

4. **Apply Design Tokens to Remaining Modals** (Session 2)
   - 6 secondary modals (2-3 hours)
   - Complete token migration

### Optional (2-6 hours each)
- Further component extraction
- Expand visual testing
- Documentation updates
- Performance optimizations

---

## 🎯 RECOMMENDED NEXT SESSION PLAN

### Session 1: Complete Type Integration + Start Tokens (6-8 hours)

**Hour 1: Finish Types** ✅
```bash
# 1. Fix nullable fields (15 min)
# - FirefighterProfileModal.tsx
# - ListView.tsx
# - Sidebar.tsx

# 2. Fix type assertions (5 min)
# - 3 files, add `as Shift`

# 3. Fix test types (5 min)
# - useFirefighters.test.ts

# 4. Verify (5 min)
pnpm typecheck  # 0 errors
pnpm test:run   # All pass
```

**Hours 2-8: Design Tokens** 🎨
```bash
# Priority order:
1. Sidebar.tsx (30 min)
2. MobileNav.tsx (30 min)
3. Reports.tsx (45 min)
4. CompleteHoldModal.tsx (20 min)
5. FirefighterProfileModal.tsx (20 min)
6. FirefightersModal.tsx (20 min)
7. HelpModal.tsx (20 min)
8. KeyboardShortcutsModal.tsx (20 min)
9. LoginModal.tsx (20 min)

# Test visually after each component
pnpm dev
```

### Session 2: Remaining Modals + Hook Split (4-6 hours)

**Hours 1-3: Remaining Modals**
- 6 secondary modals (2-3 hours)
- Form components (45 min)
- UI elements (30 min)

**Hours 4-6: Hook Refactoring**
- Split useScheduledHolds
- Update consumers
- Test changes

---

## 📈 COMPLETION TRACKING

### Type Integration: 72% → 100%
- [x] Database migrations
- [x] Type generation
- [x] Core integration
- [x] Test fixes
- [x] Dead code removal
- [x] ActivityLog.tsx nullable fixes
- [ ] FirefighterProfileModal.tsx (3 fixes needed)
- [ ] ListView.tsx (4 fixes needed)
- [ ] Sidebar.tsx (5 fixes needed)
- [ ] Type assertions (3 files)
- [ ] Test infrastructure (1 file)

### Design Tokens: 35% → 100%
- [x] Token system created
- [x] 16 components done
- [ ] 30 components remaining
  - [ ] 3 core UI (Sidebar, MobileNav, Reports)
  - [ ] 12 modals
  - [ ] 10 other components
  - [ ] 5 form/UI elements

### Code Organization: 70% → 100%
- [x] Calendar refactored
- [x] Roster partially refactored
- [x] useFirefighters split (partial)
- [ ] useScheduledHolds split
- [ ] (Optional) Further extractions

---

## 🎉 WHAT'S ALREADY DONE

### Completed This Session (3.5 hours):
- ✅ Database schema aligned with code
- ✅ Auto-generated types integrated
- ✅ 22 TypeScript errors fixed (78 → 56)
- ✅ Calendar.test.tsx refactored
- ✅ Mock data updated
- ✅ Dead code removed
- ✅ ActivityLog nullable fixes

### Completed Previous Sessions:
- ✅ Design token system
- ✅ Calendar refactored (910 → 169 lines)
- ✅ 8 Calendar sub-components
- ✅ 5 Roster sub-components
- ✅ Non-blocking confirmations (7 patterns)
- ✅ Visual testing setup
- ✅ 10 documentation files

---

## 📞 GETTING HELP

If stuck on any task:

1. **Type Errors**: Check `TYPE_INTEGRATION_FINAL_STATUS.md`
2. **Design Tokens**: See `src/styles/README.md` and examples in Calendar/Roster
3. **Testing**: Run `pnpm test:run` for unit tests, `pnpm test:e2e` for E2E
4. **Patterns**: Look at completed components for reference

---

**Total Estimated Remaining Time**: 18-25 hours
- Critical (type fixes): 20-30 minutes
- High priority (tokens): 6-8 hours
- Medium priority (hooks): 4-6 hours
- Optional: 8-12 hours

**Recommendation**: Start with the 30-minute type integration fixes, then tackle design tokens systematically over 2-3 sessions.

