# 🚀 Deployment Checklist - Fix Scheduling with Proper Security

## Current Status

✅ Client code updated to use RPC function  
✅ SECURITY DEFINER function created in migration file  
✅ RLS policies created in migration file  
✅ Dangerous scripts deleted  
⏳ **Waiting for SQL to be applied to database**

## Next Steps (You Need to Do This)

### 1. Apply the SQL Migration

Open this URL in your browser:
**https://supabase.com/dashboard/project/tjljndzodowpohusrwhs/sql/new**

Run this command to see the SQL you need to copy:

```bash
./scripts/apply-rls-migration.sh
```

OR copy/paste from these files directly:

- `supabase/migrations/20251029000000_secure_schedule_hold_function.sql`
- `supabase/migrations/20251029000001_enable_rls_with_policies.sql`

Click **Run** in the SQL Editor.

### 2. Verify the Migration Worked

Run this in SQL Editor:

```sql
-- Should return 3 rows, all with rowsecurity = true
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('firefighters', 'scheduled_holds', 'activity_log');

-- Should return 1 row showing the function exists
SELECT routine_name, security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'schedule_hold_secure';
```

### 3. Test the App

1. Refresh your browser (hard refresh: Cmd+Shift+R)
2. Click on a date in the calendar
3. Try to schedule a hold
4. Should work! ✅

### 4. Verify Activity Logging

In SQL Editor:

```sql
SELECT * FROM activity_log
WHERE action_type = 'hold_scheduled'
ORDER BY created_at DESC
LIMIT 5;
```

Should show recent scheduled holds.

## What Changed (Technical Summary)

### Database Layer

- Created `schedule_hold_secure()` SECURITY DEFINER function
- Enabled RLS on all three tables
- Created read-only policies (allow SELECT, block direct INSERT/UPDATE/DELETE)

### Application Layer

- Updated `src/hooks/useScheduledHolds.ts`
- Changed from: `supabase.from('scheduled_holds').insert(...)`
- Changed to: `supabase.rpc('schedule_hold_secure', {...})`

### Security Model

**Before:** Client tries direct INSERT → RLS blocks → scheduling broken ❌  
**After:** Client calls RPC → Function validates + inserts → scheduling works ✅

## Rollback Plan (If Needed)

If something goes wrong:

```sql
-- Disable RLS temporarily to restore function
ALTER TABLE scheduled_holds DISABLE ROW LEVEL SECURITY;

-- Then investigate the issue
```

**But try the proper fix first!** The RPC approach is the right way.

## Files You Can Delete After Deployment

These are just documentation:

- `SCHEDULING_FIX_SUMMARY.md` (this file)
- `SECURITY_FIX_DEPLOYMENT.md`
- `scripts/apply-rls-migration.sh` (after you've run the SQL)

## Support

If you get an error when scheduling:

1. Check browser console (F12)
2. Look for the error message
3. Check if the function exists: `SELECT * FROM pg_proc WHERE proname = 'schedule_hold_secure';`
4. Check if RLS is enabled: See verification query above

Common errors:

- **"function schedule_hold_secure does not exist"** → SQL wasn't applied
- **"permission denied"** → RLS policies not created correctly
- **"Missing required fields"** → Client passing null values

---

**Ready? Go apply that SQL!** 🚀
