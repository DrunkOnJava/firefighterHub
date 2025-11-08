-- Fix realtime authorization for anon users
-- Root cause: App uses anon key, but policies only allowed authenticated users

-- Drop old policies
DROP POLICY IF EXISTS "allow_authenticated_read_firefighters_topics" ON realtime.messages;
DROP POLICY IF EXISTS "allow_authenticated_insert_firefighters_topics" ON realtime.messages;

-- Create new policies that allow BOTH authenticated AND anon users
CREATE POLICY "allow_realtime_read_firefighters_and_holds"
  ON realtime.messages
  FOR SELECT
  TO authenticated, anon
  USING ( 
    topic ~ '^(firefighters|scheduled_holds):[ABC]$'
  );

CREATE POLICY "allow_realtime_insert_firefighters_and_holds"
  ON realtime.messages
  FOR INSERT
  TO authenticated, anon
  WITH CHECK ( 
    topic ~ '^(firefighters|scheduled_holds):[ABC]$'
  );

-- Verify RLS is enabled
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;
