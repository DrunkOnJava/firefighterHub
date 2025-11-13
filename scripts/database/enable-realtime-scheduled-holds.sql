-- Check what tables are currently in the real-time publication
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Add scheduled_holds to the real-time publication
ALTER PUBLICATION supabase_realtime ADD TABLE scheduled_holds;

-- Verify it was added
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;
