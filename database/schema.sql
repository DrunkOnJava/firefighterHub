-- FirefighterHub Database Schema
-- This schema works with both Supabase and standard PostgreSQL

-- Create firefighters table
CREATE TABLE IF NOT EXISTS firefighters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    order_position INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    shift VARCHAR(1) NOT NULL CHECK (shift IN ('A', 'B', 'C')),
    fire_station VARCHAR(255),
    last_hold_date TIMESTAMP WITH TIME ZONE,
    certification_level VARCHAR(50),

    -- Apparatus certifications
    apparatus_ambulance BOOLEAN DEFAULT false,
    apparatus_brush_truck BOOLEAN DEFAULT false,
    apparatus_engine BOOLEAN DEFAULT false,
    apparatus_tanker BOOLEAN DEFAULT false,
    apparatus_truck BOOLEAN DEFAULT false,
    apparatus_boat BOOLEAN DEFAULT false,
    apparatus_utv BOOLEAN DEFAULT false,
    apparatus_rescue_squad BOOLEAN DEFAULT false,

    -- Additional certifications
    is_fto BOOLEAN DEFAULT false,
    is_bls BOOLEAN DEFAULT false,
    is_als BOOLEAN DEFAULT false,

    -- 72-hour rule tracking
    hours_worked_this_period INTEGER NOT NULL DEFAULT 0,
    last_hours_reset_date TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on shift for faster queries
CREATE INDEX IF NOT EXISTS idx_firefighters_shift ON firefighters(shift);

-- Create index on fire_station for faster queries
CREATE INDEX IF NOT EXISTS idx_firefighters_station ON firefighters(fire_station);

-- Create index on is_active for faster queries
CREATE INDEX IF NOT EXISTS idx_firefighters_active ON firefighters(is_active);

-- Create hold_status enum for status field
CREATE TYPE hold_status AS ENUM ('scheduled', 'completed', 'skipped');

-- Create hold_duration enum for duration field
CREATE TYPE hold_duration AS ENUM ('12h', '24h');

-- Create scheduled_holds table for tracking hold schedules
CREATE TABLE IF NOT EXISTS scheduled_holds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firefighter_id UUID NOT NULL REFERENCES firefighters(id) ON DELETE CASCADE,
    firefighter_name VARCHAR(255) NOT NULL,  -- Denormalized for history/performance
    hold_date TIMESTAMP WITH TIME ZONE NOT NULL,  -- Renamed from scheduled_date
    status hold_status NOT NULL DEFAULT 'scheduled',  -- Replaced is_completed boolean
    shift VARCHAR(1) NOT NULL CHECK (shift IN ('A', 'B', 'C')),
    fire_station VARCHAR(255),  -- Where the hold is taking place
    lent_to_shift VARCHAR(1) CHECK (lent_to_shift IN ('A', 'B', 'C')),  -- Which shift is this FF being lent to
    notes TEXT,  -- For skipped holds or special instructions
    duration hold_duration NOT NULL DEFAULT '24h',  -- 12 hours or 24 hours
    start_time TIME NOT NULL DEFAULT '07:00:00',  -- Hold start time, defaults to 07:00
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes on scheduled_holds for faster queries
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_date ON scheduled_holds(hold_date);
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_firefighter ON scheduled_holds(firefighter_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_status ON scheduled_holds(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_shift ON scheduled_holds(shift);
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_station ON scheduled_holds(fire_station);
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_shift_date ON scheduled_holds(shift, hold_date);

-- Create activity_log table for tracking changes
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firefighter_id UUID REFERENCES firefighters(id) ON DELETE SET NULL,
    firefighter_name VARCHAR(255) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    details TEXT,
    shift VARCHAR(1) CHECK (shift IN ('A', 'B', 'C')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on activity_log for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_firefighter ON activity_log(firefighter_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_firefighters_updated_at
    BEFORE UPDATE ON firefighters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_holds_updated_at
    BEFORE UPDATE ON scheduled_holds
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (for Supabase)
-- Uncomment if using Supabase
-- ALTER TABLE firefighters ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE scheduled_holds ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Create policies (for Supabase)
-- Uncomment if using Supabase
-- CREATE POLICY "Enable read access for all users" ON firefighters FOR SELECT USING (true);
-- CREATE POLICY "Enable insert access for all users" ON firefighters FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Enable update access for all users" ON firefighters FOR UPDATE USING (true);
-- CREATE POLICY "Enable delete access for all users" ON firefighters FOR DELETE USING (true);

-- CREATE POLICY "Enable read access for all users" ON scheduled_holds FOR SELECT USING (true);
-- CREATE POLICY "Enable insert access for all users" ON scheduled_holds FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Enable update access for all users" ON scheduled_holds FOR UPDATE USING (true);
-- CREATE POLICY "Enable delete access for all users" ON scheduled_holds FOR DELETE USING (true);

-- CREATE POLICY "Enable read access for all users" ON activity_log FOR SELECT USING (true);
-- CREATE POLICY "Enable insert access for all users" ON activity_log FOR INSERT WITH CHECK (true);
