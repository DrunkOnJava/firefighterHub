# Mobile Testing Guide - Manual Verification

**Created**: November 7, 2025  
**Purpose**: Verify mobile UI/UX enhancements work correctly

---

## Prerequisites

1. **Start Dev Server**:
   ```bash
   cd /Users/griffin/Projects/firefighterHub
   pnpm dev
   ```
   Opens at: http://localhost:5173

2. **Open Chrome DevTools**:
   - Press `Cmd + Option + I` (Mac) or `F12` (Windows/Linux)
   - Click "Toggle Device Toolbar" icon (or `Cmd + Shift + M`)

---

## Test Checklist

### ✅ Test 1: Mobile Scrolling (375px - iPhone 12/13)

**Steps**:
1. Set viewport to 375px x 812px in DevTools
2. Load http://localhost:5173
3. Try scrolling the page

**Expected Results**:
- ✅ Page scrolls naturally (not locked to viewport)
- ✅ Content extends beyond single screen
- ✅ Scroll bar appears when content overflows

**Screenshot Location**: Take screenshot for verification

---

### ✅ Test 2: Mobile Week View Calendar

**Steps**:
1. Stay at 375px viewport
2. Navigate to Calendar tab (if bottom nav exists)
3. Observe calendar layout

**Expected Results**:
- ✅ Calendar shows single week view (not month grid)
- ✅ Days are displayed horizontally
- ✅ Touch targets are at least 44px x 44px
- ✅ Can swipe left/right to change weeks

---

### ✅ Test 3: Bottom Tab Navigation

**Steps**:
1. At 375px viewport
2. Look at bottom of screen

**Expected Results**:
- ✅ Fixed bottom navigation bar visible
- ✅ Three tabs: Home, Calendar, Activity
- ✅ Icons are clear and labeled
- ✅ Active tab is highlighted
- ✅ Tabs have 44px minimum height

---

### ✅ Test 4: NextUpBar Mobile Layout

**Steps**:
1. At 375px viewport
2. Scroll to NextUpBar section

**Expected Results**:
- ✅ Horizontal scrolling for shift cards
- ✅ Each card is ~85vw wide
- ✅ Smooth snap-to-position scrolling
- ✅ Shows all 3 shifts (A, B, C)

---

### ✅ Test 5: Touch Targets (WCAG 2.1 AA)

**Steps**:
1. At 375px viewport
2. Inspect button sizes with DevTools

**Expected Results**:
- ✅ All buttons ≥ 44px x 44px
- ✅ Icon-only buttons have adequate padding
- ✅ Form inputs ≥ 44px height
- ✅ Tap targets have proper spacing (no overlap)

---

### ✅ Test 6: Responsive Breakpoints

**Test at Different Viewports**:

| Viewport | Width | Expected Layout |
|----------|-------|-----------------|
| iPhone SE | 320px | Mobile (week view, bottom nav) |
| iPhone 12 | 375px | Mobile (week view, bottom nav) |
| iPhone Pro Max | 428px | Mobile (week view, bottom nav) |
| iPad Mini | 768px | Desktop (month grid, header nav) |
| Desktop | 1024px+ | Desktop (month grid, header nav) |

---

### ✅ Test 7: Safe Area Insets (Notched Devices)

**Steps**:
1. In DevTools, select iPhone 14 Pro or iPhone 15 Pro
2. Check bottom navigation padding

**Expected Results**:
- ✅ Bottom nav has extra padding for notch
- ✅ Content doesn't get cut off by notch
- ✅ Uses `env(safe-area-inset-bottom)`

---

### ✅ Test 8: Dark Mode on Mobile

**Steps**:
1. At 375px viewport
2. Toggle dark mode
3. Verify all mobile components update

**Expected Results**:
- ✅ Bottom nav updates colors
- ✅ Mobile week view uses dark theme
- ✅ Touch targets remain visible
- ✅ Contrast remains WCAG compliant

---

## Quick Verification Commands

```bash
# Check mobile CSS is present
grep -A 5 "@media (max-width: 767px)" src/index.css | head -20

# Verify mobile components exist
ls -la src/components/mobile/

# Check mobile hooks
ls -la src/hooks/useTouchGestures.ts

# Verify build passes
pnpm build
```

---

## Screenshot Locations for Documentation

Take screenshots and save to:
```
/Users/griffin/Projects/firefighterHub/verification-screenshots/mobile/
```

Recommended screenshots:
1. `mobile-375px-home.png` - Initial mobile view
2. `mobile-375px-scrolled.png` - After scrolling
3. `mobile-calendar-week-view.png` - Week view calendar
4. `mobile-bottom-nav.png` - Bottom navigation
5. `mobile-nextup-horizontal.png` - NextUpBar scrolling
6. `tablet-768px.png` - Tablet breakpoint
7. `desktop-1024px.png` - Desktop breakpoint

---

## Common Issues & Fixes

### Issue: Page not scrolling
**Fix**: Check `src/index.css` has mobile overflow override:
```css
@media (max-width: 767px) {
  html, body {
    overflow: auto;
  }
}
```

### Issue: Bottom nav not showing
**Fix**: Check `src/App.tsx` imports BottomNav component:
```typescript
import { BottomNav } from './components/mobile/BottomNav';
```

### Issue: Calendar still showing month view
**Fix**: Check `src/components/Calendar.tsx` uses device detection:
```typescript
const device = useDevice();
if (device.isMobile) {
  return <MobileWeekView ... />
}
```

---

## Automated Testing (Future)

Once manual testing is verified, run:
```bash
# E2E tests with Playwright
pnpm test:e2e

# Mobile-specific tests
pnpm test:e2e:mobile
```

---

**Status**: Ready for manual testing ✅  
**Dev Server**: http://localhost:5173  
**Chrome DevTools**: `Cmd + Option + I` → Toggle Device Toolbar

