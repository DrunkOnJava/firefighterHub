# FirefighterHub - Full Functionality Integration Plan

**Date:** November 6, 2025
**Goal:** Restore all backend functionality while keeping the new clean MaterialM layout

---

## Current State

### ✅ What's Working
- Clean MaterialM OKLCH color layout
- All 3 "Next Up" chips displaying correctly
- 20 firefighters visible in roster
- Calendar grid displays correctly
- Basic data loading from Supabase

### ❌ What's Missing (All functionality from commit a319cf3)
- **No click handlers** - Calendar days don't do anything
- **No roster interactions** - Can't drag-drop, click, or edit firefighters
- **No modals** - All the modal dialogs are not being rendered
- **No admin mode** - No authentication or permissions
- **No CRUD operations** - Can't add, edit, delete, or reorder firefighters
- **No hold scheduling** - Can't schedule or complete holds
- **No keyboard shortcuts** - Accessibility features missing
- **No dark mode** - Toggle not wired up

---

## What Still Exists in Codebase

### ✅ All Components Still Present
Located in `src/components/`:
- ActivityLogModal.tsx
- Calendar.tsx (full interactive version)
- CompleteHoldModal.tsx
- ConfirmDialog.tsx
- FirefighterList.tsx (full featured)
- Header.tsx (with all controls)
- HelpModal.tsx
- KeyboardShortcutsModal.tsx
- LoginModal.tsx
- MobileNav.tsx
- QuickAddFirefighterModal.tsx
- Reports.tsx
- Sidebar.tsx (with metrics)
- TransferShiftModal.tsx
- UpdateNotification.tsx

### ✅ All Backend Logic Intact
`useFirefighters.ts` exports:
- firefighters, deactivatedFirefighters
- loading, isOperationLoading, loadingStates
- **addFirefighter()** - Create new firefighter
- **completeHold()** - Complete a hold and rotate position
- **deleteFirefighter()** - Hard delete
- **deactivateFirefighter()** - Soft delete (is_active = false)
- **reactivateFirefighter()** - Restore deactivated firefighter
- **transferShift()** - Move firefighter to different shift
- **resetAll()** - Reset all positions to 0-indexed order
- **masterReset()** - Complete database reset (dangerous!)
- **reorderFirefighters()** - Drag-drop reordering

`useScheduledHolds.ts` exports:
- scheduledHolds, loading
- **scheduleHold()** - Create new scheduled hold
- **removeScheduledHold()** - Delete scheduled hold
- **markHoldCompleted()** - Mark hold as completed

### ✅ All Hooks Available
- useAuth() - Supabase authentication
- useConfirm() - Confirmation dialogs
- useDarkMode() - Dark mode toggle
- useKeyboardShortcuts() - Keyboard navigation
- useToast() - Toast notifications
- useAnnounce() - Screen reader announcements

---

## Integration Phases

### Phase 1: Modal Infrastructure (30 min)
**File:** `src/App.tsx`

1. Import all modal components
2. Add state for modal visibility (11 modals)
3. Add state for selected firefighter
4. Add event handler functions (onCompleteHold, onTransfer, etc.)
5. Render all modals at bottom of App

**Result:** All modals available but not yet triggered

---

### Phase 2: Interactive Calendar (1 hour)
**File:** `src/App.tsx` - Replace static calendar with full Calendar component

**Changes:**
1. Import `Calendar` component (not building our own)
2. Pass all required props:
   - firefighters, scheduledHolds
   - onScheduleHold, onRemoveHold, onMarkCompleted
   - isAdminMode, isDarkMode, currentShift
3. Wire up `DayModal` to open when clicking calendar days
4. Add event pills rendering inside calendar cells

**Result:** Click calendar days → Modal opens → Schedule/view holds

---

### Phase 3: Interactive Roster (1 hour)
**File:** `src/App.tsx` - Replace static roster with FirefighterList

**Changes:**
1. Import `FirefighterList` component
2. Pass all required props:
   - firefighters, deactivatedFirefighters
   - All CRUD functions (onAdd, onDelete, onDeactivate, etc.)
   - onReorder for drag-drop
   - currentShift, isAdminMode
3. Wire up roster row clicks to open profile modal
4. Add drag-drop reordering

**Result:** Click firefighter → Profile modal → Edit/View details
Drag-drop → Reorder rotation

---

### Phase 4: Header & Controls (30 min)
**File:** `src/App.tsx` - Replace simple header with Header component

**Changes:**
1. Import `Header` component
2. Pass props:
   - onShowHelp, onShowActivityLog, onQuickAdd
   - onOpenMobileMenu
   - isAdminMode, currentShift, onShiftChange
   - isDarkMode, onToggleDarkMode
3. Make shift badges clickable (currently static)
4. Add Activity/Light/Help click handlers

**Result:** All header buttons functional

---

### Phase 5: Sidebar with Metrics (30 min)
**File:** `src/App.tsx` - Add Sidebar component

**Changes:**
1. Import `Sidebar` component
2. Calculate metrics (total firefighters, available, on hold)
3. Pass firefighters, scheduledHolds, currentShift
4. Add Reports view switching

**Result:** See stats, switch to Reports view

---

### Phase 6: Authentication & Admin Mode (1 hour)
**File:** `src/App.tsx`

**Changes:**
1. Import `useAuth` hook and `LoginModal`
2. Add `isAdminMode` based on `useAuth().isAdmin`
3. Conditionally show/hide edit buttons based on admin mode
4. Add "Login" button in Help modal for battalion chiefs
5. Wire up all admin-only operations

**Result:** Battalion chiefs can log in → Full edit access
Regular users → Read-only view

---

### Phase 7: Keyboard Shortcuts (30 min)
**File:** `src/App.tsx`

**Changes:**
1. Import `useKeyboardShortcuts` hook
2. Define shortcuts array:
   - `/` or `Ctrl+K` → Focus search
   - `Ctrl+N` → Quick add firefighter (admin only)
   - `Ctrl+E` → Export data
   - `?` → Show help
   - `Ctrl+?` → Show shortcuts modal
   - `Esc` → Close modals
3. Add `KeyboardShortcutsModal` component
4. Pass shortcuts array to modal

**Result:** Full keyboard navigation working

---

### Phase 8: Dark Mode Toggle (15 min)
**File:** `src/App.tsx`

**Changes:**
1. Import `useDarkMode` hook
2. Get `{ isDarkMode, toggleDarkMode }`
3. Pass to Header component
4. Add dark mode classes to root element
5. Ensure CSS variables work in both modes

**Result:** Click Light/Dark → Toggle theme

---

### Phase 9: Remaining Features (1 hour)
**File:** `src/App.tsx`

**Changes:**
1. Add `UpdateNotification` component (service worker updates)
2. Add `ConfirmDialog` for destructive operations
3. Add `useConfirm` hook for confirmations
4. Add `useAnnounce` for screen reader announcements
5. Wire up mobile navigation menu

**Result:** All auxiliary features working

---

## Testing Checklist

### Calendar Interactions
- [ ] Click day → Modal opens
- [ ] Schedule hold → Appears in calendar
- [ ] Complete hold → Moves firefighter to bottom
- [ ] Delete hold → Removed from calendar
- [ ] Past dates read-only (unless admin)

### Roster Interactions
- [ ] Click firefighter → Profile modal opens
- [ ] Drag-drop → Reorders rotation (admin only)
- [ ] Add firefighter → Creates new entry (admin only)
- [ ] Deactivate → Moves to deactivated list (admin only)
- [ ] Transfer shift → Moves to different shift (admin only)

### Admin Mode
- [ ] Login as battalion chief → Admin mode enabled
- [ ] All edit buttons visible
- [ ] Can perform CRUD operations
- [ ] Logout → Back to read-only

### Keyboard Shortcuts
- [ ] `/` → Focuses search bar
- [ ] `Ctrl+N` → Opens quick add (admin)
- [ ] `?` → Shows help modal
- [ ] `Esc` → Closes modals
- [ ] All shortcuts listed in modal

### Data Integrity
- [ ] Hold completion rotates positions correctly
- [ ] No duplicate positions after operations
- [ ] Activity log records all actions
- [ ] Real-time sync works across tabs

---

## File Size Impact

### Current Bundle
- JS: 343.04 KB
- CSS: 76.81 KB

### Expected After Integration
- JS: ~450-500 KB (+~150 KB for modals and logic)
- CSS: ~80 KB (minimal change)

**Mitigation:**
- Use code splitting for modals (lazy load)
- Tree-shake unused components
- Compress with Vite's built-in minification

---

## Migration Strategy

### Option A: Incremental (Recommended)
1. Add one feature at a time
2. Test thoroughly after each phase
3. Commit after each working phase
4. Deploy to production after each phase
5. **Estimated time:** 6-8 hours total

### Option B: Big Bang
1. Add everything at once
2. Test end-to-end
3. Deploy when all features work
4. **Estimated time:** 4-6 hours (higher risk)

**Recommendation:** Use Option A (Incremental) to minimize risk of breaking the working layout.

---

## Next Steps

1. **Review this plan with user** - Confirm approach
2. **Start Phase 1** - Add modal infrastructure
3. **Test on localhost** - Verify no regressions
4. **Commit and deploy** - Push working state
5. **Continue phases** - One at a time, testing each

---

## Success Criteria

✅ **Layout Unchanged** - New MaterialM design stays intact
✅ **All Features Working** - Everything from commit a319cf3 restored
✅ **No Regressions** - Current "Next Up" functionality still works
✅ **Performance OK** - Bundle size reasonable (<500 KB JS)
✅ **Tests Pass** - All existing tests still pass
✅ **Deployed** - Working in production

---

**Status:** Ready to begin Phase 1
**Next Action:** Await user approval to proceed
