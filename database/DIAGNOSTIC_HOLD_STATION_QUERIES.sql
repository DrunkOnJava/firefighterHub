-- Diagnostic Queries for Hold Station Issue
-- Run these in Supabase SQL Editor to investigate the data

-- 1. Check if there are ANY holds before 10/22/2025
SELECT 
  COUNT(*) as total_old_holds,
  COUNT(CASE WHEN fire_station IS NOT NULL THEN 1 END) as holds_with_station,
  COUNT(CASE WHEN fire_station IS NULL THEN 1 END) as holds_without_station
FROM scheduled_holds
WHERE created_at < '2025-10-22 00:00:00';

-- 2. Check all holds with their station data and creation dates
SELECT 
  firefighter_name,
  hold_date,
  fire_station as hold_station,
  status,
  created_at,
  completed_at
FROM scheduled_holds
ORDER BY created_at ASC
LIMIT 20;

-- 3. Check if firefighters' assigned stations match their hold stations
SELECT 
  sh.firefighter_name,
  sh.hold_date,
  sh.fire_station as hold_station,
  f.fire_station as assigned_station,
  sh.created_at,
  CASE 
    WHEN sh.fire_station = f.fire_station THEN '⚠️ MATCH (potentially backfilled)'
    WHEN sh.fire_station IS NULL THEN '✓ NULL (no data)'
    ELSE '✓ DIFFERENT (explicit data)'
  END as data_quality
FROM scheduled_holds sh
JOIN firefighters f ON f.id = sh.firefighter_id
WHERE sh.created_at < '2025-10-22 00:00:00'
ORDER BY sh.created_at ASC;

-- 4. Check the date range of all holds in the system
SELECT 
  MIN(created_at) as earliest_hold,
  MAX(created_at) as latest_hold,
  MIN(hold_date) as earliest_hold_date,
  MAX(hold_date) as latest_hold_date,
  COUNT(*) as total_holds
FROM scheduled_holds;

-- 5. Check if there are holds where station matches assigned station
-- (These are the ones that might be showing wrong data)
SELECT 
  sh.firefighter_name,
  sh.hold_date,
  sh.fire_station as shown_station,
  f.fire_station as member_assigned_station,
  sh.created_at,
  sh.status
FROM scheduled_holds sh
JOIN firefighters f ON f.id = sh.firefighter_id
WHERE sh.fire_station = f.fire_station
  AND sh.fire_station IS NOT NULL
ORDER BY sh.hold_date DESC
LIMIT 10;
