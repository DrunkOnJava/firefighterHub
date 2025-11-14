-- Enable RLS (Row Level Security) for Realtime
-- This is REQUIRED for postgres_changes subscriptions to work properly

-- 1. Enable RLS on tables
ALTER TABLE firefighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_holds ENABLE ROW LEVEL SECURITY;

-- 2. Create policies to allow realtime access
-- For firefighters table
CREATE POLICY "Enable realtime for authenticated users" 
ON firefighters 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Enable realtime for anon users" 
ON firefighters 
FOR SELECT 
TO anon
USING (true);

-- For scheduled_holds table
CREATE POLICY "Enable realtime for authenticated users" 
ON scheduled_holds 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Enable realtime for anon users" 
ON scheduled_holds 
FOR SELECT 
TO anon
USING (true);

-- 3. Verify policies were created
SELECT schemaname, tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('firefighters', 'scheduled_holds')
ORDER BY tablename, policyname;

-- 4. Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('firefighters', 'scheduled_holds');
