# User Feedback - October 29, 2025
**Source**: Real firefighter using live production app
**Status**: 🔴 **CRITICAL - Must fix before next deployment**

---

## 🚨 Critical Bugs (Breaking Functionality)

### 1. Members Can't Be Scheduled ⚠️
**Issue**: Unable to schedule members
**Priority**: P0 - BLOCKING
**Status**: 🔴 Not Started
**File**: Likely `src/components/Calendar.tsx` or hold creation logic

### 2. Completing Hold Doesn't Move Member to Bottom 🐛
**Issue**: When completing a hold:
- Notification says member moved to bottom
- Member's position doesn't actually change
- Last hold date doesn't update
- Example: Wilocks completed hold but stayed in same position
**Priority**: P0 - BLOCKING
**Status**: 🔴 Not Started
**Files**:
- `src/components/Calendar.tsx` (complete hold logic)
- `src/utils/calendarUtils.ts` (rotation logic)

### 3. Last Hold Date Off By One Day 🐛
**Issue**: Last hold date displays one day before the actual hold date
**Priority**: P0 - DATA INTEGRITY
**Status**: 🔴 Not Started
**Likely Cause**: Timezone conversion issue
**Files**:
- Date handling in Calendar component
- Database queries converting timestamps

### 4. Duplicate Holds in Member Profiles 🐛
**Issue**:
- Some members show duplicate holds (e.g., George has hold on 9/6 duplicated)
- Affects A shift members
- Does NOT affect C shift members
**Priority**: P1 - DATA INTEGRITY
**Status**: 🔴 Not Started
**Files**:
- Hold creation/completion logic
- Database queries that fetch member holds

---

## 🎨 UI/UX Issues (Non-Breaking)

### 5. Remove Hours Worked from Rotation View
**Issue**: Hours worked display can't be accurately calculated without manual scheduling program data
**Action**: Remove from both:
- View-only mode
- Admin mode
**Priority**: P1 - USER REQUEST
**Status**: 🔴 Not Started
**Files**: `src/components/FirefighterList.tsx` (lines 895-910)

### 6. Station Number Display Wrong for Past Holds
**Issue**: Member's assigned station number (home station) shows under their name on calendar for previous holds
**Expected**: Should show the station they were HELD AT (not home station)
**Priority**: P1 - CONFUSING UX
**Status**: 🔴 Not Started
**Files**: `src/components/Calendar.tsx` (hold display logic)

### 7. Remove Analytics from View-Only Mode
**Issue**: Analytics/reports should not be visible in view-only mode
**Action**: Hide Reports dashboard access when in view-only mode
**Priority**: P2 - PERMISSIONS
**Status**: 🔴 Not Started
**Files**:
- `src/App.tsx` (view switching logic)
- Permission checks

### 8. "Holds by Shift" Missing Data
**Issue**: "Holds by shift" chart only shows one shift, should show all 3 (A, B, C)
**Priority**: P2 - VISUALIZATION
**Status**: 🔴 Not Started
**Files**: `src/components/Reports.tsx` (shift breakdown chart)

### 9. Remove "Top Firefighter" from Metrics
**Issue**: "Top Firefighter" metric should be removed from Hold Metrics Dashboard
**Priority**: P2 - USER REQUEST
**Status**: 🔴 Not Started
**Files**: `src/components/Reports.tsx`

### 10. Add Return Button to Metrics Dashboard
**Issue**: No way to navigate back to main dashboard from Hold Metrics
**Action**: Add "Back to Calendar" or "Return to Dashboard" button
**Priority**: P2 - NAVIGATION
**Status**: 🔴 Not Started
**Files**: `src/components/Reports.tsx`

### 11. Calendar Button Non-Functional
**Issue**: Calendar button next to Reports button doesn't work in either mode
**Action**: Fix button click handler to switch to calendar view
**Priority**: P2 - NAVIGATION
**Status**: 🔴 Not Started
**Files**: `src/App.tsx` (navigation controls)

---

## ✅ Working as Expected

- Hold completion changes status to "done" and shows as green ✓
- 12h/24h duration options when assigning hold ✓
- Average hold duration calculation (shows 24 hours) ✓

---

## 📋 Implementation Order (Recommended)

### Phase 1: Fix Critical Bugs (Do First)
1. ✅ **Fix "Members can't be scheduled"** - BLOCKING
2. ✅ **Fix member rotation after completing hold** - Core functionality broken
3. ✅ **Fix last hold date update** - Data integrity issue
4. ✅ **Fix date off-by-one bug** - Data display issue
5. ✅ **Fix duplicate holds** - Data integrity issue

### Phase 2: Clean Up UI (Do Second)
6. ✅ Remove hours worked display from rotation view
7. ✅ Fix station number display on past holds
8. ✅ Remove analytics from view-only mode
9. ✅ Fix "Holds by shift" to show all shifts

### Phase 3: Polish (Do Last)
10. ✅ Remove "Top Firefighter" metric
11. ✅ Add back button to metrics dashboard
12. ✅ Fix calendar button functionality

---

## 🔍 Investigation Notes

### Rotation Logic Issue
The fact that the notification says "moved to bottom" but the member doesn't actually move suggests:
- The database update might be succeeding
- But the UI state isn't refreshing
- OR the database update is failing silently

**Need to check:**
- Console errors when completing a hold
- Network tab to see if API calls succeed
- Database to see if `order_position` actually updates

### Date Off-By-One Issue
Likely causes:
1. Timezone conversion (UTC vs local time)
2. Date format parsing issue
3. Database storing date vs timestamp

**Need to check:**
- How dates are saved to database
- How dates are displayed from database
- Timezone handling in both directions

### Duplicate Holds Issue
Pattern: Affects A shift but not C shift
**Possible causes:**
1. Hold completion logic creates duplicate instead of updating status
2. Data migration created duplicates for certain shifts
3. Race condition when completing holds

**Need to check:**
- Database: `SELECT * FROM scheduled_holds WHERE firefighter_id = [George's ID]`
- Look for duplicate entries with same date
- Check completion timestamp logic

---

## 🎯 Success Criteria

Before deploying to production:
- [ ] All P0 (BLOCKING) bugs fixed and tested
- [ ] All P1 bugs fixed
- [ ] User confirms fixes work in testing environment
- [ ] No regression in existing working features

---

*Captured: October 29, 2025*
*Last Updated: October 29, 2025*
