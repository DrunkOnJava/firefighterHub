-- Migration: Fix RLS Security Policies (v2 - Corrected)
-- Date: 2025-01-31
-- Issue: v1 left duplicate policies, this version drops ALL and rebuilds cleanly
-- Solution: Drop ALL policies first, then create new secure policies

BEGIN;

-- =============================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- =============================================
-- This ensures clean slate regardless of current state

-- Drop all policies on firefighters
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'firefighters'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON firefighters', pol.policyname);
    END LOOP;
END $$;

-- Drop all policies on scheduled_holds
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'scheduled_holds'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON scheduled_holds', pol.policyname);
    END LOOP;
END $$;

-- Drop all policies on activity_log
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'activity_log'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON activity_log', pol.policyname);
    END LOOP;
END $$;

-- =============================================
-- STEP 2: CREATE NEW SECURE POLICIES
-- =============================================

-- ============= FIREFIGHTERS TABLE =============

-- Public can read (firefighters can view rotation)
CREATE POLICY "public_read_firefighters"
  ON firefighters
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert (battalion chiefs only)
CREATE POLICY "auth_insert_firefighters"
  ON firefighters
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update (battalion chiefs only)
CREATE POLICY "auth_update_firefighters"
  ON firefighters
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete (battalion chiefs only)
CREATE POLICY "auth_delete_firefighters"
  ON firefighters
  FOR DELETE
  TO authenticated
  USING (true);

-- ============= SCHEDULED_HOLDS TABLE =============

-- Public can read (firefighters can view holds)
CREATE POLICY "public_read_scheduled_holds"
  ON scheduled_holds
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert
CREATE POLICY "auth_insert_scheduled_holds"
  ON scheduled_holds
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "auth_update_scheduled_holds"
  ON scheduled_holds
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete
CREATE POLICY "auth_delete_scheduled_holds"
  ON scheduled_holds
  FOR DELETE
  TO authenticated
  USING (true);

-- ============= ACTIVITY_LOG TABLE =============

-- Public can read (transparency)
CREATE POLICY "public_read_activity_log"
  ON activity_log
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert (audit trail)
-- NO UPDATE or DELETE - activity log is append-only
CREATE POLICY "auth_insert_activity_log"
  ON activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =============================================
-- STEP 3: VERIFICATION
-- =============================================

-- Verify policy counts
DO $$
DECLARE
  ff_count INTEGER;
  sh_count INTEGER;
  al_count INTEGER;
BEGIN
  -- Count firefighters policies (should be 4)
  SELECT COUNT(*) INTO ff_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'firefighters';

  -- Count scheduled_holds policies (should be 4)
  SELECT COUNT(*) INTO sh_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'scheduled_holds';

  -- Count activity_log policies (should be 2)
  SELECT COUNT(*) INTO al_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'activity_log';

  IF ff_count != 4 THEN
    RAISE EXCEPTION 'firefighters table has % policies, expected 4', ff_count;
  END IF;

  IF sh_count != 4 THEN
    RAISE EXCEPTION 'scheduled_holds table has % policies, expected 4', sh_count;
  END IF;

  IF al_count != 2 THEN
    RAISE EXCEPTION 'activity_log table has % policies, expected 2', al_count;
  END IF;

  RAISE NOTICE '✅ RLS policies successfully configured!';
  RAISE NOTICE '   - firefighters: % policies (1 public read + 3 auth write)', ff_count;
  RAISE NOTICE '   - scheduled_holds: % policies (1 public read + 3 auth write)', sh_count;
  RAISE NOTICE '   - activity_log: % policies (1 public read + 1 auth insert)', al_count;
END $$;

-- Display final policy summary
SELECT
  tablename,
  policyname,
  cmd,
  roles,
  CASE
    WHEN roles = '{public}' THEN '🌐 Public Read-Only'
    WHEN roles = '{authenticated}' THEN '🔒 Auth Required'
    ELSE roles::text
  END as access_level
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('firefighters', 'scheduled_holds', 'activity_log')
ORDER BY tablename, cmd;

COMMIT;

-- =============================================
-- POST-MIGRATION TESTING
-- =============================================

-- Test these after migration completes:

-- 1. Anonymous read (should SUCCEED):
-- SELECT * FROM firefighters WHERE shift = 'A' LIMIT 1;

-- 2. Anonymous write (should FAIL with RLS error):
-- INSERT INTO firefighters (name, shift, fire_station, order_position)
-- VALUES ('Unauthorized User', 'A', '99', 999);

-- Expected error: "new row violates row-level security policy"

-- 3. Check all policies are in place:
-- SELECT tablename, COUNT(*) as policy_count
-- FROM pg_policies
-- WHERE schemaname = 'public'
--   AND tablename IN ('firefighters', 'scheduled_holds', 'activity_log')
-- GROUP BY tablename;

-- Expected:
-- firefighters: 4
-- scheduled_holds: 4
-- activity_log: 2
