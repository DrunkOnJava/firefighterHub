#!/bin/bash

# Script to apply migrations manually to Supabase
# Since Supabase CLI needs Docker and RPC doesn't support exec_sql,
# this script provides the SQL to copy/paste into Supabase Dashboard

echo "="
echo "🔧 FirefighterHub - Apply Security Migrations"
echo "================================================================"
echo ""
echo "⚠️  Please copy and paste the following SQL into:"
echo "    https://supabase.com/dashboard/project/tjljndzodowpohusrwhs/sql/new"
echo ""
echo "================================================================"
echo ""

cat << 'EOF'
-- ============================================================
-- MIGRATION 1: Create Secure Schedule Hold Function
-- ============================================================

CREATE OR REPLACE FUNCTION public.schedule_hold_secure(
  p_firefighter_id uuid,
  p_firefighter_name text,
  p_hold_date date,
  p_fire_station text,
  p_shift text,
  p_duration text DEFAULT '24h',
  p_start_time time DEFAULT '07:00:00'
)
RETURNS TABLE (
  id uuid,
  firefighter_id uuid,
  firefighter_name text,
  hold_date date,
  fire_station text,
  status text,
  shift text,
  lent_to_shift text,
  notes text,
  duration text,
  start_time time,
  created_at timestamptz,
  updated_at timestamptz,
  completed_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_id uuid;
BEGIN
  -- Validate required fields
  IF p_firefighter_id IS NULL OR p_firefighter_name IS NULL OR p_hold_date IS NULL OR p_shift IS NULL THEN
    RAISE EXCEPTION 'Missing required fields';
  END IF;

  -- Check for existing scheduled hold on same date/shift/station
  IF EXISTS (
    SELECT 1 FROM scheduled_holds
    WHERE hold_date = p_hold_date
      AND shift = p_shift
      AND fire_station = p_fire_station
      AND status = 'scheduled'
  ) THEN
    RAISE EXCEPTION 'Hold already exists for this date/shift/station';
  END IF;

  -- Insert the scheduled hold
  INSERT INTO scheduled_holds (
    firefighter_id,
    firefighter_name,
    hold_date,
    fire_station,
    status,
    shift,
    duration,
    start_time
  )
  VALUES (
    p_firefighter_id,
    p_firefighter_name,
    p_hold_date,
    p_fire_station,
    'scheduled',
    p_shift,
    p_duration,
    p_start_time
  )
  RETURNING scheduled_holds.id INTO v_new_id;

  -- Log the activity
  INSERT INTO activity_log (
    firefighter_id,
    firefighter_name,
    action_type,
    details,
    shift
  )
  VALUES (
    p_firefighter_id,
    p_firefighter_name,
    'hold_scheduled',
    'Scheduled hold for ' || p_hold_date::text,
    p_shift
  );

  -- Return the newly created hold
  RETURN QUERY
  SELECT 
    sh.id,
    sh.firefighter_id,
    sh.firefighter_name,
    sh.hold_date,
    sh.fire_station,
    sh.status,
    sh.shift,
    sh.lent_to_shift,
    sh.notes,
    sh.duration,
    sh.start_time,
    sh.created_at,
    sh.updated_at,
    sh.completed_at
  FROM scheduled_holds sh
  WHERE sh.id = v_new_id;
END;
$$;

-- Grant execute permission
REVOKE ALL ON FUNCTION public.schedule_hold_secure FROM public;
GRANT EXECUTE ON FUNCTION public.schedule_hold_secure TO authenticated;
GRANT EXECUTE ON FUNCTION public.schedule_hold_secure TO anon;

COMMENT ON FUNCTION public.schedule_hold_secure IS 
  'Securely schedule a hold with validation and activity logging';

-- ============================================================
-- MIGRATION 2: Enable RLS with Policies
-- ============================================================

ALTER TABLE firefighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (clean slate)
DROP POLICY IF EXISTS "Allow public read access to firefighters" ON firefighters;
DROP POLICY IF EXISTS "Allow public read access to scheduled_holds" ON scheduled_holds;
DROP POLICY IF EXISTS "Allow public read access to activity_log" ON activity_log;
DROP POLICY IF EXISTS "Allow read access to firefighters" ON firefighters;
DROP POLICY IF EXISTS "Allow authenticated read firefighters" ON firefighters;
DROP POLICY IF EXISTS "Allow read access to scheduled_holds" ON scheduled_holds;
DROP POLICY IF EXISTS "Allow authenticated read scheduled_holds" ON scheduled_holds;
DROP POLICY IF EXISTS "Allow read access to activity_log" ON activity_log;
DROP POLICY IF EXISTS "Allow authenticated read activity_log" ON activity_log;

-- Allow anyone to read (matches current localStorage behavior)
CREATE POLICY "Allow all read firefighters"
ON firefighters FOR SELECT
USING (true);

CREATE POLICY "Allow all read scheduled_holds"
ON scheduled_holds FOR SELECT
USING (true);

CREATE POLICY "Allow all read activity_log"
ON activity_log FOR SELECT
USING (true);

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('firefighters', 'scheduled_holds', 'activity_log');

EOF

echo ""
echo "================================================================"
echo "✅ After running the SQL above, return here and I'll update the client code"
echo "================================================================"
