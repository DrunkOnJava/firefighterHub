# Realtime Broadcast Authorization Fix

## Problem
Vercel deployment shows errors:
```
⚠️ Real-time subscription error: CHANNEL_ERROR
Error: "Unauthorized: You do not have permissions to read from this Channel topic: firefighters:A"
```

## Root Cause
- App uses Supabase Realtime **broadcast** (modern, scalable approach)
- Broadcast channels require RLS policies on `realtime.messages` table
- These policies were missing, blocking all subscriptions

## Solution

### Step 1: Apply SQL Migration

**Option A: Supabase Dashboard (Recommended)**
1. Go to https://supabase.com/dashboard/project/tjljndzodowpohusrwhs
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy contents of `supabase/migrations/20251108_fix_realtime_broadcast_policies.sql`
5. Click **Run**
6. Verify success message appears

**Option B: Supabase CLI (Alternative)**
```bash
# Requires supabase CLI to be installed and logged in
supabase db push
```

**Option C: Direct PostgreSQL Connection (Advanced)**
```bash
# Use the connection string from Supabase dashboard
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  -f supabase/migrations/20251108_fix_realtime_broadcast_policies.sql
```

### Step 2: Verify Fix

After applying the migration, check that policies exist:

```sql
-- Run this in SQL Editor to verify
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'messages'
  AND schemaname = 'realtime'
ORDER BY policyname;
```

Expected output: 6 policies
- `allow_anon_read_firefighters_topics`
- `allow_anon_read_scheduled_holds_topics`
- `allow_authenticated_read_firefighters_topics`
- `allow_authenticated_read_scheduled_holds_topics`
- `allow_authenticated_insert_firefighters_topics`
- `allow_authenticated_insert_scheduled_holds_topics`

### Step 3: Test in Browser

1. Open https://firefighter-[latest].vercel.app/
2. Open browser console (F12)
3. Look for:
   ```
   ✅ Real-time subscription active (firefighters)
   ✅ Real-time subscription active (scheduled_holds)
   ```
4. Should NOT see "Unauthorized" errors anymore

## What This Fixes

### Before
- All realtime subscriptions fail with "Unauthorized" errors
- No live updates for roster changes
- No live updates for hold schedule changes
- Console spam from retry attempts

### After
- ✅ Realtime subscriptions connect successfully
- ✅ Live roster updates when firefighters are added/removed
- ✅ Live calendar updates when holds are scheduled
- ✅ Clean console logs with `✅` success indicators

## Security Model

The migration implements a tiered access model:

| Role | Firefighters Topic | Scheduled Holds Topic |
|------|-------------------|----------------------|
| **anon** (anonymous) | SELECT only | SELECT only |
| **authenticated** | SELECT + INSERT | SELECT + INSERT |

### Topic Patterns
- `firefighters:A` - Shift A roster
- `firefighters:B` - Shift B roster
- `firefighters:C` - Shift C roster
- `scheduled_holds:A` - Shift A holds
- `scheduled_holds:B` - Shift B holds
- `scheduled_holds:C` - Shift C holds

The regex pattern `^firefighters:[ABC]$` enforces exact matching.

## Why Use Broadcast Instead of postgres_changes?

| Feature | broadcast (Used Here) | postgres_changes (Deprecated) |
|---------|---------------------|------------------------------|
| **Scalability** | ✅ Multi-threaded | ❌ Single-threaded |
| **Performance** | ✅ High throughput | ❌ Limited throughput |
| **Custom Payloads** | ✅ Yes | ❌ Fixed format |
| **Authorization** | ✅ RLS policies | ✅ RLS policies |
| **Best For** | Production apps | Simple prototypes |

See: https://supabase.com/docs/guides/realtime/broadcast

## Migration is Idempotent

Safe to run multiple times:
- Uses `DROP POLICY IF EXISTS` before creating
- Uses `ALTER TABLE ... ENABLE` (safe if already enabled)
- No data changes, only access control policies

## If Still Seeing Errors After Migration

### Check 1: Auth Token
```javascript
// In browser console
await supabase.auth.getSession()
// Should return { data: { session: {...} }, error: null }
```

### Check 2: Channel Configuration
```typescript
// Ensure private: true is set
const channel = supabase.channel('firefighters:A', {
  config: { 
    private: true,  // ← Required for RLS
    broadcast: { self: false, ack: false } 
  }
});
```

### Check 3: Topic Name Exact Match
```typescript
// ✅ Correct
channel('firefighters:A')

// ❌ Wrong - won't match policy regex
channel('firefighters-A')
channel('firefighter:A')  
channel('firefighters:a')  // lowercase
```

## Related Files

- **Migration**: `supabase/migrations/20251108_fix_realtime_broadcast_policies.sql`
- **Hook**: `src/hooks/useFirefighters.ts` (lines 144-156)
- **Hook**: `src/hooks/useScheduledHolds.ts` (similar pattern)
- **Docs**: https://supabase.com/docs/guides/realtime/authorization

## Questions?

See the Supabase Realtime AI Assistant Guide in your Claude custom instructions for detailed patterns and best practices.
