-- ========================================
-- INSERT COMPLETED HOLD DATA
-- A-Shift and C-Shift historical holds
-- ========================================

-- Insert A-Shift holds
INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT 
    f.id,
    f.name,
    DATE '2025-09-25' as hold_date,
    'completed' as status,
    'A' as shift,
    '1' as fire_station,
    TIMESTAMP '2025-09-25 23:59:59' as completed_at
FROM firefighters f
WHERE f.name = 'Hernandez' AND f.shift = 'A'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-09-27', 'completed', 'A', '6', TIMESTAMP '2025-09-27 23:59:59'
FROM firefighters f WHERE f.name = 'Catlett' AND f.shift = 'A'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-09-27', 'completed', 'A', '6', TIMESTAMP '2025-09-27 23:59:59'
FROM firefighters f WHERE f.name = 'Baldwin' AND f.shift = 'A'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-09-29', 'completed', 'A', '10', TIMESTAMP '2025-09-29 23:59:59'
FROM firefighters f WHERE f.name = 'Richardson' AND f.shift = 'A'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-04', 'completed', 'A', '2', TIMESTAMP '2025-10-04 23:59:59'
FROM firefighters f WHERE f.name = 'McCauley' AND f.shift = 'A'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-04', 'completed', 'A', '2', TIMESTAMP '2025-10-04 23:59:59'
FROM firefighters f WHERE f.name = 'Bryson' AND f.shift = 'A'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-06', 'completed', 'A', '10', TIMESTAMP '2025-10-06 23:59:59'
FROM firefighters f WHERE f.name = 'Feldhauser' AND f.shift = 'A'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-06', 'completed', 'A', '10', TIMESTAMP '2025-10-06 23:59:59'
FROM firefighters f WHERE f.name = 'Kennedy' AND f.shift = 'A'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-08', 'completed', 'A', '5', TIMESTAMP '2025-10-08 23:59:59'
FROM firefighters f WHERE f.name = 'Myers' AND f.shift = 'A'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-08', 'completed', 'A', '8', TIMESTAMP '2025-10-08 23:59:59'
FROM firefighters f WHERE f.name = 'Oliver' AND f.shift = 'A'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-11', 'completed', 'A', '8', TIMESTAMP '2025-10-11 23:59:59'
FROM firefighters f WHERE f.name = 'Levdahl' AND f.shift = 'A'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-15', 'completed', 'A', '3', TIMESTAMP '2025-10-15 23:59:59'
FROM firefighters f WHERE f.name = 'Biby' AND f.shift = 'A'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-15', 'completed', 'A', '5', TIMESTAMP '2025-10-15 23:59:59'
FROM firefighters f WHERE f.name = 'Pangle' AND f.shift = 'A'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-15', 'completed', 'A', '5', TIMESTAMP '2025-10-15 23:59:59'
FROM firefighters f WHERE f.name = 'Hammack' AND f.shift = 'A'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-15', 'completed', 'A', '3', TIMESTAMP '2025-10-15 23:59:59'
FROM firefighters f WHERE f.name = 'Fisher' AND f.shift = 'A'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-09-14', 'completed', 'A', '1', TIMESTAMP '2025-09-14 23:59:59'
FROM firefighters f WHERE f.name = 'Cucciardo' AND f.shift = 'A'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

-- Insert C-Shift holds
INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-09-06', 'completed', 'C', '1', TIMESTAMP '2025-09-06 23:59:59'
FROM firefighters f WHERE f.name = 'Lewis' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-09-08', 'completed', 'C', '10', TIMESTAMP '2025-09-08 23:59:59'
FROM firefighters f WHERE f.name = 'Wilocks' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-09-13', 'completed', 'C', '3', TIMESTAMP '2025-09-13 23:59:59'
FROM firefighters f WHERE f.name = 'Orebaugh' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-09-13', 'completed', 'C', '3', TIMESTAMP '2025-09-13 23:59:59'
FROM firefighters f WHERE f.name = 'Maiatico' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-09-15', 'completed', 'C', '4', TIMESTAMP '2025-09-15 23:59:59'
FROM firefighters f WHERE f.name = 'Gottholm' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-09-26', 'completed', 'C', '6', TIMESTAMP '2025-09-26 23:59:59'
FROM firefighters f WHERE f.name = 'Gray' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-01', 'completed', 'C', '8', TIMESTAMP '2025-10-01 23:59:59'
FROM firefighters f WHERE f.name = 'Settle' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-01', 'completed', 'C', '8', TIMESTAMP '2025-10-01 23:59:59'
FROM firefighters f WHERE f.name = 'Birks' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-03', 'completed', 'C', '1', TIMESTAMP '2025-10-03 23:59:59'
FROM firefighters f WHERE f.name = 'Khan' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-05', 'completed', 'C', '6', TIMESTAMP '2025-10-05 23:59:59'
FROM firefighters f WHERE f.name = 'Udy' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-08', 'completed', 'C', '5', TIMESTAMP '2025-10-08 23:59:59'
FROM firefighters f WHERE f.name = 'Jock' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-09', 'completed', 'C', '8', TIMESTAMP '2025-10-09 23:59:59'
FROM firefighters f WHERE f.name = 'Tipeni' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-10', 'completed', 'C', '6', TIMESTAMP '2025-10-10 23:59:59'
FROM firefighters f WHERE f.name = 'Smith' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-10', 'completed', 'C', '6', TIMESTAMP '2025-10-10 23:59:59'
FROM firefighters f WHERE f.name = 'Stewart' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-10', 'completed', 'C', '5', TIMESTAMP '2025-10-10 23:59:59'
FROM firefighters f WHERE f.name = 'Whitfield' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-12', 'completed', 'C', '5', TIMESTAMP '2025-10-12 23:59:59'
FROM firefighters f WHERE f.name = 'Walker' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-12', 'completed', 'C', '4', TIMESTAMP '2025-10-12 23:59:59'
FROM firefighters f WHERE f.name = 'Wilbanks' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

INSERT INTO scheduled_holds (firefighter_id, firefighter_name, hold_date, status, shift, fire_station, completed_at)
SELECT f.id, f.name, DATE '2025-10-19', 'completed', 'C', '4', TIMESTAMP '2025-10-19 23:59:59'
FROM firefighters f WHERE f.name = 'Bailey' AND f.shift = 'C'
ON CONFLICT (firefighter_id, hold_date) DO NOTHING;

-- Update last_hold_date for all firefighters who completed holds
UPDATE firefighters f
SET last_hold_date = (
    SELECT MAX(hold_date)
    FROM scheduled_holds sh
    WHERE sh.firefighter_id = f.id
    AND sh.status = 'completed'
)
WHERE EXISTS (
    SELECT 1 FROM scheduled_holds sh
    WHERE sh.firefighter_id = f.id
    AND sh.status = 'completed'
);

-- Verification
SELECT 
    COUNT(*) as total_inserted,
    COUNT(CASE WHEN shift = 'A' THEN 1 END) as a_shift_holds,
    COUNT(CASE WHEN shift = 'C' THEN 1 END) as c_shift_holds
FROM scheduled_holds
WHERE status = 'completed';
