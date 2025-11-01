# Quick Fix: Hold Station Issue

## Problem
Past holds showing firefighter's **assigned station** instead of **actual hold station**.

## Root Cause
Database trigger `populate_scheduled_holds_metadata()` overwrites `fire_station` field with firefighter's assigned station, even when application sets it explicitly.

## Fix (3 Steps)

### Step 1: Apply Trigger Fix (REQUIRED)

1. Open **Supabase Dashboard** → **SQL Editor**
2. Paste contents of `supabase/migrations/20251101_fix_hold_station_trigger.sql`
3. Click **Run**
4. Expected result: "Success. No rows returned."

This stops the trigger from overwriting station data going forward.

---

### Step 2: Investigate Current Data (RECOMMENDED)

1. Open **Supabase Dashboard** → **SQL Editor**
2. Paste contents of `DIAGNOSTIC_HOLD_STATION_QUERIES.sql`
3. Run **each query individually** and note results

**Key Questions:**
- Query 1: How many holds before 10/22 exist?
- Query 5: How many have matching stations (potentially wrong)?

---

### Step 3: Clean Up Data (IF NEEDED)

**If Query 5 shows many matching stations:**

```sql
-- Option A: Set to NULL (safest - marks as unknown)
UPDATE scheduled_holds 
SET fire_station = NULL
WHERE created_at < '2025-10-22'
  AND fire_station = (
    SELECT fire_station 
    FROM firefighters 
    WHERE id = scheduled_holds.firefighter_id
  );

-- Option B: Leave as-is (if most were actually correct)
-- Do nothing - only future holds will be fixed
```

---

## Verification

After applying Step 1:

**Test New Hold:**
1. Calendar → Click date → Select firefighter
2. Choose **different** station than their assigned station
3. Confirm
4. **Check:** Hold should show chosen station (not assigned)

**Test Complete Hold:**
1. Complete Hold button → Choose date
2. Change station to something different
3. Confirm  
4. **Check:** Hold should show chosen station (not assigned)

---

## Why This Works

**Before fix:**
```
User selects Station 3
  ↓
Application sets fire_station = 3
  ↓
Database inserts with fire_station = 3
  ↓
❌ Trigger overwrites to fire_station = 1 (assigned station)
```

**After fix:**
```
User selects Station 3
  ↓
Application sets fire_station = 3
  ↓
Database inserts with fire_station = 3
  ↓
✅ Trigger leaves it alone
```

---

## Files

- **Fix:** `supabase/migrations/20251101_fix_hold_station_trigger.sql`
- **Diagnostics:** `DIAGNOSTIC_HOLD_STATION_QUERIES.sql`
- **Full Analysis:** `HOLD_STATION_DATA_FLOW_ANALYSIS.md`

---

## Confidence

**95% certain this is the root cause.**

- ✅ Application code is correct (sets station explicitly)
- ❌ Database trigger is wrong (overwrites user data)
- ✅ Fix removes the overwrite
- ✅ Low risk (only changes trigger, no data modification)
