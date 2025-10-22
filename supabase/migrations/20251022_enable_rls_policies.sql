-- Enable Row-Level Security (RLS) for FirefighterHub
-- This migration implements proper security policies for all tables

-- ========================================
-- STEP 1: Enable RLS on all tables
-- ========================================

ALTER TABLE firefighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 2: Create helper function to check admin status
-- ========================================

-- Function to check if current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check if user has admin role in metadata
  -- This checks both user_metadata and app_metadata
  RETURN (
    SELECT COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin',
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
      FALSE
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- STEP 3: Policies for firefighters table
-- ========================================

-- Anyone can read firefighters (for public roster viewing)
CREATE POLICY "Anyone can view firefighters"
  ON firefighters
  FOR SELECT
  USING (true);

-- Only admins can insert firefighters
CREATE POLICY "Only admins can add firefighters"
  ON firefighters
  FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update firefighters
CREATE POLICY "Only admins can update firefighters"
  ON firefighters
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete firefighters
CREATE POLICY "Only admins can delete firefighters"
  ON firefighters
  FOR DELETE
  USING (is_admin());

-- ========================================
-- STEP 4: Policies for scheduled_holds table
-- ========================================

-- Anyone can read scheduled holds (for public schedule viewing)
CREATE POLICY "Anyone can view scheduled holds"
  ON scheduled_holds
  FOR SELECT
  USING (true);

-- Only admins can schedule holds
CREATE POLICY "Only admins can schedule holds"
  ON scheduled_holds
  FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update holds (mark completed, etc.)
CREATE POLICY "Only admins can update holds"
  ON scheduled_holds
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete/cancel holds
CREATE POLICY "Only admins can delete holds"
  ON scheduled_holds
  FOR DELETE
  USING (is_admin());

-- ========================================
-- STEP 5: Policies for activity_log table
-- ========================================

-- Anyone can read activity log (for transparency)
CREATE POLICY "Anyone can view activity log"
  ON activity_log
  FOR SELECT
  USING (true);

-- Only admins can add activity log entries
-- Note: This is typically done automatically by the application
CREATE POLICY "Only admins can add activity log"
  ON activity_log
  FOR INSERT
  WITH CHECK (is_admin());

-- Activity log is append-only - no updates or deletes
-- This ensures audit trail integrity

-- ========================================
-- STEP 6: Grant necessary permissions
-- ========================================

-- Grant usage on sequences if any exist
-- (This is needed for UUID generation to work with RLS)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- ========================================
-- OPTIONAL: Policies for public read-only access
-- ========================================

-- If you want to allow anonymous (not logged in) users to view the roster
-- but only admins to modify, uncomment these:

-- CREATE POLICY "Anonymous users can view firefighters"
--   ON firefighters
--   FOR SELECT
--   TO anon
--   USING (true);

-- CREATE POLICY "Anonymous users can view scheduled holds"
--   ON scheduled_holds
--   FOR SELECT
--   TO anon
--   USING (true);

-- CREATE POLICY "Anonymous users can view activity log"
--   ON activity_log
--   FOR SELECT
--   TO anon
--   USING (true);

-- ========================================
-- STEP 7: Create admin user setup function
-- ========================================

-- Function to grant admin role to a user (run this manually for first admin)
CREATE OR REPLACE FUNCTION grant_admin_role(user_email TEXT)
RETURNS void AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get user ID from email
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = user_email
  LIMIT 1;

  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;

  -- Update user metadata to include admin role
  -- Note: This requires running with service role key or in Supabase dashboard
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
  WHERE id = user_id;

  RAISE NOTICE 'Admin role granted to user %', user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- To verify RLS is enabled:
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- AND tablename IN ('firefighters', 'scheduled_holds', 'activity_log');

-- To view all policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public';

-- To grant admin role to the first user (run this in Supabase SQL Editor):
-- SELECT grant_admin_role('your-admin-email@example.com');

-- ========================================
-- ROLLBACK (if needed)
-- ========================================

-- To disable RLS (not recommended for production):
-- ALTER TABLE firefighters DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE scheduled_holds DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE activity_log DISABLE ROW LEVEL SECURITY;
