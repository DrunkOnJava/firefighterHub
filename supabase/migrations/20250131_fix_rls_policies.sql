-- Migration: Fix RLS Security Policies
-- Date: 2025-01-31
-- Author: Security Audit Remediation
-- Issue: All tables have overly permissive RLS policies allowing unrestricted public access
-- Solution: Implement "Public Read + Authenticated Write" security model

-- =============================================
-- SECURITY MODEL: Public Read + Auth Write
-- =============================================
-- Rationale:
-- - Firefighters can VIEW rotation without login (transparency)
-- - Only authenticated users (battalion chiefs) can MODIFY data
-- - Maintains current UX while adding security
-- - Can be upgraded to shift-based isolation later

BEGIN;

-- =============================================
-- 1. FIREFIGHTERS TABLE
-- =============================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Enable insert access for all users" ON firefighters;
DROP POLICY IF EXISTS "Enable update access for all users" ON firefighters;
DROP POLICY IF EXISTS "Enable delete access for all users" ON firefighters;

-- Keep public read access (existing policy is fine)
-- Policy: "Enable read access for all users" - KEEP AS IS

-- Add auth-required write policies
CREATE POLICY "firefighters_insert_auth_only"
  ON firefighters
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "firefighters_update_auth_only"
  ON firefighters
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "firefighters_delete_auth_only"
  ON firefighters
  FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- 2. SCHEDULED_HOLDS TABLE
-- =============================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Enable insert access for all users" ON scheduled_holds;
DROP POLICY IF EXISTS "Enable update access for all users" ON scheduled_holds;
DROP POLICY IF EXISTS "Enable delete access for all users" ON scheduled_holds;

-- Keep public read access (existing policy is fine)
-- Policy: "Enable read access for all users" - KEEP AS IS

-- Add auth-required write policies
CREATE POLICY "scheduled_holds_insert_auth_only"
  ON scheduled_holds
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "scheduled_holds_update_auth_only"
  ON scheduled_holds
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "scheduled_holds_delete_auth_only"
  ON scheduled_holds
  FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- 3. ACTIVITY_LOG TABLE
-- =============================================

-- Drop overly permissive insert policy
DROP POLICY IF EXISTS "Enable insert access for all users" ON activity_log;

-- Keep public read access (existing policy is fine)
-- Policy: "Enable read access for all users" - KEEP AS IS

-- Add auth-required insert policy
CREATE POLICY "activity_log_insert_auth_only"
  ON activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Activity log should be append-only (no updates or deletes)
-- This ensures audit trail integrity

-- =============================================
-- 4. VERIFICATION QUERIES
-- =============================================

-- Verify all policies are in place
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  -- Count policies for firefighters (should have 4: read, insert, update, delete)
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'firefighters';

  IF policy_count != 4 THEN
    RAISE EXCEPTION 'Expected 4 policies on firefighters table, found %', policy_count;
  END IF;

  -- Count policies for scheduled_holds (should have 4: read, insert, update, delete)
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'scheduled_holds';

  IF policy_count != 4 THEN
    RAISE EXCEPTION 'Expected 4 policies on scheduled_holds table, found %', policy_count;
  END IF;

  -- Count policies for activity_log (should have 2: read, insert)
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'activity_log';

  IF policy_count != 2 THEN
    RAISE EXCEPTION 'Expected 2 policies on activity_log table, found %', policy_count;
  END IF;

  RAISE NOTICE 'RLS policies successfully configured and verified!';
END $$;

-- =============================================
-- 5. TESTING QUERIES
-- =============================================

-- Test that anonymous users can read
-- (Run these after migration to verify)

-- Should SUCCEED (public read):
-- SELECT * FROM firefighters WHERE shift = 'A' LIMIT 1;

-- Should FAIL (auth required):
-- INSERT INTO firefighters (name, shift, fire_station, order_position)
-- VALUES ('Test User', 'A', '10', 999);

-- Should FAIL (auth required):
-- UPDATE firefighters SET order_position = 0 WHERE name = 'Test User';

-- Should FAIL (auth required):
-- DELETE FROM firefighters WHERE name = 'Test User';

COMMIT;

-- =============================================
-- 6. ROLLBACK PLAN (if needed)
-- =============================================

-- To rollback this migration, restore original permissive policies:
--
-- CREATE POLICY "Enable insert access for all users"
--   ON firefighters FOR INSERT TO public WITH CHECK (true);
--
-- CREATE POLICY "Enable update access for all users"
--   ON firefighters FOR UPDATE TO public USING (true) WITH CHECK (true);
--
-- CREATE POLICY "Enable delete access for all users"
--   ON firefighters FOR DELETE TO public USING (true);
--
-- (Repeat for scheduled_holds and activity_log)

-- =============================================
-- 7. FUTURE ENHANCEMENTS
-- =============================================

-- Phase 2: Shift-Based Isolation (for multi-department deployments)
--
-- CREATE TABLE user_shifts (
--   user_id UUID REFERENCES auth.users(id),
--   shift VARCHAR(1) CHECK (shift IN ('A', 'B', 'C')),
--   is_admin BOOLEAN DEFAULT FALSE,
--   department_id UUID, -- For multi-tenancy
--   PRIMARY KEY (user_id, shift)
-- );
--
-- CREATE POLICY "Users can only access their assigned shifts"
--   ON firefighters FOR SELECT TO authenticated
--   USING (shift IN (SELECT shift FROM user_shifts WHERE user_id = auth.uid()));
--
-- CREATE POLICY "Users can only modify their assigned shifts"
--   ON firefighters FOR UPDATE TO authenticated
--   USING (shift IN (SELECT shift FROM user_shifts WHERE user_id = auth.uid()));

-- =============================================
-- MIGRATION COMPLETE
-- =============================================
--
-- Summary:
-- - Public users: READ-ONLY access to all tables
-- - Authenticated users: FULL access to all operations
-- - Activity log: Append-only (no updates/deletes)
-- - Security level: Medium (acceptable for single department)
-- - Upgrade path: Shift-based isolation available
--
-- Next Steps:
-- 1. Test with authenticated user
-- 2. Test with anonymous user (should fail writes)
-- 3. Verify existing app functionality still works
-- 4. Monitor for any permission errors in production
