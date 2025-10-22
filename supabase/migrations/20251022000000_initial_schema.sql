-- FirefighterHub Initial Schema Migration
-- Created: 2025-10-22

-- Create firefighters table
CREATE TABLE IF NOT EXISTS public.firefighters (
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

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes on firefighters
CREATE INDEX IF NOT EXISTS idx_firefighters_shift ON public.firefighters(shift);
CREATE INDEX IF NOT EXISTS idx_firefighters_station ON public.firefighters(fire_station);
CREATE INDEX IF NOT EXISTS idx_firefighters_active ON public.firefighters(is_active);

-- Create scheduled_holds table
CREATE TABLE IF NOT EXISTS public.scheduled_holds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firefighter_id UUID NOT NULL REFERENCES public.firefighters(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Ensure one scheduled hold per firefighter per date
    UNIQUE(firefighter_id, scheduled_date)
);

-- Create indexes on scheduled_holds
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_date ON public.scheduled_holds(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_firefighter ON public.scheduled_holds(firefighter_id);

-- Create activity_log table
CREATE TABLE IF NOT EXISTS public.activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firefighter_id UUID REFERENCES public.firefighters(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    performed_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes on activity_log
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_firefighter ON public.activity_log(firefighter_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_firefighters_updated_at ON public.firefighters;
CREATE TRIGGER update_firefighters_updated_at
    BEFORE UPDATE ON public.firefighters
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_scheduled_holds_updated_at ON public.scheduled_holds;
CREATE TRIGGER update_scheduled_holds_updated_at
    BEFORE UPDATE ON public.scheduled_holds
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE public.firefighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Policies for firefighters table
CREATE POLICY "Enable read access for all users" ON public.firefighters FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.firefighters FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.firefighters FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.firefighters FOR DELETE USING (true);

-- Policies for scheduled_holds table
CREATE POLICY "Enable read access for all users" ON public.scheduled_holds FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.scheduled_holds FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.scheduled_holds FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.scheduled_holds FOR DELETE USING (true);

-- Policies for activity_log table
CREATE POLICY "Enable read access for all users" ON public.activity_log FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.activity_log FOR INSERT WITH CHECK (true);
