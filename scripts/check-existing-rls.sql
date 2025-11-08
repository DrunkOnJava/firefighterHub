-- Check current RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('firefighters', 'scheduled_holds', 'activity_log')
ORDER BY tablename;

-- Check existing policies
SELECT schemaname, tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('firefighters', 'scheduled_holds', 'activity_log')
ORDER BY tablename, policyname;

-- Check if realtime.messages table exists and has policies
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'realtime' 
  AND tablename = 'messages';
