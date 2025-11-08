-- Check if firefighters table is in the publication
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;

-- If firefighters is missing, add it
-- ALTER PUBLICATION supabase_realtime ADD TABLE firefighters;

-- Check the publication configuration
SELECT * FROM pg_publication WHERE pubname = 'supabase_realtime';
