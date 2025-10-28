-- Add lent_to_shift field to scheduled_holds
-- This tracks which shift (A, B, or C) a firefighter is being lent to when on hold
-- Created: 2025-10-28

-- Add lent_to_shift column (which shift the firefighter is being lent to)
ALTER TABLE scheduled_holds
ADD COLUMN IF NOT EXISTS lent_to_shift VARCHAR(1) CHECK (lent_to_shift IN ('A', 'B', 'C'));

-- Create index for performance when querying by lent_to_shift
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_lent_to_shift ON scheduled_holds(lent_to_shift);

-- Add comment explaining the column
COMMENT ON COLUMN scheduled_holds.lent_to_shift IS 'Which shift (A, B, or C) this firefighter is being lent to during their hold. NULL means not lent to another shift.';
