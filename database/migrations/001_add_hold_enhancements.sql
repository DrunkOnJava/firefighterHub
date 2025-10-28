-- Migration: Add Hold System Enhancements
-- Purpose: Add missing fields for full rules compliance
-- Date: 2025-10-28
--
-- This migration adds:
-- 1. Hold duration (12h/24h)
-- 2. Start time with 07:00 default
-- 3. Hours worked tracking for 72-hour rule
-- 4. Status enum (scheduled, completed, skipped)
-- 5. Firefighter name denormalization
-- 6. Shift assignment
-- 7. Hold station assignment
-- 8. Shift lending tracking
-- 9. Notes field

-- =======================
-- STEP 1: Add new columns to scheduled_holds
-- =======================

-- Rename scheduled_date to hold_date for consistency with TypeScript types
ALTER TABLE scheduled_holds RENAME COLUMN scheduled_date TO hold_date;

-- Add firefighter_name (denormalized for performance and history)
ALTER TABLE scheduled_holds ADD COLUMN IF NOT EXISTS firefighter_name VARCHAR(255);

-- Backfill firefighter_name from firefighters table
UPDATE scheduled_holds sh
SET firefighter_name = f.name
FROM firefighters f
WHERE sh.firefighter_id = f.id
AND sh.firefighter_name IS NULL;

-- Make firefighter_name NOT NULL after backfill
ALTER TABLE scheduled_holds ALTER COLUMN firefighter_name SET NOT NULL;

-- Add status enum (replacing is_completed boolean)
CREATE TYPE hold_status AS ENUM ('scheduled', 'completed', 'skipped');

ALTER TABLE scheduled_holds ADD COLUMN IF NOT EXISTS status hold_status DEFAULT 'scheduled';

-- Backfill status from is_completed
UPDATE scheduled_holds
SET status = CASE
    WHEN is_completed = true THEN 'completed'::hold_status
    ELSE 'scheduled'::hold_status
END
WHERE status IS NULL OR status = 'scheduled';

-- Drop old is_completed column
ALTER TABLE scheduled_holds DROP COLUMN IF EXISTS is_completed;

-- Make status NOT NULL
ALTER TABLE scheduled_holds ALTER COLUMN status SET NOT NULL;

-- Add shift
ALTER TABLE scheduled_holds ADD COLUMN IF NOT EXISTS shift VARCHAR(1) CHECK (shift IN ('A', 'B', 'C'));

-- Backfill shift from firefighters table
UPDATE scheduled_holds sh
SET shift = f.shift
FROM firefighters f
WHERE sh.firefighter_id = f.id
AND sh.shift IS NULL;

-- Make shift NOT NULL after backfill
ALTER TABLE scheduled_holds ALTER COLUMN shift SET NOT NULL;

-- Add fire_station (where the hold is taking place)
ALTER TABLE scheduled_holds ADD COLUMN IF NOT EXISTS fire_station VARCHAR(255);

-- Backfill fire_station from firefighters table (default to their home station)
UPDATE scheduled_holds sh
SET fire_station = f.fire_station
FROM firefighters f
WHERE sh.firefighter_id = f.id
AND sh.fire_station IS NULL;

-- Add lent_to_shift (which shift is this firefighter being lent to)
ALTER TABLE scheduled_holds ADD COLUMN IF NOT EXISTS lent_to_shift VARCHAR(1) CHECK (lent_to_shift IN ('A', 'B', 'C'));

-- Add notes field
ALTER TABLE scheduled_holds ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add duration field (12 hours or 24 hours)
CREATE TYPE hold_duration AS ENUM ('12h', '24h');
ALTER TABLE scheduled_holds ADD COLUMN IF NOT EXISTS duration hold_duration DEFAULT '24h';
ALTER TABLE scheduled_holds ALTER COLUMN duration SET NOT NULL;

-- Add start_time field with 07:00 default
ALTER TABLE scheduled_holds ADD COLUMN IF NOT EXISTS start_time TIME DEFAULT '07:00:00';
ALTER TABLE scheduled_holds ALTER COLUMN start_time SET NOT NULL;

-- =======================
-- STEP 2: Add hours_worked tracking to firefighters
-- =======================

-- Add hours_worked_this_period for 72-hour rule tracking
ALTER TABLE firefighters ADD COLUMN IF NOT EXISTS hours_worked_this_period INTEGER DEFAULT 0;
ALTER TABLE firefighters ALTER COLUMN hours_worked_this_period SET NOT NULL;

-- Add last_hours_reset_date to track when hours were last reset
ALTER TABLE firefighters ADD COLUMN IF NOT EXISTS last_hours_reset_date TIMESTAMP WITH TIME ZONE;

-- =======================
-- STEP 3: Update indexes for new fields
-- =======================

-- Index on status for filtering
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_status ON scheduled_holds(status);

-- Index on shift for filtering
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_shift ON scheduled_holds(shift);

-- Index on fire_station for metrics
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_station ON scheduled_holds(fire_station);

-- Composite index for shift + date queries
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_shift_date ON scheduled_holds(shift, hold_date);

-- =======================
-- STEP 4: Update activity_log table to match implementation
-- =======================

-- Rename description to details for consistency
ALTER TABLE activity_log RENAME COLUMN description TO details;

-- Add shift field to activity_log
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS shift VARCHAR(1) CHECK (shift IN ('A', 'B', 'C'));

-- Add firefighter_name for denormalization
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS firefighter_name VARCHAR(255) NOT NULL DEFAULT 'Unknown';

-- Backfill firefighter_name from firefighters table
UPDATE activity_log al
SET firefighter_name = f.name
FROM firefighters f
WHERE al.firefighter_id = f.id
AND al.firefighter_name = 'Unknown';

-- =======================
-- STEP 5: Update unique constraint
-- =======================

-- Drop old unique constraint
ALTER TABLE scheduled_holds DROP CONSTRAINT IF EXISTS scheduled_holds_firefighter_id_scheduled_date_key;
ALTER TABLE scheduled_holds DROP CONSTRAINT IF EXISTS scheduled_holds_firefighter_id_hold_date_key;

-- Note: We allow multiple holds per firefighter per date now (different people can be held on same date)
-- The application will handle conflict checking at the business logic level

-- =======================
-- STEP 6: Update triggers to include new timestamp field
-- =======================

-- Trigger already exists from original schema, just verify it works with new columns
-- update_scheduled_holds_updated_at trigger should handle all columns automatically

-- =======================
-- VERIFICATION QUERIES
-- =======================

-- Run these after migration to verify:

-- Check all scheduled_holds have required fields
-- SELECT COUNT(*) FROM scheduled_holds WHERE firefighter_name IS NULL OR status IS NULL OR shift IS NULL;
-- Expected: 0

-- Check all statuses are valid
-- SELECT DISTINCT status FROM scheduled_holds;
-- Expected: scheduled, completed, skipped (or subset)

-- Check all shifts are valid
-- SELECT DISTINCT shift FROM scheduled_holds;
-- Expected: A, B, C (or subset)

-- Check duration distribution
-- SELECT duration, COUNT(*) FROM scheduled_holds GROUP BY duration;

-- Check start time distribution
-- SELECT start_time, COUNT(*) FROM scheduled_holds GROUP BY start_time;

COMMIT;
