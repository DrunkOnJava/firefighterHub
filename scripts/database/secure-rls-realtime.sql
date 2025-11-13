-- PHASE 1: Secure RLS - Remove Public Write Access
-- This prevents anonymous users from modifying data via API
-- while keeping read access for realtime subscriptions

-- Drop existing permissive policies that allow public writes
DROP POLICY IF EXISTS "Enable read access for all users" ON public.firefighters;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.firefighters;
DROP POLICY IF EXISTS "Enable update for all users" ON public.firefighters;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.firefighters;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.scheduled_holds;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.scheduled_holds;
DROP POLICY IF EXISTS "Enable update for all users" ON public.scheduled_holds;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.scheduled_holds;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.activity_log;

-- PHASE 2: Create Secure Read-Only Policies for Realtime
-- Anonymous users can READ (for realtime subscriptions and queries)
-- but CANNOT write (INSERT/UPDATE/DELETE must go through Edge Functions)

-- Firefighters: SELECT only for anon/authenticated
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

-- Scheduled Holds: SELECT only for anon/authenticated
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

-- Activity Log: SELECT only (already has anon insert, keep it for now)
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

-- PHASE 3: Service Role Policies (for Edge Functions to write)
-- Edge Functions use service_role which bypasses RLS,
-- but we document the intent here

COMMENT ON TABLE public.firefighters IS 'RLS: anon/auth can SELECT; writes via Edge Functions only';
COMMENT ON TABLE public.scheduled_holds IS 'RLS: anon/auth can SELECT; writes via Edge Functions only';
COMMENT ON TABLE public.activity_log IS 'RLS: anon/auth can SELECT; anon can INSERT for client-side logging';

-- Verify new policies
SELECT tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('firefighters', 'scheduled_holds', 'activity_log')
ORDER BY tablename, policyname;
