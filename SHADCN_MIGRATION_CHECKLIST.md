# shadcn/ui Migration Checklist

**Last Updated:** 2025-01-09  
**Status:** 8/63 components migrated (12.7%)  
**Active Sprint:** Priority 1 - Core Layout (8/8 complete ✅)

## Migration Strategy

For each component:
1. [ ] Replace `import { colors, tokens } from '@/styles/*'` with shadcn semantic classes
2. [ ] Remove `isDarkMode` prop passing (use `dark:` variants instead)
3. [ ] Replace `className={colors.bg.card}` with `className="bg-card"`
4. [ ] Test visual output matches original
5. [ ] Commit & deploy

---

## Priority 1: Core Layout (8 components) ✅ COMPLETE

Critical components affecting main app structure.

- [x] ~~`src/components/Header.tsx`~~ - ✅ Migrated (commit f029f47)
- [x] ~~`src/components/Sidebar.tsx`~~ - ✅ Migrated (this session)
- [x] ~~`src/components/MobileNav.tsx`~~ - ✅ Migrated (commit 64a1dfd)
- [x] ~~`src/components/mobile/BottomNav.tsx`~~ - ✅ Migrated (commit 1358c89)
- [x] ~~`src/App.tsx`~~ - ✅ Already clean (no migration needed)
- [x] ~~`src/components/ErrorBoundary.tsx`~~ - ✅ Migrated (this session)
- [x] ~~`src/components/ConnectionStatusIndicator.tsx`~~ - ✅ Migrated (this session)
- [x] ~~`src/components/UpdateNotification.tsx`~~ - ✅ Migrated (this session)

---

## Priority 2: Calendar System (12 components)

Main feature - calendar views and interactions.

- [ ] `src/components/Calendar.tsx` - Main calendar wrapper
- [ ] `src/components/CalendarView.tsx` - Calendar view logic
- [ ] `src/components/calendar/MainCalendar.tsx` - Calendar container
- [ ] `src/components/calendar/CalendarGrid.tsx` - Calendar grid layout
- [ ] `src/components/calendar/CalendarHeader.tsx` - Month/year header
- [ ] `src/components/calendar/CalendarLegend.tsx` - Color legend
- [ ] `src/components/calendar/DayCell.tsx` - Individual day cell
- [ ] `src/components/calendar/DayModal.tsx` - Day detail modal
- [ ] `src/components/calendar/DayScheduleModal.tsx` - Schedule detail modal
- [ ] `src/components/calendar/HoldForm.tsx` - Hold creation form
- [ ] `src/components/calendar/HoldList.tsx` - List of holds
- [ ] `src/components/CalendarSubscribeModal.tsx` - iCal subscription

---

## Priority 3: Firefighter Management (10 components)

Roster and firefighter CRUD operations.

- [ ] `src/components/FirefighterList.tsx` - Main roster list
- [ ] `src/components/FirefighterProfileModal.tsx` - Profile view/edit
- [ ] `src/components/FirefightersModal.tsx` - Firefighters management modal
- [ ] `src/components/AddFirefighterForm.tsx` - Add new firefighter
- [ ] `src/components/QuickAddFirefighterModal.tsx` - Quick add modal
- [ ] `src/components/CompleteHoldModal.tsx` - Complete hold flow
- [ ] `src/components/TransferShiftModal.tsx` - Shift transfer
- [ ] `src/components/ReactivateModal.tsx` - Reactivate firefighter
- [ ] `src/components/roster/RosterHeader.tsx` - Roster header controls
- [ ] `src/components/roster/RosterSearchBar.tsx` - Search/filter bar

---

## Priority 4: Mobile Components (5 components)

Mobile-optimized views.

- [ ] `src/components/mobile/FirefighterCard.tsx` - Mobile firefighter card
- [ ] `src/components/mobile/SwipeableCard.tsx` - Swipeable card
- [ ] `src/components/mobile/MobileWeekView.tsx` - Mobile week view
- [ ] `src/components/tablet/FirefighterGrid.tsx` - Tablet grid view
- [ ] `src/components/NextUpBar.tsx` - Next up indicator (legacy)

---

## Priority 5: UI Primitives (10 components)

Reusable UI components (may be replaced entirely).

- [ ] `src/components/ui/Modal.tsx` - Generic modal (→ use Dialog)
- [ ] `src/components/ui/IconButton.tsx` - Icon button (→ use Button)
- [ ] `src/components/ui/FloatingActionButton.tsx` - FAB (→ use Button)
- [ ] `src/components/ui/Checkbox.tsx` - Checkbox (→ shadcn Checkbox)
- [ ] `src/components/ui/Radio.tsx` - Radio (→ shadcn RadioGroup)
- [ ] `src/components/ui/Skeleton.tsx` - Skeleton (→ shadcn Skeleton)
- [ ] `src/components/ui/Spinner.tsx` - Spinner (→ shadcn custom)
- [ ] `src/components/ui/PulseLoader.tsx` - Pulse loader
- [ ] `src/components/ui/ProgressBar.tsx` - Progress bar
- [ ] `src/components/ui/AnimatedInput.tsx` - Animated input

---

## Priority 6: Utilities & Helpers (11 components)

Supporting components and utilities.

- [ ] `src/components/Toast.tsx` - Toast notifications (→ shadcn Sonner)
- [ ] `src/components/Tooltip.tsx` - Tooltips (→ shadcn Tooltip)
- [ ] `src/components/ConfirmDialog.tsx` - Confirm dialogs (→ shadcn AlertDialog)
- [ ] `src/components/EmptyState.tsx` - Empty state placeholder
- [ ] `src/components/SkeletonLoader.tsx` - Skeleton loader
- [ ] `src/components/LoginModal.tsx` - Login modal
- [ ] `src/components/BattalionChiefLogin.tsx` - BC login
- [ ] `src/components/HelpModal.tsx` - Help modal
- [ ] `src/components/KeyboardShortcutsModal.tsx` - Shortcuts modal
- [ ] `src/components/ActivityLogModal.tsx` - Activity log
- [ ] `src/components/ActivityLog.tsx` - Activity log component

---

## Priority 7: Additional Features (7 components)

Secondary features and enhancements.

- [ ] `src/components/Reports.tsx` - Reports view
- [x] ~~`src/components/roster/BulkActions.tsx`~~ - ✅ Migrated (uses Button, Card)
- [x] ~~`src/components/roster/ExportMenu.tsx`~~ - ✅ Migrated (uses Button, DropdownMenu)
- [ ] `src/components/FilterPanel.tsx` - Filter panel
- [x] ~~`src/components/StationSelector.tsx`~~ - ✅ Migrated (pure shadcn semantic classes)
- [ ] `src/components/NextUpBarV2.tsx` - Next up bar v2
- [x] ~~`src/components/MetricCard.tsx`~~ - ✅ Migrated (uses Card component)

---

## Files to DELETE (after migration)

These are duplicates or obsolete:

- [ ] `src/components/ListView.tsx` - Duplicate of FirefighterList
- [ ] `src/components/Breadcrumb.tsx` - Unused navigation breadcrumb
- [ ] `src/components/GridOverlay.tsx` - Dev-only grid overlay
- [ ] `src/components/Common/ResponsiveModal.tsx` - Duplicate of ui/Modal
- [ ] `src/components/Form/Checkbox.tsx` - Duplicate of ui/Checkbox
- [ ] `src/components/Form/RadioGroup.tsx` - Duplicate of ui/Radio
- [ ] `src/components/transitions/Collapsible.tsx` - Unused
- [ ] `src/components/transitions/EmptyState.tsx` - Duplicate

**Total to delete:** 8 files (~15KB)

---

## Style Files to DELETE (after all migrations)

Once all components use shadcn semantic classes:

- [ ] `src/styles/tokens.ts` (11KB)
- [ ] `src/styles/colorSystem.ts` (9KB)
- [ ] `src/styles/gridUtilities.ts` (8.6KB)
- [ ] `src/styles/colorTokens.ts` (5.5KB)
- [ ] `src/styles/spacingTokens.ts` (3.7KB)
- [ ] `src/styles/index.ts` (1KB)
- [ ] `src/utils/calendarTheme.ts`
- [ ] `src/utils/sidebarTheme.ts`

**Total to delete:** ~40KB of legacy theme code

---

## Migration Examples

### Before (Legacy):
```tsx
import { colors, tokens } from '@/styles/tokens';

<div className={`${colors.bg.card} ${colors.text.primary}`}>
  <h2 className={tokens.typography.heading.h2}>Title</h2>
</div>
```

### After (shadcn):
```tsx
<div className="bg-card text-foreground">
  <h2 className="text-2xl font-bold">Title</h2>
</div>
```

### Dark Mode:
```tsx
// Before
<div className={isDarkMode ? 'bg-slate-900' : 'bg-white'}>

// After
<div className="bg-background dark:bg-slate-900">
```

---

## Testing Checklist (Per Component)

After migrating each component:

1. [ ] Build passes (`pnpm build`)
2. [ ] TypeScript has no errors (`pnpm typecheck`)
3. [ ] Visual output matches original (screenshot comparison)
4. [ ] Dark mode works correctly
5. [ ] Mobile responsive behavior unchanged
6. [ ] No console errors in browser
7. [ ] Commit with descriptive message
8. [ ] Deploy to Vercel
9. [ ] Verify in production

---

## Estimated Effort

- **Per component:** 15-30 minutes
- **Total time:** 16-32 hours
- **Recommended:** 5-10 components per session
- **Timeline:** 6-12 sessions (1-2 weeks)

---

## Progress Tracking

Update this section as you complete components:

**Session 1 (Date: 2025-01-09):**
- Components migrated: 4 (Sidebar, ErrorBoundary, ConnectionStatusIndicator, UpdateNotification)
- Components already clean: 4 (Header, MobileNav, BottomNav, App)
- **Priority 1 Complete:** ✅ All 8 core layout components migrated
- Time spent: ~45min
- Build status: ✅ Passing
- Notes: Replaced all legacy `colors` and `tokens` imports with shadcn semantic classes. MobileNav still uses conditional dark mode classes (acceptable for gradient backgrounds).

**Session 2 (Date: ___):**
- Components migrated: 0
- Time spent: 0h

---

## Notes

- Always test on localhost first
- Use browser DevTools to compare before/after
- Keep git commits small and focused
- Deploy frequently to catch issues early
- Document any visual changes in commit message

