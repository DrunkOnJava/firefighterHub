-- Fix Historical Hold Station Data
-- Date: 2025-11-01
-- Issue: Holds before 10/22/2025 are showing firefighter's assigned station
--        instead of the station where they were actually held.
-- Solution: NULL out fire_station for holds where we don't have explicit data,
--          only keep fire_station if it was explicitly recorded during hold completion.

-- For holds completed before the fire_station tracking was added (before 10/22/2025),
-- we should set fire_station to NULL since we don't actually know where they were held.
-- The migration that backfilled this data used COALESCE(sh.fire_station, f.fire_station)
-- which incorrectly showed the firefighter's assigned station as the hold station.

UPDATE scheduled_holds
SET fire_station = NULL
WHERE 
  -- Only update holds that were created before the schema fix
  created_at < '2025-10-22 00:00:00'
  -- And where the hold was completed (we're fixing completed holds)
  AND status = 'completed'
  -- And we don't have explicit hold station data
  -- (This is indicated by the fire_station matching the firefighter's current assigned station,
  --  which was backfilled by the migration)
  AND EXISTS (
    SELECT 1 FROM firefighters f
    WHERE f.id = scheduled_holds.firefighter_id
    AND scheduled_holds.fire_station = f.fire_station
  );

-- Add a comment to document this fix
COMMENT ON COLUMN scheduled_holds.fire_station IS 
  'Station where the firefighter was held. NULL indicates station data was not recorded for this hold (typically for holds before 2025-10-22).';
