# Remaining Tasks - FirefighterHub

**Updated**: November 2, 2025  
**Design Token Migration Progress**: ✅ **COMPLETE - 0 TypeScript Errors**  
**Status**: Migration stable, optional components remain

---

## ✅ RECENTLY COMPLETED: Design Tokens Migration Critical Path

**Completion Date**: November 2, 2025  
**Result**: ✅ All TypeScript errors resolved, production build successful

### What Was Fixed This Session

1. **Added 7 Missing Design Token Properties** (Fixed 26 errors)

   - `components.button.disabled`, `components.button.shadow`
   - `components.card.shadow`, `components.input.placeholder`
   - `semantic.primary.light`
   - `structural.border.strong`, `structural.text.surface`

2. **Removed isDarkMode Props from Migrated Components** (Fixed 27 errors)

   - ShiftSelector.test.tsx (27 test cases)
   - CalendarHeader.tsx, HoldList.tsx, FirefighterItem.tsx
   - FirefighterList.tsx, Header.tsx, MobileNav.tsx

3. **Additional Fixes**
   - Fixed Shift type casting in FirefighterItem
   - Removed unused export handlers and imports

**See**: `DESIGN_TOKEN_MIGRATION_COMPLETE.md` for full details

---

## 🎨 OPTIONAL: Complete Remaining Design Token Migrations (4-6 hours)

**Status**: Not blocking - these components work fine with isDarkMode  
**Previously Completed**: Sidebar, MobileNav, Reports, CompleteHoldModal, FirefighterProfileModal, FirefightersModal, ShiftSelector, AddFirefighterForm, EmptyState, FilterPanel, KeyboardShortcutsModal, ConnectionStatusIndicator, and 15+ more

### Pattern Reference

All modals and components follow this structure:

```typescript
import { colors, tokens } from '../styles';

// Modal overlay
${colors.components.modal.overlay}

// Modal container
${colors.components.modal.background}
${colors.components.modal.border}
${tokens.borders.radius.xl}
${tokens.spacing.card.lg}

// Buttons
${colors.components.button.success}    // Save/Submit
${colors.components.button.secondary}  // Cancel/Close
${colors.semantic.info.solid}          // Info actions
```

### Remaining Components to Migrate (Optional)

#### 1. Complex Component - FirefighterItem (2-3 hours)

- [ ] `FirefighterItem.tsx` - 305 lines with extensive isDarkMode usage throughout
  - Complex conditional styling (10+ ternary expressions)
  - Badge rendering, drag-and-drop states, certification displays
  - Highest complexity of remaining components

#### 2. Calendar Components (1.5-2 hours)

- [ ] `Calendar.tsx` - Main calendar container
- [ ] `CalendarGrid.tsx` - Grid layout and day cells
- [ ] `DayCell.tsx` - Individual day cell rendering
- [ ] `DayModal.tsx` - Day detail modal
- [ ] `HoldForm.tsx` - Hold scheduling form (partially migrated - still uses isDarkMode internally)

#### 3. Roster Sub-Components (1 hour)

- [ ] `BulkActions.tsx` - Bulk operation buttons
- [ ] `ExportMenu.tsx` - Export dropdown menu
- [ ] `RosterHeader.tsx` - Roster header section
- [ ] `RosterSearchBar.tsx` - Search and filter bar

#### 4. Other Components (30-45 minutes)

- [ ] `MetricCard.tsx` - Dashboard metric cards
- [ ] `ConfirmDialog.tsx` - Confirmation dialog

**Note**: These migrations are optional - all components work correctly with their current isDarkMode implementation.

---

## � MEDIUM PRIORITY: Hook Refactoring (4-6 hours)

### Split useScheduledHolds Hook

**Current**: `src/hooks/useScheduledHolds.ts` (446 lines)  
**Target**: 3 focused hooks following the useFirefighters pattern

**New Structure**

```text
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

**Files to Update After Split**

- [ ] `src/components/Calendar.tsx` (main consumer)
- [ ] `src/components/Sidebar.tsx` (uses holds data)
- [ ] `src/hooks/__tests__/useScheduledHolds.test.ts`

---

## � OPTIONAL: Component Extraction (2-4 hours)

### Further FirefighterList Extraction

**Current**: `src/components/FirefighterList.tsx` (915 lines - down from 1,123)  
**Optional Target**: ~400-500 lines

**Potential Extractions**:

- [ ] `RosterTable.tsx` - Table structure and headers (~200 lines)
- [ ] `RosterTableRow.tsx` - Individual row rendering (~150 lines)
- [ ] `DeactivatedList.tsx` - Deactivated firefighters section (~100 lines)

**Status**: Current state is acceptable

### Refactor App.tsx

**Current**: `src/components/App.tsx` (429 lines)  
**Optional Target**: ~200-250 lines

**Potential Extractions**:

- [ ] `AppProviders.tsx` - Context providers wrapper
- [ ] `ViewRouter.tsx` - Calendar vs Reports routing
- [ ] `ModalManager.tsx` - All modal state management
- [ ] `KeyboardShortcuts.tsx` - Keyboard shortcut setup

**Status**: Current state is functional

---

## 🧪 TESTING: Expand Test Coverage (2-3 hours)

### Visual Testing with Playwright

**Current**: 4 baseline screenshots  
**Location**: `tests/visual/`

**Additional Tests Needed**

#### Responsive Testing (45 minutes)

- [ ] Mobile viewport (375px width)
- [ ] Tablet viewport (768px width)
- [ ] Desktop viewport (1920px width)

#### Confirmation Dialogs (45 minutes)

- [ ] Delete firefighter dialog
- [ ] Deactivate firefighter dialog
- [ ] Reset all dialog
- [ ] Master reset (double confirmation)
- [ ] Bulk delete dialog
- [ ] Bulk deactivate dialog

#### Workflows (30 minutes)

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

### README.md Updates

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

### Remove TECHNICAL DEBT Comments

**Files with comments to remove/update**:

- [ ] `src/hooks/useFirefighters.ts` - Comment about splitting (partially addressed)
- [ ] `src/hooks/useScheduledHolds.ts` - Comment about hook size (needs splitting)
- [ ] `src/App.tsx` - Comment about component size
- [ ] `src/components/FirefighterList.tsx` - Comment about extractions (partially done)

**Action**: Update or remove comments since issues are now addressed

---

## 🔐 SECURITY: Authentication Migration (Future - 6-8 hours)

**Status**: Not started - Low priority  
**Current**: Client-side admin mode (insecure)

**Migration Path**

- [ ] Integrate `AuthContext` (already built, unused)
- [ ] Integrate `LoginModal` (already built, unused)
- [ ] Apply RLS policies (defined but not enabled)
  - File: `supabase/migrations/20251022_enable_rls_policies.sql`
- [ ] Replace `isAdminMode` boolean with auth check
- [ ] Add user roles/permissions

---

## 🚀 PERFORMANCE: Optimizations (Optional - 4-6 hours)

**Status**: Current performance is acceptable

**Potential Optimizations**

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

## 📦 FUTURE ENHANCEMENTS (Low Priority - 20-30 hours)

From `CODE_AUDIT_REPORT.md` - identified but lower priority:

**Future Enhancements**

- [ ] React Query for caching (reduce API calls)
- [ ] Pagination for large rosters
- [ ] Feature flags system
- [ ] Analytics/telemetry integration
- [ ] CSV/PDF export enhancements
- [ ] iCalendar integration improvements
- [ ] Multi-tenancy support

---

## 📊 PRIORITY MATRIX

### 1. Complete Design Tokens Migration (3-4 hours)

- 4 high-priority modals (1.5 hours)
- 5 secondary modals (1-1.5 hours)
- Forms & UI elements (1-2 hours)
- **Value**: Complete visual consistency across entire application

### 2. Split useScheduledHolds Hook (4-6 hours)

- Better code organization
- Easier to test
- Follows established pattern

### 3. Optional Tasks (2-6 hours each)

- Further component extraction
- Expand visual testing
- Documentation updates
- Performance optimizations

---

## 🎯 RECOMMENDED NEXT SESSION

### Session: Complete Design Tokens (3-4 hours)

**Priority order**:

1. HelpModal.tsx (20 min)
2. KeyboardShortcutsModal.tsx (20 min)
3. LoginModal.tsx (20 min)
4. ActivityLogModal.tsx (30 min)
5. CalendarSubscribeModal.tsx (15 min)
6. QuickAddFirefighterModal.tsx (20 min)
7. ReactivateModal.tsx (15 min)
8. TransferShiftModal.tsx (20 min)
9. FilterPanel.tsx (20 min)
10. AddFirefighterForm.tsx, StationSelector.tsx (45 min)
11. UI components (1 hour)

**Test visually after each component**:

```bash
pnpm dev
```

---

## 📈 PROGRESS TRACKING

### Design Tokens: 17% Complete

**Completed (6 components)**:

- ✅ Sidebar.tsx
- ✅ MobileNav.tsx
- ✅ Reports.tsx
- ✅ CompleteHoldModal.tsx
- ✅ FirefighterProfileModal.tsx
- ✅ FirefightersModal.tsx

**Remaining (30 components)**:

- [ ] 4 high-priority modals
- [ ] 5 secondary modals
- [ ] 2 form components
- [ ] 4 UI elements
- [ ] 2 state components
- [ ] 9 utility components

### Code Organization: 70% Complete

- ✅ Calendar refactored (910 → 169 lines)
- ✅ 8 Calendar sub-components
- ✅ 5 Roster sub-components
- ✅ useFirefighters partially split
- [ ] useScheduledHolds split (pending)
- [ ] (Optional) Further extractions

---

## 📞 GETTING HELP

If stuck on any task:

1. **Design Tokens**: See completed components for migration patterns
2. **Testing**: Run `pnpm test:run` for unit tests, `pnpm test:e2e` for E2E
3. **Patterns**: Look at FirefighterProfileModal.tsx or FirefightersModal.tsx for reference

---

**Total Estimated Remaining Time**: 12-18 hours

- High priority (design tokens): 3-4 hours
- Medium priority (hooks): 4-6 hours
- Optional: 5-8 hours

**Recommendation**: Complete design tokens migration systematically over 1-2 sessions.
