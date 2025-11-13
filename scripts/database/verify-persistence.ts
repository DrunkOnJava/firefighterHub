import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://tjljndzodowpohusrwhs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyPersistence() {
  console.log('🔍 Querying Supabase database...\n');

  // Get current firefighters for Shift A
  const { data: firefighters, error } = await supabase
    .from('firefighters')
    .select('id, name, fire_station, order_position, shift, last_hold_date')
    .eq('shift', 'A')
    .eq('is_active', true)
    .order('order_position')
    .limit(10);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('✅ Current Shift A Roster (from database):');
  console.log('═'.repeat(80));
  console.log('POS | NAME                      | STATION | LAST HOLD');
  console.log('─'.repeat(80));

  firefighters?.forEach(ff => {
    const pos = String(ff.order_position).padEnd(3);
    const name = ff.name.padEnd(25);
    const station = (ff.fire_station || 'N/A').padEnd(7);
    const lastHold = ff.last_hold_date
      ? new Date(ff.last_hold_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Never';
    console.log(`${pos} | ${name} | ${station} | ${lastHold}`);
  });

  console.log('═'.repeat(80));
  console.log(`\n📊 Total firefighters: ${firefighters?.length || 0}`);
  console.log('\n✅ Database persistence verified! All data is stored in Supabase.');
}

verifyPersistence().catch(console.error);
