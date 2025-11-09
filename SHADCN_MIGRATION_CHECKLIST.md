# shadcn/ui Migration Checklist

**Last Updated:** 2025-01-09  
**Status:** 58/63 components migrated (92.1%)  
**Active Sprint:** Final cleanup and legacy code removal

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

## Priority 2: Calendar System (12 components) ✅ COMPLETE

Main feature - calendar views and interactions.

- [x] ~~`src/components/Calendar.tsx`~~ - ✅ Migrated
- [x] ~~`src/components/CalendarView.tsx`~~ - ✅ Migrated
- [x] ~~`src/components/calendar/MainCalendar.tsx`~~ - ✅ Already clean
- [x] ~~`src/components/calendar/CalendarGrid.tsx`~~ - ✅ Migrated
- [x] ~~`src/components/calendar/CalendarHeader.tsx`~~ - ✅ Already clean
- [x] ~~`src/components/calendar/CalendarLegend.tsx`~~ - ✅ Migrated
- [x] ~~`src/components/calendar/DayCell.tsx`~~ - ✅ Migrated
- [x] ~~`src/components/calendar/DayModal.tsx`~~ - ✅ Migrated
- [x] ~~`src/components/calendar/DayScheduleModal.tsx`~~ - ✅ Migrated
- [x] ~~`src/components/calendar/HoldForm.tsx`~~ - ✅ Migrated
- [x] ~~`src/components/calendar/HoldList.tsx`~~ - ✅ Migrated
- [x] ~~`src/components/CalendarSubscribeModal.tsx`~~ - ✅ Migrated

---

## Priority 3: Firefighter Management (10 components) ✅ 7/10 COMPLETE

Roster and firefighter CRUD operations.

- [x] ~~`src/components/FirefighterList.tsx`~~ - ✅ Minimal migration (kept stable)
- [ ] `src/components/FirefighterProfileModal.tsx` - ⚠️ Complex, kept existing (stable)
- [ ] `src/components/FirefightersModal.tsx` - ⚠️ Complex, kept existing (stable)
- [x] ~~`src/components/AddFirefighterForm.tsx`~~ - ✅ Migrated
- [x] ~~`src/components/QuickAddFirefighterModal.tsx`~~ - ✅ Migrated
- [x] ~~`src/components/CompleteHoldModal.tsx`~~ - ✅ Migrated
- [x] ~~`src/components/TransferShiftModal.tsx`~~ - ✅ Migrated
- [x] ~~`src/components/ReactivateModal.tsx`~~ - ✅ Migrated
- [x] ~~`src/components/roster/RosterHeader.tsx`~~ - ✅ Already clean
- [x] ~~`src/components/roster/RosterSearchBar.tsx`~~ - ✅ Already clean

---

## Priority 4: Mobile Components (5 components) ✅ COMPLETE

Mobile-optimized views.

- [x] ~~`src/components/mobile/FirefighterCard.tsx`~~ - ✅ Migrated
- [x] ~~`src/components/mobile/SwipeableCard.tsx`~~ - ✅ Migrated
- [x] ~~`src/components/mobile/MobileWeekView.tsx`~~ - ✅ Already clean
- [x] ~~`src/components/tablet/FirefighterGrid.tsx`~~ - ✅ Migrated
- [x] ~~`src/components/NextUpBar.tsx`~~ - ✅ Migrated

---

## Priority 5: UI Primitives (10 components) ✅ COMPLETE

Reusable UI components (may be replaced entirely).

- [x] ~~`src/components/ui/Modal.tsx`~~ - ✅ Migrated to Tailwind primitives
- [x] ~~`src/components/ui/IconButton.tsx`~~ - ✅ Already wraps shadcn Button
- [x] ~~`src/components/ui/FloatingActionButton.tsx`~~ - ✅ Already clean
- [x] ~~`src/components/ui/Checkbox.tsx`~~ - ✅ Already shadcn
- [x] ~~`src/components/ui/Radio.tsx`~~ - ✅ N/A (doesn't exist)
- [x] ~~`src/components/ui/Skeleton.tsx`~~ - ✅ Already shadcn
- [x] ~~`src/components/ui/Spinner.tsx`~~ - ✅ Already clean
- [x] ~~`src/components/ui/PulseLoader.tsx`~~ - ✅ Already clean
- [x] ~~`src/components/ui/ProgressBar.tsx`~~ - ✅ Already clean
- [x] ~~`src/components/ui/AnimatedInput.tsx`~~ - ✅ Already clean

---

## Priority 6: Utilities & Helpers (11 components) ✅ COMPLETE

Supporting components and utilities.

- [x] ~~`src/components/Toast.tsx`~~ - Toast notifications (→ shadcn Sonner)
- [x] ~~`src/components/Tooltip.tsx`~~ - ✅ Migrated (wraps shadcn Tooltip) (commit d12a07f)
- [x] ~~`src/components/ConfirmDialog.tsx`~~ - ✅ Migrated (uses shadcn AlertDialog) (commit d12a07f)
- [x] ~~`src/components/EmptyState.tsx`~~ - ✅ Migrated (uses Button, shadcn semantic classes)
- [x] ~~`src/components/SkeletonLoader.tsx`~~ - ✅ Migrated (uses shadcn semantic classes, cn utility)
- [x] ~~`src/components/LoginModal.tsx`~~ - ✅ Migrated (uses Dialog, Input, Label) (commit 18ee07f)
- [x] ~~`src/components/BattalionChiefLogin.tsx`~~ - ✅ Migrated (uses Dialog, Input, Label, Alert, Button)
- [x] ~~`src/components/HelpModal.tsx`~~ - ✅ Migrated (uses Dialog, Button) (commit 2bf6036)
- [x] ~~`src/components/KeyboardShortcutsModal.tsx`~~ - ✅ Migrated (uses Dialog, Button) (commit 2bf6036)
- [x] ~~`src/components/ActivityLogModal.tsx`~~ - ✅ Migrated (uses Dialog, shadcn semantic classes)
- [x] ~~`src/components/ActivityLog.tsx`~~ - ✅ Migrated (uses Card, Button, semantic classes)

---

## Priority 7: Additional Features (7 components) ✅ COMPLETE

Secondary features and enhancements.

- [x] ~~`src/components/Reports.tsx`~~ - ✅ Migrated (uses Card, Button, shadcn semantic classes)
- [x] ~~`src/components/roster/BulkActions.tsx`~~ - ✅ Migrated (uses Button, Card)
- [x] ~~`src/components/roster/ExportMenu.tsx`~~ - ✅ Migrated (uses Button, DropdownMenu)
- [x] ~~`src/components/FilterPanel.tsx`~~ - ✅ Migrated (uses Dialog, Button, Checkbox)
- [x] ~~`src/components/StationSelector.tsx`~~ - ✅ Migrated (pure shadcn semantic classes)
- [x] ~~`src/components/NextUpBarV2.tsx`~~ - ✅ Migrated (removed isDarkMode, uses semantic classes)
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

**Session 3 (Date: 2025-01-09):**
- Components migrated: 9 (SkeletonLoader, EmptyState, BattalionChiefLogin, IconButton)
- Priority 6: 8/11 complete (73%)
- Priority 5: Started (1/10 complete)
- Time spent: ~60min
- Build status: ✅ Passing
- Notes: Migrated bottom-up from Priority 7 → Priority 5. EmptyState now uses Button component. BattalionChiefLogin uses Input, Label, Alert. IconButton wraps shadcn Button. SkeletonLoader uses pure semantic classes.

---

## Notes

- Always test on localhost first
- Use browser DevTools to compare before/after
- Keep git commits small and focused
- Deploy frequently to catch issues early
- Document any visual changes in commit message

