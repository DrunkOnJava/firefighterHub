import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function restoreDatabase() {
  console.log('🔄 Reading database dump...');
  const dumpPath = 'database_dump_2025-10-28T23-28-56-081Z.json';
  const dumpFile = JSON.parse(fs.readFileSync(dumpPath, 'utf-8'));
  const dump = dumpFile.data;

  console.log(`📊 Found ${dump.firefighters.length} firefighters and ${dump.scheduled_holds.length} holds`);

  // Delete existing data
  console.log('🗑️  Clearing existing data...');
  const { error: deleteHoldsError } = await supabase
    .from('scheduled_holds')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  const { error: deleteFFError } = await supabase
    .from('firefighters')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (deleteHoldsError) console.warn('⚠️  Error deleting holds:', deleteHoldsError);
  if (deleteFFError) console.warn('⚠️  Error deleting firefighters:', deleteFFError);

  // Insert firefighters in batches
  console.log('👥 Inserting firefighters...');
  const batchSize = 50;
  for (let i = 0; i < dump.firefighters.length; i += batchSize) {
    const batch = dump.firefighters.slice(i, i + batchSize);
    const { error } = await supabase
      .from('firefighters')
      .insert(batch);

    if (error) {
      console.error(`❌ Error inserting firefighters batch ${i / batchSize + 1}:`, error);
      process.exit(1);
    }
    console.log(`   ✓ Inserted ${Math.min(i + batchSize, dump.firefighters.length)}/${dump.firefighters.length} firefighters`);
  }

  // Insert scheduled_holds in batches
  console.log('📅 Inserting scheduled holds...');
  for (let i = 0; i < dump.scheduled_holds.length; i += batchSize) {
    const batch = dump.scheduled_holds.slice(i, i + batchSize);
    const { error } = await supabase
      .from('scheduled_holds')
      .insert(batch);

    if (error) {
      console.error(`❌ Error inserting holds batch ${i / batchSize + 1}:`, error);
      process.exit(1);
    }
    console.log(`   ✓ Inserted ${Math.min(i + batchSize, dump.scheduled_holds.length)}/${dump.scheduled_holds.length} holds`);
  }

  // Verify
  console.log('\n📊 Verifying...');
  const { count: ffCount } = await supabase
    .from('firefighters')
    .select('*', { count: 'exact', head: true });

  const { count: holdsCount } = await supabase
    .from('scheduled_holds')
    .select('*', { count: 'exact', head: true });

  console.log(`\n✅ Database restored successfully!`);
  console.log(`   Firefighters: ${ffCount}`);
  console.log(`   Scheduled holds: ${holdsCount}`);
}

restoreDatabase().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
