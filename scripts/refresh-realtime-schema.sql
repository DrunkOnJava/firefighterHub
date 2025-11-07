-- Force Supabase to refresh real-time schema bindings
-- This fixes "mismatch between server and client bindings" errors

-- Drop and recreate the publication to refresh schema
ALTER PUBLICATION supabase_realtime DROP TABLE scheduled_holds;
ALTER PUBLICATION supabase_realtime ADD TABLE scheduled_holds;

-- Notify that schema has been refreshed
SELECT 'Real-time schema refreshed for scheduled_holds' as status;
