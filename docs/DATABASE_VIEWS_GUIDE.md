# Database Views Implementation Guide

## Overview
Created database views to move repeated filtering/sorting logic from client to database, following the "database as storage with minimal logic" approach.

## Views Created

### 1. `available_rotation`
**Purpose**: Most commonly queried view - firefighters in active rotation
```sql
SELECT * FROM available_rotation WHERE shift = 'A';
```
**Replaces**:
```typescript
firefighters.filter(ff => ff.is_active && ff.is_available).sort(...)
```

### 2. `active_firefighters`
**Purpose**: All active firefighters (including unavailable ones)
```sql
SELECT * FROM active_firefighters WHERE shift = 'B';
```

### 3. `deactivated_firefighters`
**Purpose**: Deactivated firefighters ordered by name
```sql
SELECT * FROM deactivated_firefighters WHERE shift = 'C';
```

### 4. `recent_activity`
**Purpose**: Activity log from last 30 days
```sql
SELECT * FROM recent_activity WHERE shift = 'A' LIMIT 50;
```

### 5. `upcoming_holds`
**Purpose**: Scheduled holds for next 90 days
```sql
SELECT * FROM upcoming_holds WHERE shift = 'A';
```

### 6. `recent_completed_holds`
**Purpose**: Completed holds from last 90 days
```sql
SELECT * FROM recent_completed_holds WHERE shift = 'B';
```

## How to Apply

### Option 1: Supabase SQL Editor
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/20250000000000_add_views.sql`
3. Run the migration
4. Verify: `SELECT * FROM available_rotation LIMIT 5;`

### Option 2: Supabase CLI (if using local dev)
```bash
supabase migration up
```

## Usage in Code

### Before (client-side filtering)
```typescript
const { data } = await supabase
  .from('firefighters')
  .select('*')
  .eq('shift', 'A')
  .eq('is_active', true)
  .eq('is_available', true)
  .order('order_position');

const sorted = sortFirefighters(data);
```

### After (using view)
```typescript
const { data } = await supabase
  .from('available_rotation')
  .select('*')
  .eq('shift', 'A');

// Already sorted by database!
```

## Benefits

1. **Consistent Logic**: Sorting/filtering logic defined once in database
2. **Less Client Code**: No need to repeat filter/sort logic
3. **Better Performance**: Database handles sorting (indexed)
4. **Easier Testing**: Query logic is in SQL (can test with `psql`)
5. **Maintainability**: Change logic in one place (migration)

## Optional: Update Hooks to Use Views

If you want to use the views in the hooks, you can update them like this:

### `useFirefightersData.ts`
```typescript
// Before
const { data: activeData } = await supabase
  .from('firefighters')
  .select('*')
  .eq('shift', currentShift)
  .eq('is_active', true)
  .order('order_position');

// After
const { data: activeData } = await supabase
  .from('available_rotation')  // Use view instead
  .select('*')
  .eq('shift', currentShift);
```

### `useScheduledHoldsData.ts`
```typescript
// Before
const { data } = await supabase
  .from('scheduled_holds')
  .select('*')
  .eq('shift', currentShift)
  .gte('hold_date', startStr)
  .lte('hold_date', endStr)
  .order('hold_date');

// After
const { data } = await supabase
  .from('upcoming_holds')  // Use view instead
  .select('*')
  .eq('shift', currentShift);
```

## Notes

- Views are **read-only** - use original tables for INSERT/UPDATE/DELETE
- Views automatically update when underlying tables change
- RLS policies apply to views (already granted to `authenticated` and `anon`)
- Views don't add storage overhead (they're virtual)

## Rollback

If you need to remove the views:
```sql
DROP VIEW IF EXISTS available_rotation;
DROP VIEW IF EXISTS active_firefighters;
DROP VIEW IF EXISTS deactivated_firefighters;
DROP VIEW IF EXISTS recent_activity;
DROP VIEW IF EXISTS upcoming_holds;
DROP VIEW IF EXISTS recent_completed_holds;
```
