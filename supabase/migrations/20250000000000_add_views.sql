-- Migration: Add database views for common queries
-- Purpose: Move repeated filtering/sorting logic from client to database
-- Benefits: Consistent logic, less client code, better performance

-- View for available firefighters in rotation (most commonly queried)
CREATE OR REPLACE VIEW available_rotation AS
SELECT *
FROM firefighters
WHERE is_active = true AND is_available = true
ORDER BY order_position ASC;

-- View for active firefighters (including unavailable ones)
CREATE OR REPLACE VIEW active_firefighters AS
SELECT *
FROM firefighters
WHERE is_active = true
ORDER BY order_position ASC;

-- View for deactivated firefighters
CREATE OR REPLACE VIEW deactivated_firefighters AS
SELECT *
FROM firefighters
WHERE is_active = false
ORDER BY name ASC;

-- View for recent activity (last 30 days)
CREATE OR REPLACE VIEW recent_activity AS
SELECT *
FROM activity_log
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- View for upcoming scheduled holds (next 90 days)
CREATE OR REPLACE VIEW upcoming_holds AS
SELECT *
FROM scheduled_holds
WHERE hold_date >= CURRENT_DATE
  AND hold_date <= CURRENT_DATE + INTERVAL '90 days'
  AND status = 'scheduled'
ORDER BY hold_date ASC, start_time ASC;

-- View for completed holds (last 90 days)
CREATE OR REPLACE VIEW recent_completed_holds AS
SELECT *
FROM scheduled_holds
WHERE status = 'completed'
  AND completed_at >= NOW() - INTERVAL '90 days'
ORDER BY completed_at DESC;

-- Grant permissions to authenticated users
GRANT SELECT ON available_rotation TO authenticated, anon;
GRANT SELECT ON active_firefighters TO authenticated, anon;
GRANT SELECT ON deactivated_firefighters TO authenticated, anon;
GRANT SELECT ON recent_activity TO authenticated, anon;
GRANT SELECT ON upcoming_holds TO authenticated, anon;
GRANT SELECT ON recent_completed_holds TO authenticated, anon;

-- Add comments for documentation
COMMENT ON VIEW available_rotation IS 'Firefighters who are active and available, ordered by rotation position';
COMMENT ON VIEW active_firefighters IS 'All active firefighters (including unavailable), ordered by rotation position';
COMMENT ON VIEW deactivated_firefighters IS 'Deactivated firefighters, ordered by name';
COMMENT ON VIEW recent_activity IS 'Activity log entries from the last 30 days';
COMMENT ON VIEW upcoming_holds IS 'Scheduled holds for the next 90 days';
COMMENT ON VIEW recent_completed_holds IS 'Completed holds from the last 90 days';
