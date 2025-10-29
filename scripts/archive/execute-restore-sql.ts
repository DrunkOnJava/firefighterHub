import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSQL() {
  console.log('📂 Reading SQL file...');
  const sql = fs.readFileSync('scripts/restore-data.sql', 'utf-8');

  console.log('🗑️  Cleaning existing data...');
  const { error: deleteError } = await supabase.rpc('execute_sql', {
    query: 'DELETE FROM scheduled_holds; DELETE FROM firefighters;'
  }).single();

  console.log('🚀 Executing restore SQL...');
  const { data, error } = await supabase.rpc('execute_sql', {
    query: sql
  }).single();

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  console.log('✅ Database restored successfully!');

  // Verify
  const { data: firefighters } = await supabase.from('firefighters').select('count');
  const { data: holds } = await supabase.from('scheduled_holds').select('count');

  console.log(`\n📊 Final counts:`);
  console.log(`   Firefighters: ${firefighters?.length || 0}`);
  console.log(`   Scheduled holds: ${holds?.length || 0}`);
}

executeSQL().catch(console.error);
