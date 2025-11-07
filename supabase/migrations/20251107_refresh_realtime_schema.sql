-- Drop and re-add tables to the publication to refresh schema cache
ALTER PUBLICATION supabase_realtime DROP TABLE scheduled_holds;
ALTER PUBLICATION supabase_realtime DROP TABLE firefighters;

ALTER PUBLICATION supabase_realtime ADD TABLE scheduled_holds;
ALTER PUBLICATION supabase_realtime ADD TABLE firefighters;
