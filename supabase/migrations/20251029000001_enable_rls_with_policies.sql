-- Enable RLS on all tables (if not already enabled)
ALTER TABLE firefighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean slate)
DROP POLICY IF EXISTS "Allow public read access to firefighters" ON firefighters;
DROP POLICY IF EXISTS "Allow public read access to scheduled_holds" ON scheduled_holds;
DROP POLICY IF EXISTS "Allow public read access to activity_log" ON activity_log;

-- Firefighters: Allow anyone to read (matches current localStorage behavior)
-- TODO: Restrict by org/station when multi-tenant is implemented
CREATE POLICY "Allow read access to firefighters"
ON firefighters FOR SELECT
TO public
USING (true);

-- Allow authenticated users and anon to read all (temporary - matches current app behavior)
CREATE POLICY "Allow authenticated read firefighters"
ON firefighters FOR SELECT
TO authenticated, anon
USING (true);

-- Scheduled Holds: Allow anyone to read
CREATE POLICY "Allow read access to scheduled_holds"
ON scheduled_holds FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated read scheduled_holds"
ON scheduled_holds FOR SELECT
TO authenticated, anon
USING (true);

-- Activity Log: Allow anyone to read
CREATE POLICY "Allow read access to activity_log"
ON activity_log FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated read activity_log"
ON activity_log FOR SELECT
TO authenticated, anon
USING (true);

-- Note: INSERT/UPDATE/DELETE are restricted - must go through SECURITY DEFINER functions
-- This prevents direct manipulation while allowing secure operations through validated functions

-- Verify RLS is enabled
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN 
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename IN ('firefighters', 'scheduled_holds', 'activity_log')
  LOOP
    IF r.rowsecurity THEN
      RAISE NOTICE 'Table %.% has RLS enabled ✓', 'public', r.tablename;
    ELSE
      RAISE WARNING 'Table %.% does NOT have RLS enabled!', 'public', r.tablename;
    END IF;
  END LOOP;
END $$;
