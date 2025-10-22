-- Fix Schema Mismatches for FirefighterHub
-- This migration adds missing fields to scheduled_holds and activity_log tables
-- to match what the application code expects.

-- ========================================
-- FIX 1: Add missing columns to scheduled_holds table
-- ========================================

-- Add firefighter_name column (for display without join)
ALTER TABLE scheduled_holds
ADD COLUMN IF NOT EXISTS firefighter_name TEXT;

-- Add hold_date column (code uses this instead of scheduled_date)
ALTER TABLE scheduled_holds
ADD COLUMN IF NOT EXISTS hold_date DATE;

-- Add status column (code uses this instead of is_completed boolean)
ALTER TABLE scheduled_holds
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('scheduled', 'completed', 'skipped'));

-- Add shift column (for filtering holds by shift)
ALTER TABLE scheduled_holds
ADD COLUMN IF NOT EXISTS shift VARCHAR(1) CHECK (shift IN ('A', 'B', 'C'));

-- Add fire_station column (to track which station the hold was at)
ALTER TABLE scheduled_holds
ADD COLUMN IF NOT EXISTS fire_station VARCHAR(255);

-- Add notes column (for additional hold information)
ALTER TABLE scheduled_holds
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Migrate existing data from old columns to new columns
UPDATE scheduled_holds
SET hold_date = scheduled_date
WHERE hold_date IS NULL AND scheduled_date IS NOT NULL;

UPDATE scheduled_holds
SET status = CASE
    WHEN is_completed = true THEN 'completed'
    ELSE 'scheduled'
END
WHERE status IS NULL;

-- Populate firefighter_name and shift from firefighters table
UPDATE scheduled_holds sh
SET
    firefighter_name = f.name,
    shift = f.shift,
    fire_station = COALESCE(sh.fire_station, f.fire_station)
FROM firefighters f
WHERE sh.firefighter_id = f.id
  AND (sh.firefighter_name IS NULL OR sh.shift IS NULL);

-- Create index on new columns for performance
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_hold_date ON scheduled_holds(hold_date);
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_status ON scheduled_holds(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_shift ON scheduled_holds(shift);

-- ========================================
-- FIX 2: Add missing columns to activity_log table
-- ========================================

-- Add firefighter_name column (for display without join)
ALTER TABLE activity_log
ADD COLUMN IF NOT EXISTS firefighter_name TEXT;

-- Add shift column (for filtering activity by shift)
ALTER TABLE activity_log
ADD COLUMN IF NOT EXISTS shift VARCHAR(1) CHECK (shift IN ('A', 'B', 'C'));

-- Add details column (code uses this instead of description)
ALTER TABLE activity_log
ADD COLUMN IF NOT EXISTS details TEXT;

-- Migrate existing data from old columns to new columns
UPDATE activity_log
SET details = description
WHERE details IS NULL AND description IS NOT NULL;

-- Populate firefighter_name and shift from firefighters table
UPDATE activity_log al
SET
    firefighter_name = f.name,
    shift = f.shift
FROM firefighters f
WHERE al.firefighter_id = f.id
  AND (al.firefighter_name IS NULL OR al.shift IS NULL);

-- Create index on new columns for performance
CREATE INDEX IF NOT EXISTS idx_activity_log_shift ON activity_log(shift);
CREATE INDEX IF NOT EXISTS idx_activity_log_firefighter_name ON activity_log(firefighter_name);

-- ========================================
-- FIX 3: Create trigger to auto-populate denormalized fields
-- ========================================

-- Function to auto-populate firefighter_name and shift in scheduled_holds
CREATE OR REPLACE FUNCTION populate_scheduled_holds_metadata()
RETURNS TRIGGER AS $$
BEGIN
    -- Get firefighter info and populate denormalized fields
    SELECT name, shift, fire_station
    INTO NEW.firefighter_name, NEW.shift, NEW.fire_station
    FROM firefighters
    WHERE id = NEW.firefighter_id;

    -- If fire_station wasn't explicitly set, use firefighter's default
    IF NEW.fire_station IS NULL THEN
        NEW.fire_station := (SELECT fire_station FROM firefighters WHERE id = NEW.firefighter_id);
    END IF;

    -- If hold_date wasn't set, use scheduled_date (backwards compatibility)
    IF NEW.hold_date IS NULL AND NEW.scheduled_date IS NOT NULL THEN
        NEW.hold_date := NEW.scheduled_date;
    END IF;

    -- If status wasn't set, default to 'scheduled'
    IF NEW.status IS NULL THEN
        NEW.status := 'scheduled';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for scheduled_holds inserts
CREATE TRIGGER populate_scheduled_holds_metadata_on_insert
    BEFORE INSERT ON scheduled_holds
    FOR EACH ROW
    EXECUTE FUNCTION populate_scheduled_holds_metadata();

-- Trigger for scheduled_holds updates
CREATE TRIGGER populate_scheduled_holds_metadata_on_update
    BEFORE UPDATE ON scheduled_holds
    FOR EACH ROW
    WHEN (OLD.firefighter_id IS DISTINCT FROM NEW.firefighter_id)
    EXECUTE FUNCTION populate_scheduled_holds_metadata();

-- Function to auto-populate firefighter_name and shift in activity_log
CREATE OR REPLACE FUNCTION populate_activity_log_metadata()
RETURNS TRIGGER AS $$
BEGIN
    -- Get firefighter info and populate denormalized fields
    IF NEW.firefighter_id IS NOT NULL THEN
        SELECT name, shift
        INTO NEW.firefighter_name, NEW.shift
        FROM firefighters
        WHERE id = NEW.firefighter_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for activity_log inserts
CREATE TRIGGER populate_activity_log_metadata_on_insert
    BEFORE INSERT ON activity_log
    FOR EACH ROW
    EXECUTE FUNCTION populate_activity_log_metadata();

-- ========================================
-- VERIFICATION QUERIES (Run these to verify the migration worked)
-- ========================================

-- Uncomment to test after migration:
-- SELECT COUNT(*) as total_holds,
--        COUNT(hold_date) as with_hold_date,
--        COUNT(status) as with_status,
--        COUNT(firefighter_name) as with_name,
--        COUNT(shift) as with_shift
-- FROM scheduled_holds;

-- SELECT COUNT(*) as total_activities,
--        COUNT(firefighter_name) as with_name,
--        COUNT(shift) as with_shift,
--        COUNT(details) as with_details
-- FROM activity_log;
