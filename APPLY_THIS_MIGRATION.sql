-- ========================================
-- FIREFIGHTERHUB DATABASE MIGRATION
-- Apply this in Supabase SQL Editor
-- ========================================

-- This migration is SAFE - it:
-- ✅ Preserves all existing data
-- ✅ Only adds new columns (doesn't delete anything)
-- ✅ Migrates old data to new columns automatically
-- ✅ Uses IF NOT EXISTS (safe to run multiple times)

-- ========================================
-- STEP 1: Add missing columns to scheduled_holds
-- ========================================

ALTER TABLE scheduled_holds
ADD COLUMN IF NOT EXISTS firefighter_name TEXT;

ALTER TABLE scheduled_holds
ADD COLUMN IF NOT EXISTS hold_date DATE;

ALTER TABLE scheduled_holds
ADD COLUMN IF NOT EXISTS status TEXT
CHECK (status IN ('scheduled', 'completed', 'skipped'));

ALTER TABLE scheduled_holds
ADD COLUMN IF NOT EXISTS shift VARCHAR(1)
CHECK (shift IN ('A', 'B', 'C'));

ALTER TABLE scheduled_holds
ADD COLUMN IF NOT EXISTS fire_station VARCHAR(255);

ALTER TABLE scheduled_holds
ADD COLUMN IF NOT EXISTS notes TEXT;

-- ========================================
-- STEP 2: Migrate existing data to new columns
-- ========================================

-- Copy scheduled_date to hold_date
UPDATE scheduled_holds
SET hold_date = scheduled_date
WHERE hold_date IS NULL AND scheduled_date IS NOT NULL;

-- Convert is_completed boolean to status text
UPDATE scheduled_holds
SET status = CASE
    WHEN is_completed = true THEN 'completed'
    ELSE 'scheduled'
END
WHERE status IS NULL;

-- Populate firefighter_name, shift, and station from firefighters table
UPDATE scheduled_holds sh
SET
    firefighter_name = f.name,
    shift = f.shift,
    fire_station = COALESCE(sh.fire_station, f.fire_station)
FROM firefighters f
WHERE sh.firefighter_id = f.id
  AND (sh.firefighter_name IS NULL OR sh.shift IS NULL);

-- ========================================
-- STEP 3: Add indexes for performance
-- ========================================

CREATE INDEX IF NOT EXISTS idx_scheduled_holds_hold_date
ON scheduled_holds(hold_date);

CREATE INDEX IF NOT EXISTS idx_scheduled_holds_status
ON scheduled_holds(status);

CREATE INDEX IF NOT EXISTS idx_scheduled_holds_shift
ON scheduled_holds(shift);

-- ========================================
-- STEP 4: Add missing columns to activity_log
-- ========================================

ALTER TABLE activity_log
ADD COLUMN IF NOT EXISTS firefighter_name TEXT;

ALTER TABLE activity_log
ADD COLUMN IF NOT EXISTS shift VARCHAR(1)
CHECK (shift IN ('A', 'B', 'C'));

ALTER TABLE activity_log
ADD COLUMN IF NOT EXISTS details TEXT;

-- ========================================
-- STEP 5: Migrate activity_log data
-- ========================================

-- Copy description to details
UPDATE activity_log
SET details = description
WHERE details IS NULL AND description IS NOT NULL;

-- Populate firefighter_name and shift
UPDATE activity_log al
SET
    firefighter_name = f.name,
    shift = f.shift
FROM firefighters f
WHERE al.firefighter_id = f.id
  AND (al.firefighter_name IS NULL OR al.shift IS NULL);

-- ========================================
-- STEP 6: Add indexes for activity_log
-- ========================================

CREATE INDEX IF NOT EXISTS idx_activity_log_shift
ON activity_log(shift);

CREATE INDEX IF NOT EXISTS idx_activity_log_firefighter_name
ON activity_log(firefighter_name);

-- ========================================
-- VERIFICATION QUERIES (Optional - run after migration)
-- ========================================

-- Uncomment these to verify the migration worked:

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

-- ========================================
-- MIGRATION COMPLETE!
-- ========================================
-- After running this:
-- 1. Refresh your browser at http://localhost:5173
-- 2. The errors should be gone
-- 3. All features should work perfectly
-- ========================================
