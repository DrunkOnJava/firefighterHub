-- Fix RLS policy for realtime.messages to match our topic naming pattern

BEGIN;

-- Drop the incorrect policy
DROP POLICY IF EXISTS "users_can_receive_firefighter_broadcasts" ON realtime.messages;

-- Create correct policy that matches our topic pattern
-- Topics are: firefighters:A, firefighters:B, firefighters:C, scheduled_holds:A, etc.
CREATE POLICY "allow_realtime_broadcasts"
  ON realtime.messages
  FOR SELECT
  TO authenticated, anon
  USING (
    topic ~ '^(firefighters|scheduled_holds):[ABC]$'
  );

COMMIT;

-- Verify policy
SELECT schemaname, tablename, policyname, roles::text[], cmd::text, qual
FROM pg_policies 
WHERE tablename = 'messages' AND schemaname = 'realtime';
