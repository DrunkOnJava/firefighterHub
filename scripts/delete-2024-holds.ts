import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tjljndzodowpohusrwhs.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqbGpuZHpvZG93cG9odXNyd2hzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTA5OTk5NiwiZXhwIjoyMDc2Njc1OTk2fQ.lkFvG_AkyvjPgyo-Bsx7aJXZZuCcwaznY6KCDBeumU4';

// Use service role to bypass RLS
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function delete2024Holds() {
  try {
    console.log('🔍 Finding all holds from 2024...');

    const { data: holds2024, error: fetchError } = await supabase
      .from('scheduled_holds')
      .select('id, firefighter_name, hold_date, fire_station, status')
      .lt('hold_date', '2025-01-01')
      .order('firefighter_name');

    if (fetchError) {
      console.error('Error fetching 2024 holds:', fetchError);
      return;
    }

    console.log(`\n📊 Found ${holds2024?.length || 0} holds from 2024:\n`);
    holds2024?.forEach(hold => {
      console.log(`  - ${hold.firefighter_name}: ${hold.hold_date} at Station ${hold.fire_station} (${hold.status})`);
    });

    if (!holds2024 || holds2024.length === 0) {
      console.log('\n✅ No 2024 holds found. Database is clean!');
      return;
    }

    console.log(`\n🗑️  Deleting ${holds2024.length} holds from 2024...`);

    const { data: deleted, error: deleteError } = await supabase
      .from('scheduled_holds')
      .delete()
      .lt('hold_date', '2025-01-01')
      .select('id, firefighter_name, hold_date');

    if (deleteError) {
      console.error('❌ Error deleting 2024 holds:', deleteError);
      return;
    }

    console.log(`\n✅ Successfully deleted ${deleted?.length || 0} holds from 2024!`);
    deleted?.forEach(hold => {
      console.log(`  ✓ Deleted: ${hold.firefighter_name} - ${hold.hold_date}`);
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

delete2024Holds();
