-- Fix Realtime Broadcast Authorization
-- 
-- This migration enables RLS on realtime.messages and creates policies
-- to allow authenticated and anonymous users to subscribe to broadcast channels
-- for the firefighters and scheduled_holds topics.
--
-- Background:
-- - The app uses Supabase Realtime broadcast (modern approach, not postgres_changes)
-- - Broadcast requires RLS policies on realtime.messages table
-- - Topics follow pattern: firefighters:{shift} and scheduled_holds:{shift}
-- - Shifts are A, B, or C
--
-- Security model:
-- - Anonymous users (anon) can read broadcasts (view-only app access)
-- - Authenticated users can read and send broadcasts
-- - Topics are scoped by shift (firefighters:A, firefighters:B, etc.)

-- Enable RLS on realtime.messages (safe to re-run)
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent migration)
DROP POLICY IF EXISTS "allow_anon_read_firefighters_topics" ON realtime.messages;
DROP POLICY IF EXISTS "allow_anon_read_scheduled_holds_topics" ON realtime.messages;
DROP POLICY IF EXISTS "allow_authenticated_read_firefighters_topics" ON realtime.messages;
DROP POLICY IF EXISTS "allow_authenticated_read_scheduled_holds_topics" ON realtime.messages;
DROP POLICY IF EXISTS "allow_authenticated_insert_firefighters_topics" ON realtime.messages;
DROP POLICY IF EXISTS "allow_authenticated_insert_scheduled_holds_topics" ON realtime.messages;

-- Allow anonymous users to read firefighters broadcasts (view-only access)
-- Pattern: firefighters:A, firefighters:B, firefighters:C
CREATE POLICY "allow_anon_read_firefighters_topics"
  ON realtime.messages
  FOR SELECT
  TO anon
  USING ( 
    topic ~ '^firefighters:[ABC]$'
  );

-- Allow anonymous users to read scheduled_holds broadcasts (view-only access)
-- Pattern: scheduled_holds:A, scheduled_holds:B, scheduled_holds:C
CREATE POLICY "allow_anon_read_scheduled_holds_topics"
  ON realtime.messages
  FOR SELECT
  TO anon
  USING ( 
    topic ~ '^scheduled_holds:[ABC]$'
  );

-- Allow authenticated users to read firefighters broadcasts
CREATE POLICY "allow_authenticated_read_firefighters_topics"
  ON realtime.messages
  FOR SELECT
  TO authenticated
  USING ( 
    topic ~ '^firefighters:[ABC]$'
  );

-- Allow authenticated users to read scheduled_holds broadcasts
CREATE POLICY "allow_authenticated_read_scheduled_holds_topics"
  ON realtime.messages
  FOR SELECT
  TO authenticated
  USING ( 
    topic ~ '^scheduled_holds:[ABC]$'
  );

-- Allow authenticated users to send firefighters broadcasts (for future use)
CREATE POLICY "allow_authenticated_insert_firefighters_topics"
  ON realtime.messages
  FOR INSERT
  TO authenticated
  WITH CHECK ( 
    topic ~ '^firefighters:[ABC]$'
  );

-- Allow authenticated users to send scheduled_holds broadcasts (for future use)
CREATE POLICY "allow_authenticated_insert_scheduled_holds_topics"
  ON realtime.messages
  FOR INSERT
  TO authenticated
  WITH CHECK ( 
    topic ~ '^scheduled_holds:[ABC]$'
  );

-- Verify policies were created
DO $$
BEGIN
  RAISE NOTICE 'Realtime broadcast policies created successfully';
  RAISE NOTICE 'Topics allowed: firefighters:[A|B|C], scheduled_holds:[A|B|C]';
  RAISE NOTICE 'Anonymous: SELECT only (view-only)';
  RAISE NOTICE 'Authenticated: SELECT and INSERT (full access)';
END $$;
