# FirefighterHub - Fix Verification Test Checklist

## Test Date: [Fill in when testing]
## Tester: [Name]
## Environment: Production (Live Website)

---

## 1. Profile Modal & Hold History Testing

### Test 1.1: Hold History Loads Without Infinite Loop
- [ ] **Login as admin**
- [ ] **Open any firefighter's profile modal** (click their name in roster)
- [ ] **Verify**: Hold history section shows either:
  - Loading spinner briefly, then data loads
  - "No previous holds" message
  - List of holds with correct data
- [ ] **Verify**: No continuous spinning/reloading
- [ ] **Expected**: Hold history loads once and stops

**Status**: ⬜ Pass / ⬜ Fail
**Notes**: ____________________

---

### Test 1.2: Real-Time Updates - Edit Firefighter
- [ ] **Open two browser tabs** with the same shift
- [ ] **In Tab 1**: Click firefighter name to open profile
- [ ] **In Tab 1**: Click Edit button
- [ ] **In Tab 1**: Change the firefighter's name (e.g., add "TEST")
- [ ] **In Tab 1**: Click Save
- [ ] **In Tab 2**: Wait 2-3 seconds
- [ ] **Verify Tab 2**: Firefighter name updates automatically without refresh
- [ ] **Expected**: Real-time sync works, name changes in Tab 2

**Status**: ⬜ Pass / ⬜ Fail
**Notes**: ____________________

---

### Test 1.3: Real-Time Updates - Holds
- [ ] **Keep two browser tabs open**
- [ ] **In Tab 1**: Schedule a new hold for tomorrow
- [ ] **In Tab 2**: Wait 2-3 seconds
- [ ] **Verify Tab 2**: New hold appears on calendar without refresh
- [ ] **In Tab 1**: Cancel the hold
- [ ] **In Tab 2**: Wait 2-3 seconds
- [ ] **Verify Tab 2**: Hold disappears without refresh
- [ ] **Expected**: Hold changes sync in real-time

**Status**: ⬜ Pass / ⬜ Fail
**Notes**: ____________________

---

## 2. Timezone Bug Testing (Hold Dates)

### Test 2.1: Last Hold Date in Roster
- [ ] **Find a firefighter** with a recent completed hold
- [ ] **Check "Last Hold" date** shown in their roster card
- [ ] **Cross-reference** with calendar to see what date the hold was on
- [ ] **Verify**: Both dates match (no off-by-one day error)
- [ ] **Expected**: Dates are identical across roster and calendar

**Status**: ⬜ Pass / ⬜ Fail
**Roster shows**: ____________
**Calendar shows**: ____________

---

### Test 2.2: Hold History Dates in Profile Modal
- [ ] **Open firefighter profile** modal (click name)
- [ ] **Look at Hold History section**
- [ ] **Check each hold date** listed
- [ ] **Compare** with calendar dates for same holds
- [ ] **Verify**: All dates match calendar
- [ ] **Expected**: No date is off by one day

**Status**: ⬜ Pass / ⬜ Fail
**Notes**: ____________________

---

### Test 2.3: Hold Detail Modal Dates
- [ ] **In profile modal**, click on a hold in the history
- [ ] **Check "Hold Date"** shown in detail modal
- [ ] **Check "Completed On"** date (if completed)
- [ ] **Check "Scheduled On"** date
- [ ] **Verify**: All dates match expected values
- [ ] **Expected**: No timezone shift, dates are correct

**Status**: ⬜ Pass / ⬜ Fail
**Notes**: ____________________

---

## 3. Calendar Interaction Testing

### Test 3.1: Click Past Dates (Edit/Cancel Past Holds)
- [ ] **Find a hold** from a previous date (e.g., last week)
- [ ] **Click on that past date** in the calendar
- [ ] **Verify**: Date modal opens (not blocked)
- [ ] **Check**: Edit button is visible for the hold
- [ ] **Check**: Cancel button is visible for the hold
- [ ] **Click Edit**, change station, save
- [ ] **Verify**: Edit saves successfully
- [ ] **Click Cancel**, confirm
- [ ] **Verify**: Hold is cancelled successfully
- [ ] **Expected**: Can edit and cancel past holds

**Status**: ⬜ Pass / ⬜ Fail
**Notes**: ____________________

---

### Test 3.2: Calendar Modal Scrolling (Many Holds on One Date)
- [ ] **If possible, schedule 5+ holds** on the same date (or find date with multiple)
- [ ] **Click that date** in the calendar
- [ ] **Verify**: Modal opens showing all holds
- [ ] **Try scrolling** inside the modal
- [ ] **Verify**: Can scroll to see all holds
- [ ] **Verify**: All holds are visible (no cut-off)
- [ ] **Expected**: Modal scrolls smoothly, all holds accessible

**Status**: ⬜ Pass / ⬜ Fail
**Notes**: ____________________

---

### Test 3.3: Edit Button for Completed Holds
- [ ] **Find a completed hold** (marked with "DONE" badge)
- [ ] **Click the date** to open modal
- [ ] **Verify**: "Edit" button is visible for completed hold
- [ ] **Click Edit** button
- [ ] **Change station** number
- [ ] **Save** the change
- [ ] **Verify**: Station number updates successfully
- [ ] **Expected**: Completed holds can be edited

**Status**: ⬜ Pass / ⬜ Fail
**Notes**: ____________________

---

### Test 3.4: Cancel Button for Completed Holds
- [ ] **Find a completed hold**
- [ ] **Click the date** to open modal
- [ ] **Verify**: "Cancel" button is visible
- [ ] **Click Cancel** button
- [ ] **Confirm** cancellation
- [ ] **Verify**: Hold is cancelled
- [ ] **Verify**: Firefighter moves back to top of rotation
- [ ] **Expected**: Completed holds can be cancelled and revert rotation

**Status**: ⬜ Pass / ⬜ Fail
**Notes**: ____________________

---

## 4. Read-Only Mode Testing

### Test 4.1: Profile Access in Read Mode
- [ ] **Logout of admin mode** (or open incognito/private browsing)
- [ ] **View the roster** list at bottom
- [ ] **Look at firefighter names**
- [ ] **Verify**: Names are NOT clickable (no underline, no hover effect)
- [ ] **Try clicking** a name
- [ ] **Verify**: Profile modal does NOT open
- [ ] **Expected**: Members cannot access profiles in read mode

**Status**: ⬜ Pass / ⬜ Fail
**Notes**: ____________________

---

### Test 4.2: What IS Visible in Read Mode
- [ ] **Stay in read-only mode**
- [ ] **Verify visible**: Calendar with all holds
- [ ] **Verify visible**: Snapshot box (right sidebar with stats)
- [ ] **Verify visible**: Entire rotation list at bottom
- [ ] **Verify visible**: Last hold dates next to firefighter names
- [ ] **Verify NOT visible**: Edit/Delete buttons
- [ ] **Verify NOT visible**: Add firefighter form
- [ ] **Verify NOT visible**: Profile clickability
- [ ] **Expected**: Read mode shows info but no controls

**Status**: ⬜ Pass / ⬜ Fail
**Notes**: ____________________

---

## 5. Regression Testing (Ensure Nothing Broke)

### Test 5.1: Complete Hold Workflow
- [ ] **Schedule a hold** for today
- [ ] **Mark the hold as completed** (from calendar or roster)
- [ ] **Verify**: Firefighter moves to end of rotation
- [ ] **Verify**: Hold shows as "COMPLETED" on calendar
- [ ] **Verify**: Position numbers update for all firefighters
- [ ] **Expected**: Standard workflow still works

**Status**: ⬜ Pass / ⬜ Fail
**Notes**: ____________________

---

### Test 5.2: Add Firefighter
- [ ] **Click Add button** (+ icon in roster header)
- [ ] **Fill in**: Name, Station, any certifications
- [ ] **Submit** the form
- [ ] **Verify**: New firefighter appears in roster
- [ ] **Verify**: Assigned position at end of rotation
- [ ] **Expected**: Can still add firefighters normally

**Status**: ⬜ Pass / ⬜ Fail
**Notes**: ____________________

---

### Test 5.3: Delete/Deactivate Firefighter
- [ ] **Click Delete** on a test firefighter
- [ ] **Confirm** deletion
- [ ] **Verify**: Firefighter removed from roster
- [ ] **Verify**: Rotation positions recalculated
- [ ] **Expected**: Delete still works correctly

**Status**: ⬜ Pass / ⬜ Fail
**Notes**: ____________________

---

### Test 5.4: Drag-and-Drop Reorder
- [ ] **Drag a firefighter** card to different position
- [ ] **Drop** in new location
- [ ] **Verify**: Position numbers update
- [ ] **Verify**: Order persists after page refresh
- [ ] **Expected**: Drag-and-drop reordering works

**Status**: ⬜ Pass / ⬜ Fail
**Notes**: ____________________

---

## Summary

### Issues Fixed:
- ✅ Profile modal infinite loop (hold history)
- ✅ Real-time data updates (edit firefighters, schedule holds)
- ✅ Timezone bug (hold dates off by one day)
- ✅ Cannot click past dates to edit/cancel
- ✅ Calendar modal cannot scroll (many holds)
- ✅ Cannot edit completed holds
- ✅ Profile modal accessible in read mode

### Total Tests: 15
### Tests Passed: ____ / 15
### Tests Failed: ____ / 15

---

## Critical Issues Found (if any):

1. ____________________
2. ____________________
3. ____________________

---

## Tester Signature: _________________ Date: _________

---

## Notes for Developers:
- All date formatting now uses `timeZone: 'UTC'` to prevent timezone shifts
- Real-time subscriptions re-enabled for firefighters and scheduled_holds tables
- Profile modal `loadHoldHistory` wrapped in useCallback to prevent infinite loop
- Calendar allows clicking past dates for editing/cancelling historical holds
- Calendar modal uses `overflow-y-auto` for scrolling when many holds present
- Edit button always shown for holds regardless of status (scheduled or completed)
- Profile button only shown in admin mode (read mode shows plain text name)
