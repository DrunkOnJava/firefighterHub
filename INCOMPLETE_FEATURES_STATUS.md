# FirefighterHub - Incomplete Features & Bug Status
## October 22, 2025 - User Feedback Analysis

---

## CRITICAL ISSUES IDENTIFIED BY NICK BAILEY

### Issue 1: Edit Button Not Appearing
**Status**: FIXED (code deployed, needs verification)

**Problem**: Edit button doesn't appear in profile modal when in admin mode

**Root Cause**: The `isAdminMode` prop is passed from FirefighterList but may not be working in production

**Fix Applied**:
- Added `isAdminMode` prop to FirefighterProfileModal interface
- Passed prop from FirefighterList component (line 783)
- Edit button conditionally renders based on `isAdminMode` (line 128)

**Needs Verification**: Test in production after next deployment

---

### Issue 2: Duplicate Hold for Nick Bailey
**Status**: FIXED

**Problem**: Nick Bailey shows 2 holds (one on 2024-10-19, one on 2025-10-19)

**Root Cause**: Missed converting one date during the 2024 → 2025 correction

**Fix Applied**:
- Ran script to delete 2024-10-19 hold
- Kept correct 2025-10-19 hold
- Nick Bailey now has 1 hold total

**Verified**: Database confirmed 1 hold only

---

### Issue 3: Last Hold Date Not Showing for Other Firefighters
**Status**: NEEDS INVESTIGATION

**Problem**: Only Nick Bailey's last hold date appears in the roster table, not others

**Possible Causes**:
1. `last_hold_date` field not updated in database for other firefighters
2. Display logic filtering out dates
3. Data not properly saved during hold insertion

**Investigation Needed**:
- Check database: Do other firefighters have `last_hold_date` populated?
- Check insertion scripts: Did they update `last_hold_date`?
- Check roster table rendering: Is there filtering logic?

---

### Issue 4: No Eye Button on Active Roster
**Status**: BY DESIGN (but user wants it)

**Current Behavior**:
- Active roster: Names are clickable (no Eye button)
- Deactivated roster: Eye button + clickable name

**User Expectation**: Eye button on ALL firefighters for consistency

**Fix Needed**:
- Add Eye button to active roster row actions
- Place next to existing action buttons
- Should open profile modal
- Make it clear that both name AND Eye button open profile

---

## MISSING FEATURES (From Original Request)

### Feature 1: Subscribe to Calendar Button (Roster Header)
**Status**: CODE WRITTEN BUT REMOVED

**What Happened**:
- Code was written and added
- Removed during JSX structure debugging
- Button, modal, and state all exist but aren't integrated

**What Exists**:
- `/src/components/CalendarSubscribeModal.tsx` - Full modal component
- Import statement in FirefighterList.tsx (line 6)
- `showCalendarSubscribe` state (line 53)
- CalendarPlus icon imported (line 7)

**What's Missing**:
- Subscribe button in Roster header (was removed around line 204-217)
- Modal rendering at component end
- Click handler

---

### Feature 2: Subscribe to Calendar Button (Calendar Header)
**Status**: IMPLEMENTED ✓

**Location**: `/src/components/Calendar.tsx:170-182`
**Modal**: Calendar.tsx:603-608
**Working**: Yes, button appears left of month navigation

---

### Feature 3: Calendar Subscription API Endpoint
**Status**: CODE WRITTEN, NOT DEPLOYED

**What Exists**:
- `/supabase/functions/hold-schedule-calendar/index.ts` - Complete Edge Function
- RFC 5545 compliant iCalendar generation
- Shift filtering support
- 30-minute auto-refresh

**What's Missing**:
- Function not deployed to Supabase
- URLs in modal won't work until deployed

---

## ACTIONABLE FIX LIST

### Priority 1: Critical Bugs

**1. Fix Edit Button Visibility**
```typescript
// In App.tsx or wherever profile modal is called from deactivated list
// Make sure isAdminMode prop is passed:
<FirefighterProfileModal
  isAdminMode={isAdminMode}  // ← Add this
  ...otherProps
/>
```

**2. Update Last Hold Dates**
```bash
# Run script to update all firefighters' last_hold_date
pnpm dlx tsx scripts/update-last-hold-dates.ts
```

**3. Add Eye Button to Active Roster**
```typescript
// In FirefighterList active roster row (around line 600+)
// Add Eye button before other action buttons
<button onClick={() => handleViewProfile(firefighter)}>
  <Eye size={16} />
</button>
```

---

### Priority 2: Missing Features

**4. Re-add Subscribe Button to Roster Header**
```typescript
// In FirefighterList header section (line 202)
<button
  onClick={() => setShowCalendarSubscribe(true)}
  className="...orange button..."
>
  <CalendarPlus className="w-4 h-4" />
  Subscribe to Calendar
</button>
```

**5. Re-add CalendarSubscribeModal to FirefighterList**
```typescript
// After FirefighterProfileModal (line 784)
<CalendarSubscribeModal
  isOpen={showCalendarSubscribe}
  onClose={() => setShowCalendarSubscribe(false)}
  currentShift={currentShift}
  isDarkMode={isDarkMode}
/>
```

**6. Deploy Edge Function**
```bash
# Get project ref from .env
supabase functions deploy hold-schedule-calendar --project-ref YOUR_REF
```

---

## DETAILED FIX CHECKLIST

**Bug Fixes**:
- [x] Remove Nick Bailey duplicate hold
- [ ] Verify Edit button appears in admin mode
- [ ] Add Eye button to active roster
- [ ] Update all last_hold_date fields

**Missing Features**:
- [ ] Re-add Subscribe button to Roster header
- [ ] Re-add CalendarSubscribeModal to Roster
- [ ] Deploy Supabase Edge Function
- [ ] Test calendar subscription end-to-end

**User Experience**:
- [ ] Consistent Eye buttons (active + deactivated)
- [ ] All last hold dates visible
- [ ] Calendar subscription working
- [ ] Profile editing working in production

---

## FILES TO MODIFY

**1. FirefighterList.tsx**:
- Line ~600: Add Eye button to active roster actions
- Line ~202: Re-add Subscribe button to header
- Line ~784: Re-add CalendarSubscribeModal rendering
- Fix JSX structure if needed

**2. App.tsx** (if modal called from there):
- Verify isAdminMode passed to profile modals

**3. Database Script**:
- Create update-last-hold-dates.ts
- Update all firefighters with their most recent hold date

---

## TESTING AFTER FIXES

**1. Profile Editing**:
- Click any firefighter name
- Enable admin mode
- Verify Edit button appears
- Click Edit
- Verify fields are editable
- Make changes
- Click Save
- Verify changes persist

**2. Eye Button**:
- Check active roster
- Verify Eye button appears
- Click Eye button
- Verify profile opens

**3. Last Hold Dates**:
- Check roster table
- Verify last hold column shows dates for ALL firefighters who have holds
- Not just Nick Bailey

**4. Calendar Subscription**:
- Click Subscribe to Calendar (Roster header)
- Modal opens with shift selector
- Copy URL or click one-click button
- Test in calendar app
- Verify holds appear

---

## ESTIMATED TIME TO COMPLETE

**Bug Fixes**: 30 minutes
**Subscribe Button Re-integration**: 15 minutes
**Edge Function Deployment**: 10 minutes
**Testing**: 20 minutes
**Total**: ~75 minutes

---

**Status**: Multiple features incomplete or removed during debugging
**Priority**: Fix Edit button, add Eye button, re-add Subscribe button
**Timeline**: Can be completed in next session
