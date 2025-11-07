-- Secure RLS Migration: Remove public write access, keep read for realtime
-- Run this in Supabase SQL Editor

BEGIN;

-- PHASE 1: Remove public write policies
DROP POLICY IF EXISTS "Enable insert for all users" ON public.firefighters;
DROP POLICY IF EXISTS "Enable update for all users" ON public.firefighters;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.firefighters;

DROP POLICY IF EXISTS "Enable insert for all users" ON public.scheduled_holds;
DROP POLICY IF EXISTS "Enable update for all users" ON public.scheduled_holds;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.scheduled_holds;

-- PHASE 2: Ensure RLS is enabled
ALTER TABLE public.firefighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- PHASE 3: Create SELECT-only policies for realtime
CREATE POLICY firefighters_select_anon ON public.firefighters FOR SELECT TO anon USING (true);
CREATE POLICY firefighters_select_authenticated ON public.firefighters FOR SELECT TO authenticated USING (true);

CREATE POLICY scheduled_holds_select_anon ON public.scheduled_holds FOR SELECT TO anon USING (true);
CREATE POLICY scheduled_holds_select_authenticated ON public.scheduled_holds FOR SELECT TO authenticated USING (true);

CREATE POLICY activity_log_select_anon ON public.activity_log FOR SELECT TO anon USING (true);
CREATE POLICY activity_log_select_authenticated ON public.activity_log FOR SELECT TO authenticated USING (true);

-- PHASE 4: Keep activity_log INSERT for client logging  
CREATE POLICY activity_log_insert_anon ON public.activity_log FOR INSERT TO anon WITH CHECK (true);

COMMIT;

-- Verify
SELECT tablename, policyname, roles::text[], cmd::text 
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('firefighters', 'scheduled_holds', 'activity_log')
ORDER BY tablename, policyname;
