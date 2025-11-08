-- Migration: Fix Realtime Broadcast Permissions
-- Date: 2025-11-08
-- Description: Enable anonymous users to subscribe to broadcast channels for firefighters and scheduled_holds

-- ============================================================================
-- STEP 1: Drop old postgres_changes policies (no longer needed)
-- ============================================================================

DROP POLICY IF EXISTS "Enable realtime for authenticated users" ON public.firefighters;
DROP POLICY IF EXISTS "Enable realtime for authenticated users" ON public.scheduled_holds;

-- ============================================================================
-- STEP 2: Create RLS policies on realtime.messages for broadcast channels
-- ============================================================================

-- Allow anonymous and authenticated users to SELECT from broadcast topics
-- Topics follow pattern: "firefighters:A", "firefighters:B", "firefighters:C", 
-- "scheduled_holds:A", "scheduled_holds:B", "scheduled_holds:C"

CREATE POLICY "allow_firefighter_broadcasts_select"
ON realtime.messages
FOR SELECT
TO anon, authenticated
USING (
  topic ~ '^firefighters:[ABC]$'
);

CREATE POLICY "allow_scheduled_holds_broadcasts_select"
ON realtime.messages
FOR SELECT
TO anon, authenticated
USING (
  topic ~ '^scheduled_holds:[ABC]$'
);

-- ============================================================================
-- STEP 3: Create database triggers to broadcast changes
-- ============================================================================

-- Trigger function for firefighters table
CREATE OR REPLACE FUNCTION public.broadcast_firefighter_changes()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Broadcast to topic: firefighters:{shift}
  -- This sends the change to all clients subscribed to that shift's channel
  PERFORM realtime.broadcast_changes(
    'firefighters:' || COALESCE(NEW.shift, OLD.shift),
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

-- Trigger function for scheduled_holds table
CREATE OR REPLACE FUNCTION public.broadcast_scheduled_hold_changes()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Broadcast to topic: scheduled_holds:{shift}
  PERFORM realtime.broadcast_changes(
    'scheduled_holds:' || COALESCE(NEW.shift, OLD.shift),
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

-- ============================================================================
-- STEP 4: Attach triggers to tables
-- ============================================================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS firefighters_broadcast_trigger ON public.firefighters;
DROP TRIGGER IF EXISTS scheduled_holds_broadcast_trigger ON public.scheduled_holds;

-- Create new triggers for real-time broadcasting
CREATE TRIGGER firefighters_broadcast_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.firefighters
  FOR EACH ROW
  EXECUTE FUNCTION public.broadcast_firefighter_changes();

CREATE TRIGGER scheduled_holds_broadcast_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.scheduled_holds
  FOR EACH ROW
  EXECUTE FUNCTION public.broadcast_scheduled_hold_changes();

-- ============================================================================
-- STEP 5: Verify setup
-- ============================================================================

-- Query to verify policies exist
DO $$
BEGIN
  RAISE NOTICE 'Migration complete. Verifying...';
  RAISE NOTICE 'Policies on realtime.messages:';
END $$;

-- Show all policies on realtime.messages
SELECT 
  polname AS policy_name,
  polcmd AS command,
  polroles::regrole[] AS roles
FROM pg_policy pol
JOIN pg_class c ON pol.polrelid = c.oid
WHERE c.relname = 'messages'
  AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'realtime')
ORDER BY polname;
