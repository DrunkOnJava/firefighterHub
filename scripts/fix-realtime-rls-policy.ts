import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://tjljndzodowpohusrwhs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqbGpuZHpvZG93cG9odXNyd2hzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTA5OTk5NiwiZXhwIjoyMDc2Njc1OTk2fQ.lkFvG_AkyvjPgyo-Bsx7aJXZZuCcwaznY6KCDBeumU4',
  { db: { schema: 'realtime' } }
);

async function fixRLS() {
  console.log('🔧 Fixing RLS policy for realtime.messages via API...\n');

  try {
    // Execute SQL directly - Supabase service role can run DDL
    const { data, error } = await (supabase as any).rpc('exec_sql', {
      query: `
        DROP POLICY IF EXISTS "users_can_receive_firefighter_broadcasts" ON realtime.messages;
        
        CREATE POLICY "allow_realtime_broadcasts"
          ON realtime.messages
          FOR SELECT
          TO authenticated, anon
          USING (topic ~ '^(firefighters|scheduled_holds):[ABC]$');
      `
    });

    if (error) {
      console.error('❌ RPC Error:', error);
      console.log('\n⚠️  Direct SQL execution not available via API.');
      console.log('📋 Please run this SQL manually in Supabase SQL Editor:\n');
      console.log(`DROP POLICY IF EXISTS "users_can_receive_firefighter_broadcasts" ON realtime.messages;`);
      console.log(`CREATE POLICY "allow_realtime_broadcasts" ON realtime.messages FOR SELECT TO authenticated, anon USING (topic ~ '^(firefighters|scheduled_holds):[ABC]$');`);
      return;
    }

    console.log('✅ Policy updated successfully!', data);
  } catch (err: any) {
    console.error('❌ Error:', err.message);
    console.log('\n📋 Please run this SQL manually in Supabase SQL Editor:\n');
    console.log(`DROP POLICY IF EXISTS "users_can_receive_firefighter_broadcasts" ON realtime.messages;`);
    console.log(`CREATE POLICY "allow_realtime_broadcasts" ON realtime.messages FOR SELECT TO authenticated, anon USING (topic ~ '^(firefighters|scheduled_holds):[ABC]$');`);
  }
}

fixRLS();
