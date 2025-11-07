-- Check if RLS is enabled and if there are policies
SELECT tablename, 
       rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('firefighters', 'scheduled_holds');

-- Check replica identity (needed for real-time DELETE events)
SELECT schemaname, tablename, 
       CASE relreplident
           WHEN 'd' THEN 'default'
           WHEN 'n' THEN 'nothing'
           WHEN 'f' THEN 'full'
           WHEN 'i' THEN 'index'
       END as replica_identity
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' 
  AND c.relname IN ('firefighters', 'scheduled_holds');
