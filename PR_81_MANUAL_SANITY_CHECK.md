# PR #81 Manual Sanity Check

**Perform these checks before declaring "ready to merge"**

---

## ✅ Pre-Flight Checklist

### Build & TypeScript
- [x] `npm run typecheck` - Passes (test dep warnings ok)
- [x] `npm run build` - Passes in ~12s
- [x] Bundle size: 116.82 kB gzipped (acceptable)

---

## 🧪 Manual Testing Checklist

### 1. Admin Mode Testing (isAdminMode=true)

#### Desktop (≥1024px)
- [ ] **Admin Menu Appears**
  - Hover over any firefighter in roster sidebar
  - MoreVertical (⋮) button fades in on right side
  - Click button → dropdown menu opens

- [ ] **Admin Menu Actions Work**
  - [ ] "Complete Hold" - Click → opens complete hold modal/action
  - [ ] "Volunteer for Hold" - Click → triggers volunteer action
  - [ ] "Transfer Shift" - Click → opens transfer shift modal
  - [ ] "Deactivate" (for active FF) - Click → deactivates firefighter
  - [ ] "Reactivate" (for inactive FF) - Click → reactivates firefighter
  - [ ] "Delete" (red text) - Click → deletes firefighter (with confirmation)

- [ ] **Admin Menu Keyboard Accessibility**
  - Tab to firefighter row
  - Press Enter → expands details
  - Tab again → focuses MoreVertical button
  - Press Enter or Space → opens menu
  - Arrow keys → navigate menu items
  - Enter → activates menu item
  - Escape → closes menu

#### Mobile (<768px)
- [ ] Open roster drawer (hamburger menu)
- [ ] Hover/long-press firefighter row
- [ ] Admin menu appears and works same as desktop

---

### 2. Non-Admin Mode Testing (isAdminMode=false)

- [ ] **Admin Menu Hidden**
  - Hover over firefighter rows
  - MoreVertical button never appears
  - Only expand/collapse chevron visible

---

### 3. Safe Handler Testing

#### With Handlers Provided (Normal Operation)
- [ ] All admin actions execute normally
- [ ] No toast notifications about "unavailable"
- [ ] No console errors about missing handlers

#### Without Handlers Provided (Fail-Safe Testing)

**Manual Test Setup:**
Remove one handler from SchedulePage props (e.g., comment out `onCompleteHold`)

```typescript
// onCompleteHold={createSafeHandler(onCompleteHold, 'complete hold')}
onCompleteHold={createSafeHandler(undefined, 'complete hold')}
```

- [ ] Click "Complete Hold" in admin menu
- [ ] **Expected:**
  - Destructive toast appears: "Action Unavailable"
  - Console error logged: "Handler not provided: complete hold"
  - Menu closes, no crash

**Cleanup:** Restore the handler after testing

---

### 4. "Coming Soon" Toast Testing

- [ ] **New Event Button** (admin mode only, desktop)
  - Click "New Event" button in header
  - Toast appears: "Coming Soon - Event creation modal is under development"

- [ ] **Search Button** (all modes)
  - Click search icon in header
  - Toast appears: "Coming Soon - Search functionality will be available soon"

- [ ] **Settings Button** (admin mode only, desktop)
  - Click settings icon in header
  - Toast appears: "Coming Soon - Settings panel is under development"

---

### 5. Light Mode Testing

- [ ] **Toggle to Light Mode**
  - Click theme toggle (sun/moon icon)
  - Page switches to light theme

- [ ] **Event Blocks Visible**
  - Calendar shows scheduled holds
  - Event blocks have proper colors:
    - Blue for scheduled
    - Teal for completed
    - Red for skipped
  - **Critical:** NOT invisible (this was the original bug)

- [ ] **Roster Readable**
  - Sidebar text has good contrast
  - Numbers, names, details all visible

---

### 6. Dark Mode Testing (Default)

- [ ] Calendar loads in dark theme (#020617 background)
- [ ] Event blocks visible with proper colors
- [ ] Roster sidebar has good contrast

---

### 7. Roster Numbering Testing

- [ ] **Default View (No Filter)**
  - Roster shows all firefighters
  - Numbers match `order_position` (1, 2, 3, 4...)

- [ ] **Filtered View (Available Only)**
  - Click "Available" filter button
  - Some firefighters hidden
  - **Visible firefighters keep original numbers** (e.g., 1, 3, 5 if 2 & 4 unavailable)
  - **NOT sequential** (e.g., NOT 1, 2, 3)
  - **This is correct behavior** ✅

- [ ] **Sorted View**
  - Click sort toggle (Position → Name → Last Hold)
  - Numbers still match `order_position`
  - Order changes but numbers don't renumber sequentially

---

### 8. Error Logging Testing

**Check browser console (F12 → Console tab)**

#### Normal Operation
- [ ] No unexpected errors
- [ ] Only intentional error logs appear if invalid data

#### Invalid Date Test
**Manual Setup:** Edit a firefighter in database to have invalid `last_hold_date` (e.g., "invalid-date-string")

- [ ] Expand firefighter details
- [ ] Console shows error log:
  ```
  Failed to parse firefighter last_hold_date: {
    firefighterId: "...",
    firefighterName: "...",
    rawDate: "invalid-date-string",
    error: "..."
  }
  ```
- [ ] UI shows "Invalid date" instead of crashing

**Cleanup:** Fix the date in database after testing

---

### 9. Mobile Responsive Testing

#### iPhone (375px width)
- [ ] Hamburger menu (☰) appears in header
- [ ] Click hamburger → roster drawer slides in from left
- [ ] Overlay backdrop appears
- [ ] Click overlay → drawer closes
- [ ] X button in drawer → closes drawer
- [ ] Admin menu works in drawer (if admin mode)

#### iPad (768px width)
- [ ] Same as iPhone
- [ ] Calendar remains functional
- [ ] Month navigation works

---

### 10. Regression Testing

- [ ] **Calendar Navigation**
  - Prev/Next month buttons work
  - "Today" button jumps to current month
  - Mobile month nav (below header) works

- [ ] **Firefighter Selection**
  - Click firefighter → highlights in list
  - Their events highlighted in calendar
  - Selection persists when switching months

- [ ] **Next Up Band**
  - Shows next-up firefighters for each shift
  - Click firefighter → selects them

---

## 🐛 Known Issues (Expected, Not Blockers)

1. **"Coming Soon" Toasts**
   - Search, New Event, Settings buttons show placeholder toasts
   - **Expected:** Tracked in follow-up issues #XX, #XX, #XX

2. **Test Dependency Warnings (TypeScript)**
   ```
   error TS2688: Cannot find type definition file for '@testing-library/jest-dom'.
   error TS2688: Cannot find type definition file for 'vitest/globals'.
   ```
   - **Expected:** Dev dependencies not installed
   - **Does NOT affect production build**

---

## ✅ Sign-Off Criteria

All checkboxes above should be [x] before merging.

**If any test fails:**
1. Document the failure
2. Assess severity (P0 blocker vs. P1 fix-later)
3. Fix P0 blockers before merge
4. Create issues for P1 items

---

## 📸 Screenshots to Attach to PR

**Recommended screenshots for PR description:**

1. **Admin Menu (Desktop)**
   - Hover state showing MoreVertical button
   - Open menu with all actions visible

2. **Light Mode Event Blocks**
   - Calendar showing colored event blocks
   - Proves light mode fix works

3. **Mobile Drawer**
   - Roster drawer open on mobile
   - Admin menu working in drawer

4. **Toast Notifications**
   - "Coming Soon" toast for Search
   - "Action Unavailable" toast (safe handler fallback)

---

## 🎯 Final Checklist Before Merge

- [ ] All manual tests above pass
- [ ] Screenshots attached to PR
- [ ] Follow-up issues created (#XX-#XX)
- [ ] PR description updated with Review Response
- [ ] No unresolved review comments
- [ ] At least 1 approval from team member
- [ ] CI/CD checks pass (if applicable)

**Status:** [ ] READY TO MERGE ✅
