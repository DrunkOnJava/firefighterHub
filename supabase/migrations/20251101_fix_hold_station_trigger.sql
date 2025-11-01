-- Fix Trigger That Auto-Populates Hold Station
-- Date: 2025-11-01
-- Issue: The populate_scheduled_holds_metadata() trigger automatically fills
--        fire_station with the firefighter's assigned station when NULL.
--        This causes old holds to show incorrect station data.
-- Solution: Update trigger to NOT auto-populate fire_station.
--          Only populate firefighter_name and shift (which are correct to denormalize).

-- Drop and recreate the function with corrected logic
CREATE OR REPLACE FUNCTION populate_scheduled_holds_metadata()
RETURNS TRIGGER AS $$
BEGIN
    -- Get firefighter info and populate denormalized fields
    -- NOTE: We populate name and shift, but NOT fire_station
    -- fire_station should only be set explicitly when the hold is created/completed
    SELECT name, shift
    INTO NEW.firefighter_name, NEW.shift
    FROM firefighters
    WHERE id = NEW.firefighter_id;

    -- If hold_date wasn't set, use scheduled_date (backwards compatibility)
    IF NEW.hold_date IS NULL AND NEW.scheduled_date IS NOT NULL THEN
        NEW.hold_date := NEW.scheduled_date;
    END IF;

    -- If status wasn't set, default to 'scheduled'
    IF NEW.status IS NULL THEN
        NEW.status := 'scheduled';
    END IF;

    -- DO NOT auto-populate fire_station from firefighter's assigned station
    -- Leave it NULL if not explicitly provided
    -- This ensures we only show station data when we actually know where they were held

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers remain the same, just the function logic changed
-- (Triggers were already created in 20251022_fix_schema_mismatches.sql)

-- Update existing holds that have fire_station matching assigned station
-- These are likely auto-populated by the old trigger logic
UPDATE scheduled_holds sh
SET fire_station = NULL
FROM firefighters f
WHERE f.id = sh.firefighter_id
  AND sh.fire_station = f.fire_station
  AND sh.status IN ('scheduled', 'completed')
  -- Only clear if station wasn't explicitly recorded during completion
  -- Holds with explicit station data would have been set at completion time
  AND sh.completed_at IS NULL; -- Only clear scheduled (not yet completed) holds

COMMENT ON FUNCTION populate_scheduled_holds_metadata() IS 
  'Auto-populates firefighter_name and shift for scheduled holds. Does NOT auto-populate fire_station - that must be explicitly set when the hold is created or completed.';
