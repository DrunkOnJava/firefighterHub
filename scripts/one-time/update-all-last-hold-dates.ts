import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAllLastHoldDates() {
  console.log('Updating last_hold_date for all firefighters...\n');

  // Get all firefighters
  const { data: allFirefighters } = await supabase
    .from('firefighters')
    .select('id, name, shift');

  if (!allFirefighters) {
    console.log('No firefighters found');
    return;
  }

  console.log(`Processing ${allFirefighters.length} firefighters...\n`);

  let updated = 0;
  let noHolds = 0;

  for (const ff of allFirefighters) {
    // Get most recent completed hold for this firefighter
    const { data: latestHold } = await supabase
      .from('scheduled_holds')
      .select('hold_date')
      .eq('firefighter_id', ff.id)
      .eq('status', 'completed')
      .order('hold_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestHold) {
      // Update firefighter's last_hold_date
      const { error } = await supabase
        .from('firefighters')
        .update({ last_hold_date: latestHold.hold_date })
        .eq('id', ff.id);

      if (!error) {
        console.log(`✓ ${ff.name} (${ff.shift}): ${latestHold.hold_date}`);
        updated++;
      }
    } else {
      noHolds++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`SUMMARY:`);
  console.log(`  Total firefighters: ${allFirefighters.length}`);
  console.log(`  Updated with last hold date: ${updated}`);
  console.log(`  No holds found: ${noHolds}`);
  console.log('='.repeat(60));
  console.log('\n✓ All last_hold_date fields updated!');
  console.log('Refresh the app to see updated dates in the roster.');
}

updateAllLastHoldDates().catch(console.error);
