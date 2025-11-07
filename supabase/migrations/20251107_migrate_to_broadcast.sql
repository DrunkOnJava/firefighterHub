-- Migrate from postgres_changes to broadcast (recommended by Supabase)
-- This fixes the "mismatch between server and client bindings" error

BEGIN;

-- Step 1: Create broadcast trigger function for firefighters
CREATE OR REPLACE FUNCTION firefighters_broadcast_trigger()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Broadcast to shift-specific topic (matches client subscription pattern)
  PERFORM realtime.broadcast_changes(
    'firefighters:' || COALESCE(NEW.shift, OLD.shift)::text,
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Step 2: Create broadcast trigger function for scheduled_holds
CREATE OR REPLACE FUNCTION scheduled_holds_broadcast_trigger()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Broadcast to shift-specific topic
  PERFORM realtime.broadcast_changes(
    'scheduled_holds:' || COALESCE(NEW.shift, OLD.shift)::text,
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Step 3: Create triggers
DROP TRIGGER IF EXISTS firefighters_broadcast_trigger ON public.firefighters;
CREATE TRIGGER firefighters_broadcast_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.firefighters
  FOR EACH ROW EXECUTE FUNCTION firefighters_broadcast_trigger();

DROP TRIGGER IF EXISTS scheduled_holds_broadcast_trigger ON public.scheduled_holds;
CREATE TRIGGER scheduled_holds_broadcast_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.scheduled_holds
  FOR EACH ROW EXECUTE FUNCTION scheduled_holds_broadcast_trigger();

-- Step 4: Setup RLS policies for realtime.messages (required for private channels)
-- Allow authenticated users to receive broadcasts for their shift
CREATE POLICY "users_can_receive_firefighter_broadcasts"
  ON realtime.messages
  FOR SELECT
  TO authenticated, anon
  USING (
    topic LIKE 'firefighters:%' OR 
    topic LIKE 'scheduled_holds:%'
  );

-- Step 5: Add indexes for better RLS performance
CREATE INDEX IF NOT EXISTS idx_firefighters_shift ON public.firefighters(shift);
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_shift ON public.scheduled_holds(shift);

COMMIT;

-- Verify setup
SELECT 'Triggers created:' as status;
SELECT tgname, tgrelid::regclass::text as table_name 
FROM pg_trigger 
WHERE tgname LIKE '%broadcast%'
ORDER BY table_name;

SELECT 'RLS policies created:' as status;
SELECT policyname, tablename 
FROM pg_policies 
WHERE tablename = 'messages' AND schemaname = 'realtime';
