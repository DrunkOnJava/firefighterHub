-- ========================================
-- COMPLETE DATABASE SETUP FOR FIREFIGHTERHUB
-- This creates/updates tables with ALL required columns
-- ========================================

-- ========================================
-- TABLE 1: scheduled_holds
-- Purpose: Track hold schedules and assignments
-- ========================================

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS scheduled_holds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firefighter_id UUID NOT NULL REFERENCES firefighters(id) ON DELETE CASCADE,
    firefighter_name TEXT NOT NULL,
    hold_date DATE NOT NULL,
    scheduled_date DATE,  -- Legacy column (kept for backwards compatibility)
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'skipped')),
    is_completed BOOLEAN DEFAULT false,  -- Legacy column (kept for backwards compatibility)
    shift VARCHAR(1) NOT NULL CHECK (shift IN ('A', 'B', 'C')),
    fire_station VARCHAR(255),
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(firefighter_id, hold_date)
);

-- Add missing columns if they don't exist
ALTER TABLE scheduled_holds ADD COLUMN IF NOT EXISTS firefighter_name TEXT;
ALTER TABLE scheduled_holds ADD COLUMN IF NOT EXISTS hold_date DATE;
ALTER TABLE scheduled_holds ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('scheduled', 'completed', 'skipped'));
ALTER TABLE scheduled_holds ADD COLUMN IF NOT EXISTS shift VARCHAR(1) CHECK (shift IN ('A', 'B', 'C'));
ALTER TABLE scheduled_holds ADD COLUMN IF NOT EXISTS fire_station VARCHAR(255);
ALTER TABLE scheduled_holds ADD COLUMN IF NOT EXISTS notes TEXT;

-- Migrate existing data
UPDATE scheduled_holds
SET hold_date = scheduled_date
WHERE hold_date IS NULL AND scheduled_date IS NOT NULL;

UPDATE scheduled_holds
SET status = CASE
    WHEN is_completed = true THEN 'completed'
    ELSE 'scheduled'
END
WHERE status IS NULL;

UPDATE scheduled_holds sh
SET
    firefighter_name = f.name,
    shift = f.shift,
    fire_station = COALESCE(sh.fire_station, f.fire_station)
FROM firefighters f
WHERE sh.firefighter_id = f.id
  AND (sh.firefighter_name IS NULL OR sh.shift IS NULL);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_hold_date ON scheduled_holds(hold_date);
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_status ON scheduled_holds(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_shift ON scheduled_holds(shift);
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_firefighter ON scheduled_holds(firefighter_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_station ON scheduled_holds(fire_station);

-- ========================================
-- TABLE 2: activity_log
-- Purpose: Audit trail of all system actions
-- ========================================

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firefighter_id UUID REFERENCES firefighters(id) ON DELETE SET NULL,
    firefighter_name TEXT,
    shift VARCHAR(1) CHECK (shift IN ('A', 'B', 'C')),
    action_type VARCHAR(50) NOT NULL,
    details TEXT,
    description TEXT,  -- Legacy column (kept for backwards compatibility)
    performed_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add missing columns if they don't exist
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS firefighter_name TEXT;
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS shift VARCHAR(1) CHECK (shift IN ('A', 'B', 'C'));
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS details TEXT;

-- Migrate existing data
UPDATE activity_log
SET details = description
WHERE details IS NULL AND description IS NOT NULL;

UPDATE activity_log al
SET
    firefighter_name = f.name,
    shift = f.shift
FROM firefighters f
WHERE al.firefighter_id = f.id
  AND (al.firefighter_name IS NULL OR al.shift IS NULL);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_firefighter ON activity_log(firefighter_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_shift ON activity_log(shift);
CREATE INDEX IF NOT EXISTS idx_activity_log_firefighter_name ON activity_log(firefighter_name);
CREATE INDEX IF NOT EXISTS idx_activity_log_action_type ON activity_log(action_type);

-- ========================================
-- TRIGGERS: Auto-populate fields on insert/update
-- ========================================

-- Function to auto-populate scheduled_holds metadata
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

    -- If scheduled_date wasn't set, copy from hold_date
    IF NEW.scheduled_date IS NULL AND NEW.hold_date IS NOT NULL THEN
        NEW.scheduled_date := NEW.hold_date;
    END IF;

    -- If status wasn't set, default to 'scheduled'
    IF NEW.status IS NULL THEN
        NEW.status := 'scheduled';
    END IF;

    -- Sync is_completed with status
    NEW.is_completed := (NEW.status = 'completed');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS populate_scheduled_holds_metadata_on_insert ON scheduled_holds;
DROP TRIGGER IF EXISTS populate_scheduled_holds_metadata_on_update ON scheduled_holds;

-- Create triggers
CREATE TRIGGER populate_scheduled_holds_metadata_on_insert
    BEFORE INSERT ON scheduled_holds
    FOR EACH ROW
    EXECUTE FUNCTION populate_scheduled_holds_metadata();

CREATE TRIGGER populate_scheduled_holds_metadata_on_update
    BEFORE UPDATE ON scheduled_holds
    FOR EACH ROW
    WHEN (OLD.firefighter_id IS DISTINCT FROM NEW.firefighter_id)
    EXECUTE FUNCTION populate_scheduled_holds_metadata();

-- Function to auto-populate activity_log metadata
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS populate_activity_log_metadata_on_insert ON activity_log;

-- Create trigger
CREATE TRIGGER populate_activity_log_metadata_on_insert
    BEFORE INSERT ON activity_log
    FOR EACH ROW
    EXECUTE FUNCTION populate_activity_log_metadata();

-- ========================================
-- VERIFICATION
-- ========================================

-- Check scheduled_holds
DO $$
DECLARE
    rec RECORD;
BEGIN
    SELECT 
        COUNT(*) as total_holds,
        COUNT(hold_date) as with_hold_date,
        COUNT(status) as with_status,
        COUNT(firefighter_name) as with_name,
        COUNT(shift) as with_shift
    INTO rec
    FROM scheduled_holds;
    
    RAISE NOTICE 'scheduled_holds: % total, % with hold_date, % with status, % with name, % with shift', 
        rec.total_holds, rec.with_hold_date, rec.with_status, rec.with_name, rec.with_shift;
END $$;

-- Check activity_log
DO $$
DECLARE
    rec RECORD;
BEGIN
    SELECT 
        COUNT(*) as total_activities,
        COUNT(firefighter_name) as with_name,
        COUNT(shift) as with_shift,
        COUNT(details) as with_details
    INTO rec
    FROM activity_log;
    
    RAISE NOTICE 'activity_log: % total, % with name, % with shift, % with details', 
        rec.total_activities, rec.with_name, rec.with_shift, rec.with_details;
END $$;

-- ========================================
-- COMPLETE\!
-- ========================================
