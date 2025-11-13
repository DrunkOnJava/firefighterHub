import * as fs from 'fs';

// Read .env file manually
const envContent = fs.readFileSync('.env', 'utf-8');
const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const SUPABASE_URL = envVars.VITE_SUPABASE_URL || '';
const SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  console.log('\nAdd to .env:');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here');
  process.exit(1);
}

const sql = `
BEGIN;

-- PHASE 1: Remove public write policies (security hardening)
DROP POLICY IF EXISTS "Enable insert for all users" ON public.firefighters;
DROP POLICY IF EXISTS "Enable update for all users" ON public.firefighters;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.firefighters;

DROP POLICY IF EXISTS "Enable insert for all users" ON public.scheduled_holds;
DROP POLICY IF EXISTS "Enable update for all users" ON public.scheduled_holds;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.scheduled_holds;

-- PHASE 2: Ensure RLS is enabled (safe to re-run)
ALTER TABLE public.firefighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- PHASE 3: Create SELECT-only policies for realtime
-- Anon can read (for realtime subscriptions + queries)
CREATE POLICY firefighters_select_anon
  ON public.firefighters
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY firefighters_select_authenticated
  ON public.firefighters
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY scheduled_holds_select_anon
  ON public.scheduled_holds
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY scheduled_holds_select_authenticated
  ON public.scheduled_holds
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY activity_log_select_anon
  ON public.activity_log
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY activity_log_select_authenticated
  ON public.activity_log
  FOR SELECT
  TO authenticated
  USING (true);

-- PHASE 4: Add table comments documenting the security model
COMMENT ON TABLE public.firefighters IS 'RLS: anon/auth can SELECT; writes via Edge Functions (service_role) only';
COMMENT ON TABLE public.scheduled_holds IS 'RLS: anon/auth can SELECT; writes via Edge Functions (service_role) only';
COMMENT ON TABLE public.activity_log IS 'RLS: anon/auth can SELECT; anon can INSERT for client-side logging';

COMMIT;

-- Verify the changes
SELECT 
  tablename, 
  policyname, 
  roles::text[], 
  cmd::text 
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('firefighters', 'scheduled_holds', 'activity_log')
ORDER BY tablename, policyname;
`;

async function applyMigration() {
  console.log('🔒 Applying secure RLS policies...\n');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`SQL execution failed: ${response.status} ${text}`);
    }

    const result = await response.json();
    console.log('✅ Migration applied successfully!\n');
    console.log('📊 Current policies:');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\n✅ Security hardening complete:');
    console.log('  - Anonymous users can SELECT (read) for realtime');
    console.log('  - Anonymous users CANNOT INSERT/UPDATE/DELETE (writes via Edge Functions only)');
    console.log('  - Authenticated users can SELECT');
    console.log('  - Service role (Edge Functions) can do everything');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

applyMigration();
