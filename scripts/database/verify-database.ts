import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log('🔍 Verifying database state...\n');

  // Count records
  const { count: ffCount } = await supabase
    .from('firefighters')
    .select('*', { count: 'exact', head: true });

  const { count: holdsCount } = await supabase
    .from('scheduled_holds')
    .select('*', { count: 'exact', head: true });

  console.log('📊 Record counts:');
  console.log(`   Firefighters: ${ffCount}`);
  console.log(`   Scheduled holds: ${holdsCount}\n`);

  // Check schema has new columns
  const { data: sampleFF } = await supabase
    .from('firefighters')
    .select('*')
    .limit(1)
    .single();

  console.log('✅ Firefighter schema includes:');
  console.log(`   hours_worked_this_period: ${sampleFF?.hours_worked_this_period !== undefined ? 'YES' : 'NO'}`);
  console.log(`   last_hours_reset_date: ${sampleFF?.last_hours_reset_date !== undefined ? 'YES' : 'NO'}\n`);

  // Check holds have new columns
  const { data: sampleHold } = await supabase
    .from('scheduled_holds')
    .select('*')
    .limit(1)
    .single();

  if (sampleHold) {
    console.log('✅ Scheduled hold schema includes:');
    console.log(`   duration: ${sampleHold?.duration !== undefined ? 'YES' : 'NO'}`);
    console.log(`   start_time: ${sampleHold?.start_time !== undefined ? 'YES' : 'NO'}`);
    console.log(`   status: ${sampleHold?.status !== undefined ? 'YES' : 'NO'}`);
    console.log(`   firefighter_name: ${sampleHold?.firefighter_name !== undefined ? 'YES' : 'NO'}\n`);
  }

  // Check shift distribution
  const { data: shifts } = await supabase
    .from('firefighters')
    .select('shift');

  const shiftCounts = shifts?.reduce((acc: any, ff: any) => {
    acc[ff.shift] = (acc[ff.shift] || 0) + 1;
    return acc;
  }, {});

  console.log('📋 Shift distribution:');
  console.log(`   Shift A: ${shiftCounts?.A || 0}`);
  console.log(`   Shift B: ${shiftCounts?.B || 0}`);
  console.log(`   Shift C: ${shiftCounts?.C || 0}\n`);

  console.log('✅ Database verification complete!');
}

verify().catch(console.error);
