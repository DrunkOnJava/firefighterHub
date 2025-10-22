-- Sample Data for FirefighterHub
-- Run this in the Supabase SQL Editor to populate test data

-- Insert sample firefighters for each shift
INSERT INTO public.firefighters (name, order_position, shift, fire_station, certification_level, apparatus_ambulance, apparatus_engine, is_bls, is_active) VALUES
('John Smith', 1, 'A', 'Station 1', 'Paramedic', true, true, false, true),
('Jane Doe', 2, 'A', 'Station 1', 'EMT-A', true, false, true, true),
('Mike Johnson', 3, 'A', 'Station 2', 'EMT', false, true, true, true),
('Sarah Williams', 4, 'A', 'Station 2', 'Paramedic', true, true, false, true);

INSERT INTO public.firefighters (name, order_position, shift, fire_station, certification_level, apparatus_ambulance, apparatus_truck, is_als, is_active) VALUES
('Robert Brown', 1, 'B', 'Station 1', 'Paramedic', true, false, true, true),
('Emily Davis', 2, 'B', 'Station 1', 'EMT-I', true, false, false, true),
('David Miller', 3, 'B', 'Station 3', 'EMT-A', false, true, false, true),
('Lisa Garcia', 4, 'B', 'Station 3', 'Paramedic', true, false, true, true);

INSERT INTO public.firefighters (name, order_position, shift, fire_station, certification_level, apparatus_engine, apparatus_tanker, is_fto, is_active) VALUES
('James Wilson', 1, 'C', 'Station 2', 'Paramedic', true, false, true, true),
('Maria Rodriguez', 2, 'C', 'Station 2', 'EMT-A', false, false, false, true),
('Thomas Martinez', 3, 'C', 'Station 1', 'EMT', true, true, false, true),
('Jennifer Anderson', 4, 'C', 'Station 1', 'Paramedic', true, false, true, true);

-- Log the initial data creation
INSERT INTO public.activity_log (action_type, description, performed_by) VALUES
('system', 'Initial database seeded with sample firefighter data', 'Database Migration');

-- Output success message
DO $$
BEGIN
    RAISE NOTICE 'Successfully seeded database with % firefighters across % shifts',
        (SELECT COUNT(*) FROM public.firefighters),
        (SELECT COUNT(DISTINCT shift) FROM public.firefighters);
END $$;
