-- Add is_voluntary column to scheduled_holds table
-- Tracks whether a hold was voluntarily picked up by the firefighter
-- Voluntary holds move the firefighter to bottom of rotation

ALTER TABLE scheduled_holds 
ADD COLUMN IF NOT EXISTS is_voluntary BOOLEAN DEFAULT FALSE;

-- Add index for querying voluntary holds
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_is_voluntary 
ON scheduled_holds(is_voluntary) 
WHERE is_voluntary = TRUE;

-- Add comment for documentation
COMMENT ON COLUMN scheduled_holds.is_voluntary IS 'Indicates if this hold was voluntarily picked up. Voluntary holds move the firefighter to the bottom of the rotation.';
