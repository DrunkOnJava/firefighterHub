# Security Fix & Deployment Instructions

## ⚠️ CRITICAL: Immediate Security Actions Required

### 1. Rotate ALL Credentials (Do This NOW)

The following credentials were accidentally exposed and MUST be rotated immediately:

1. **Supabase Service Role Key** - Go to: https://supabase.com/dashboard/project/tjljndzodowpohusrwhs/settings/api

   - Click "Reset" on the service_role key
   - Update your environment variables

2. **Database Password** - Go to: https://supabase.com/dashboard/project/tjljndzodowpohusrwhs/settings/database

   - Reset the database password
   - Update any scripts or tools using it

3. **Anon Key** (optional but recommended)

### 2. Clean Git History

```bash
# Install BFG Repo Cleaner or git-filter-repo
brew install bfg

# Remove sensitive files from history
bfg --delete-files disable-rls* --no-blob-protection
bfg --delete-files DISABLE_RLS.sql --no-blob-protection

# Or manually with git filter-repo
git filter-repo --path scripts/disable-rls-direct.cjs --invert-paths

# Force push (⚠️ coordinate with team first!)
git push --force --all
```

## 🚀 Deploy the Edge Function

### 1. Install Supabase CLI

```bash
brew install supabase/tap/supabase
```

### 2. Link to Your Project

```bash
supabase link --project-ref tjljndzodowpohusrwhs
```

### 3. Deploy the Edge Function

```bash
supabase functions deploy schedule-hold
```

### 4. Set Environment Variables

The Edge Function needs the service role key (which stays on the server, never in client code):

```bash
supabase secrets set SUPABASE_URL=https://tjljndzodowpohusrwhs.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-new-service-role-key-after-rotation>
```

## ✅ Verify RLS is Enabled

Run this in Supabase Dashboard → SQL Editor:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('firefighters', 'scheduled_holds', 'activity_log');
```

All should show `rowsecurity = true`. If not:

```sql
ALTER TABLE firefighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
```

## 📝 Create RLS Policies

Add these policies in Supabase Dashboard → SQL Editor:

```sql
-- Allow authenticated users to read their shift's data
CREATE POLICY "Users can read their shift's firefighters"
ON firefighters FOR SELECT
TO authenticated
USING (true); -- Temporary: allow all reads until multi-tenant is implemented

-- Allow Edge Function to insert/update (using service_role)
-- Service role bypasses RLS, so no policy needed

-- For scheduled_holds
CREATE POLICY "Users can read scheduled holds"
ON scheduled_holds FOR SELECT
TO authenticated
USING (true);

-- For activity_log
CREATE POLICY "Users can read activity log"
ON activity_log FOR SELECT
TO authenticated
USING (true);
```

## 🧪 Test the Edge Function

```bash
# Get a test token (if you have auth set up)
# Or test with anon key temporarily

curl -X POST \
  https://tjljndzodowpohusrwhs.supabase.co/functions/v1/schedule-hold \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "firefighter_id": "some-uuid",
    "firefighter_name": "Test Name",
    "hold_date": "2025-11-01",
    "fire_station": "1",
    "shift": "A",
    "duration": "24h",
    "start_time": "07:00:00"
  }'
```

## 🔐 Next Steps: Implement Real Auth

The current code still uses `localStorage.isAdminMode` which is insecure. You have an `AuthContext.tsx` already created but not integrated.

### Future Work:

1. Create a `profiles` table with `is_admin` flag
2. Integrate `AuthContext` in `App.tsx`
3. Replace all `isAdminMode` checks with `isAdmin` from context
4. Update Edge Function to check `profiles.is_admin`
5. Add proper multi-tenant policies with org/station scoping

## 🎯 What Changed

**Before (Insecure):**

- Client directly inserted into `scheduled_holds` with anon key
- RLS blocked this because no policies existed for anon role
- Tried to disable RLS (wrong approach!)

**After (Secure):**

- Client calls Edge Function with auth token
- Edge Function runs with service_role key (bypasses RLS)
- Edge Function validates permissions and business rules
- RLS stays enabled for defense-in-depth

**Key Principle:**

- Service role key lives ONLY on the server (Edge Function environment)
- Never in client code, never in git
- RLS is your security boundary - never disable it in production
