-- Add duration and start_time fields to scheduled_holds
-- These fields are used by the application but were never added to the database schema
-- Created: 2025-11-02

-- Add duration column (12h or 24h hold duration)
ALTER TABLE scheduled_holds
ADD COLUMN IF NOT EXISTS duration VARCHAR(3) DEFAULT '24h' CHECK (duration IN ('12h', '24h'));

-- Add start_time column (time when hold starts, in HH:MM:SS format)
ALTER TABLE scheduled_holds
ADD COLUMN IF NOT EXISTS start_time TIME DEFAULT '07:00:00';

-- Update existing rows to have default values
UPDATE scheduled_holds
SET duration = '24h'
WHERE duration IS NULL;

UPDATE scheduled_holds
SET start_time = '07:00:00'
WHERE start_time IS NULL;

-- Make columns NOT NULL after backfilling data
ALTER TABLE scheduled_holds
ALTER COLUMN duration SET NOT NULL;

ALTER TABLE scheduled_holds
ALTER COLUMN start_time SET NOT NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_duration ON scheduled_holds(duration);
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_start_time ON scheduled_holds(start_time);

-- Add comments explaining the columns
COMMENT ON COLUMN scheduled_holds.duration IS 'Duration of hold: 12h (half shift) or 24h (full shift). Defaults to 24h.';
COMMENT ON COLUMN scheduled_holds.start_time IS 'Time when the hold starts (e.g., 07:00:00 for day shift, 19:00:00 for night shift). Defaults to 07:00:00.';

