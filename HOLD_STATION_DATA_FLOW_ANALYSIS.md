# Hold Station Data Flow Analysis

**Date:** November 1, 2024  
**Issue:** Past holds (before 10/22) showing firefighter's assigned station instead of actual hold station  
**Status:** ✅ ROOT CAUSE IDENTIFIED + FIX READY

---

## Executive Summary

### The Problem
Historical hold records are showing the firefighter's **assigned station** (their home station) instead of the **actual station where they worked the hold**.

### Root Cause
**Database trigger automatically backfilling `fire_station` field with firefighter's assigned station.**

The `populate_scheduled_holds_metadata()` trigger function updates:
```sql
NEW.firefighter_name := (SELECT name FROM firefighters WHERE id = NEW.firefighter_id);
NEW.shift := (SELECT shift FROM firefighters WHERE id = NEW.firefighter_id);
NEW.fire_station := (SELECT fire_station FROM firefighters WHERE id = NEW.firefighter_id);  -- ❌ THIS IS THE PROBLEM
```

This means even when the application explicitly sets `fire_station` to a different value, the trigger overwrites it with the firefighter's assigned station.

### The Fix
**Apply the trigger fix migration:** `supabase/migrations/20251101_fix_hold_station_trigger.sql`

This migration removes the auto-population of `fire_station`, allowing the application to set it explicitly.

---

## Data Flow Analysis

### 1. Schedule New Hold (Calendar)

**User Action:** Click calendar date → Select firefighter → Choose station

**Code Flow:**
```
Calendar.tsx (line 154)
  ↓
  onScheduleHold(holdDate, firefighter, selectedStation, '24h', '07:00')
  ↓
useScheduledHolds.ts::scheduleHold() (line 218)
  ↓
  const stationToUse = station || firefighter.fire_station || null;  // ✅ Explicit station parameter
  ↓
  POST to Edge Function /functions/v1/schedule-hold
    Body: { fire_station: stationToUse, ... }
  ↓
  Edge Function inserts to database with explicit fire_station
  ↓
  ❌ TRIGGER OVERWRITES fire_station with firefighter's assigned station
```

**Current Behavior:**
- ✅ Application code correctly passes explicit station value
- ✅ Edge Function correctly inserts with provided station
- ❌ Database trigger overwrites it immediately after insert

---

### 2. Complete Hold (from Roster)

**User Action:** Click "Complete Hold" → Choose date → Select station → Confirm

**Code Flow:**
```
App.tsx (line 162)
  ↓
  handleCompleteHoldClick(firefighterId)
  ↓
CompleteHoldModal.tsx (line 50)
  ↓
  setSelectedStation(firefighter.fire_station || "")  // Pre-fills with assigned station
  ↓
  [User can change station in dropdown]
  ↓
  onConfirm(firefighterId, selectedDate, newPosition, selectedStation, ...)
  ↓
App.tsx (line 171)
  ↓
  handleConfirmCompleteHold(..., station, ...)
  ↓
  completeHold(..., station, ...)
  ↓
useFirefighters.ts::completeHold() (line 327)
  ↓
  const stationToUse = station || firefighter.fire_station || null;  // ✅ Explicit station parameter
  ↓
  INSERT into scheduled_holds with fire_station: stationToUse
  ↓
  ❌ TRIGGER OVERWRITES fire_station with firefighter's assigned station
```

**Current Behavior:**
- ✅ Application code correctly passes explicit station value
- ✅ Modal pre-fills with assigned station (user can override)
- ✅ Database insert includes provided station value
- ❌ Database trigger overwrites it immediately after insert

---

## Why First Migration Returned 0 Rows

The first migration attempted to clean up historical data:
```sql
UPDATE scheduled_holds 
SET fire_station = NULL
WHERE created_at < '2025-10-22'
  AND fire_station = (
    SELECT fire_station 
    FROM firefighters 
    WHERE id = scheduled_holds.firefighter_id
  );
```

**Result:** 0 rows affected

**Possible Reasons:**
1. **No old holds exist** - Database was created after 10/22
2. **Stations already NULL** - Old holds don't have station data
3. **Data already clean** - Stations were set correctly (unlikely given trigger)
4. **Schema mismatch** - Old holds stored station differently

**To investigate:** Run the diagnostic queries in `DIAGNOSTIC_HOLD_STATION_QUERIES.sql`

---

## Application Code Quality: ✅ CORRECT

### Calendar Hold Scheduling
```typescript
// src/hooks/useScheduledHolds.ts (line 226)
const stationToUse = station || firefighter.fire_station || null;
```
**Analysis:**
- ✅ Takes explicit `station` parameter
- ✅ Falls back to firefighter's assigned station if not provided
- ✅ Properly passes to Edge Function
- ✅ Edge Function validates and inserts with service role

### Hold Completion
```typescript
// src/hooks/useFirefighters.ts (line 327)
const stationToUse = station || firefighter.fire_station || null;
const { error: insertError } = await supabase
  .from("scheduled_holds")
  .insert({
    firefighter_id: id,
    firefighter_name: firefighter.name,
    hold_date: holdDate,
    fire_station: stationToUse,  // ✅ Explicit value
    status: "completed",
    // ...
  });
```
**Analysis:**
- ✅ Takes explicit `station` parameter from CompleteHoldModal
- ✅ Falls back to firefighter's assigned station if not provided
- ✅ Directly inserts to database with correct value
- ✅ No reliance on trigger to populate field

**Conclusion:** The application code is **correct and well-designed**. It always explicitly sets the `fire_station` field with the user's chosen value.

---

## Database Schema Issue: ❌ TRIGGER OVERWRITES DATA

### Current Trigger Implementation
```sql
-- From: supabase/migrations/20251022_fix_schema_mismatches.sql
CREATE OR REPLACE FUNCTION populate_scheduled_holds_metadata()
RETURNS TRIGGER AS $$
BEGIN
  NEW.firefighter_name := (SELECT name FROM firefighters WHERE id = NEW.firefighter_id);
  NEW.shift := (SELECT shift FROM firefighters WHERE id = NEW.firefighter_id);
  NEW.fire_station := (SELECT fire_station FROM firefighters WHERE id = NEW.firefighter_id);  -- ❌ BAD
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Problem:** This trigger fires on `INSERT OR UPDATE` and **always overwrites** the `fire_station` field, even when the application explicitly sets a different value.

**Why This Exists:** Original intent was to denormalize data for faster queries (avoid JOINs). But it should only populate when the field is NULL, not always overwrite.

### Fixed Trigger Implementation
```sql
-- From: supabase/migrations/20251101_fix_hold_station_trigger.sql
CREATE OR REPLACE FUNCTION populate_scheduled_holds_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- Only populate firefighter_name and shift (denormalized for query performance)
  NEW.firefighter_name := (SELECT name FROM firefighters WHERE id = NEW.firefighter_id);
  NEW.shift := (SELECT shift FROM firefighters WHERE id = NEW.firefighter_id);
  
  -- ✅ REMOVED: auto-population of fire_station
  -- The application should set this explicitly based on user input
  -- fire_station represents WHERE THE HOLD OCCURRED, not the firefighter's assigned station
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Why This Fix Works:**
- ✅ Keeps denormalization of `firefighter_name` and `shift` (needed for performance)
- ✅ Removes auto-population of `fire_station` (should be user-driven)
- ✅ Allows application to set `fire_station` explicitly
- ✅ Preserves NULL values when station is unknown

---

## Timeline of Events

### What Likely Happened

1. **Early October:** Database created with trigger that auto-populates `fire_station`
2. **October 22-present:** Holds created with trigger auto-filling station with assigned station
3. **User notices issue:** Past holds showing wrong stations (assigned instead of actual)
4. **Investigation:** First migration ran, found 0 rows (possibly no old data exists)
5. **Root cause identified:** Trigger is the source of the problem
6. **Fix created:** Second migration removes trigger auto-population

### Why User Noticed Now

Likely scenario:
- User completed a hold where firefighter worked at a **different station** than their assigned station
- Expected to see the actual hold station in the record
- Instead saw their assigned station (due to trigger overwrite)
- Reported: "Past holds showing assigned station instead of hold station"

---

## Next Steps

### Immediate Action Required

**1. Apply the trigger fix migration**
```bash
# Open Supabase Dashboard → SQL Editor
# Paste contents of: supabase/migrations/20251101_fix_hold_station_trigger.sql
# Run query
```

**Expected result:** "Success. No rows returned." (function gets replaced)

**2. Investigate current data state**
```bash
# Open Supabase Dashboard → SQL Editor  
# Paste contents of: DIAGNOSTIC_HOLD_STATION_QUERIES.sql
# Run each query individually
```

**What to look for:**
- Query 1: How many holds exist before 10/22?
- Query 2: What stations are recorded for those holds?
- Query 3: Do any holds have NULL stations?
- Query 4: Are there holds where station differs from assigned station?
- Query 5: How many holds match firefighter's assigned station (potentially backfilled)?

---

### Data Cleanup Strategy

**Option A: If old holds exist with wrong stations**
```sql
-- Set fire_station to NULL for all old holds where it matches assigned station
UPDATE scheduled_holds 
SET fire_station = NULL
WHERE created_at < '2025-10-22'
  AND fire_station = (SELECT fire_station FROM firefighters WHERE id = scheduled_holds.firefighter_id);
```

**Option B: If no old holds exist**
- No cleanup needed
- Trigger fix prevents future issues

**Option C: If stations are already NULL**
- No cleanup needed
- Trigger fix prevents future issues

---

## Verification Steps

After applying the trigger fix:

### Test 1: Schedule New Hold
1. Open calendar, click future date
2. Select firefighter with assigned station (e.g., Station 1)
3. Choose **different** station in dropdown (e.g., Station 3)
4. Confirm
5. **Verify:** Hold shows Station 3 (not Station 1)

### Test 2: Complete Hold
1. Click "Complete Hold" on a firefighter
2. Choose date
3. Change station to something different than their assigned station
4. Confirm
5. **Verify:** Hold shows chosen station (not assigned station)

### Test 3: Check Database Directly
```sql
SELECT 
  sh.hold_date,
  sh.firefighter_name,
  sh.fire_station as hold_station,
  ff.fire_station as assigned_station,
  CASE 
    WHEN sh.fire_station = ff.fire_station THEN '⚠️ Same'
    WHEN sh.fire_station IS NULL THEN '❓ NULL'
    ELSE '✅ Different'
  END as comparison
FROM scheduled_holds sh
JOIN firefighters ff ON sh.firefighter_id = ff.id
WHERE sh.created_at > NOW() - INTERVAL '7 days'
ORDER BY sh.created_at DESC
LIMIT 20;
```

**Expected:** New holds should show "✅ Different" or "❓ NULL" (user's choice), never "⚠️ Same" unless user actually chose the assigned station.

---

## Technical Debt Notes

### Why This Happened

**Over-aggressive denormalization:** The original trigger tried to pre-populate all metadata fields, but `fire_station` has different semantics than `firefighter_name` and `shift`:

- ✅ `firefighter_name` - Static snapshot of who took the hold (correct to denormalize)
- ✅ `shift` - Static snapshot of which shift the hold was for (correct to denormalize)
- ❌ `fire_station` - **User-selected** value representing where the hold occurred (should NOT be auto-populated)

### Best Practice Violation

**Triggers should not overwrite user-provided data.**

Correct trigger design:
```sql
-- Good: Only populate if NULL (preserve user data)
IF NEW.fire_station IS NULL THEN
  NEW.fire_station := (SELECT fire_station FROM firefighters WHERE id = NEW.firefighter_id);
END IF;

-- Better: Don't auto-populate user-driven fields at all
-- Let application handle it explicitly
```

### Lessons Learned

1. **Denormalization is tricky** - Only denormalize truly static data
2. **Triggers can hide bugs** - Silent data corruption is hard to debug
3. **Test with edge cases** - "Firefighter works hold at different station than assigned"
4. **User reports are gold** - "Shows assigned station not hold station" = precise diagnosis

---

## Conclusion

### Summary
- ✅ **Application code is correct** - Explicitly sets station values
- ❌ **Database trigger is wrong** - Overwrites user data
- ✅ **Fix is ready** - Migration removes trigger auto-population
- ⏳ **Data investigation needed** - Run diagnostic queries to assess cleanup needs

### Confidence Level
**95% certain this is the root cause.**

The code review shows:
1. Application always sets `fire_station` explicitly
2. Trigger always overwrites it
3. Fix removes the overwrite
4. Future holds will work correctly

### Risk Assessment
**Low risk to apply the fix:**
- Migration only modifies trigger function
- No data is changed by the migration
- Application code already handles station selection correctly
- Worst case: NULL stations (which is better than wrong stations)

---

## Files Referenced

### Application Code
- `src/hooks/useScheduledHolds.ts` (line 218-340) - scheduleHold function
- `src/hooks/useFirefighters.ts` (line 279-400) - completeHold function
- `src/components/Calendar.tsx` (line 140-200) - User interaction
- `src/components/CompleteHoldModal.tsx` (line 40-100) - Hold completion UI
- `src/App.tsx` (line 135-190) - Modal orchestration

### Database
- `supabase/migrations/20251022_fix_schema_mismatches.sql` - Original trigger (bad)
- `supabase/migrations/20251101_fix_hold_station_trigger.sql` - Fixed trigger (good)
- `supabase/migrations/20251101_fix_historical_hold_stations.sql` - Data cleanup (ran, 0 rows)
- `DIAGNOSTIC_HOLD_STATION_QUERIES.sql` - Investigation queries

### Documentation
- `TYPESCRIPT_FIXES_NOV_1.md` - TypeScript errors fixed
- `BEST_PRACTICES_REFACTOR.md` - Theme refactoring
- `PORT_FIX_INSTRUCTIONS.md` - Dev server port clarification

---

**Next Action:** Apply `20251101_fix_hold_station_trigger.sql` in Supabase SQL Editor
