import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface HoldData {
  name: string;
  date: string;
  station: string | null;
  shift: 'B';
}

const bShiftHolds: HoldData[] = [
  // NOTE: Geurkink 11/ - Incomplete date, skipping
  { name: 'Cox', date: '2025-07-18', station: '8', shift: 'B' },
  { name: 'Ramey', date: '2025-07-18', station: null, shift: 'B' }, // No station provided
  { name: 'Cole', date: '2025-07-22', station: '3', shift: 'B' },
  { name: 'Garrett', date: '2025-07-28', station: null, shift: 'B' }, // No station provided
  { name: 'Volz', date: '2025-08-18', station: '6', shift: 'B' },
  { name: 'Miller', date: '2025-08-23', station: '4', shift: 'B' },
  { name: 'Kresge', date: '2025-08-30', station: '4', shift: 'B' },
  { name: 'Gallivan', date: '2025-08-30', station: '5', shift: 'B' },
  { name: 'Whitacre', date: '2025-09-12', station: '1', shift: 'B' },
  { name: 'Unger', date: '2025-09-30', station: '2', shift: 'B' },
  { name: 'Baker', date: '2025-10-02', station: '1', shift: 'B' },
  { name: 'Lewis', date: '2025-10-07', station: '10', shift: 'B' },
  { name: 'Foster', date: '2025-10-07', station: '10', shift: 'B' },
  { name: 'Malone', date: '2025-10-09', station: '2', shift: 'B' },
  { name: 'Mawyer', date: '2025-10-14', station: '2', shift: 'B' },
  { name: 'Good', date: '2025-10-18', station: '6', shift: 'B' },
  { name: 'Rollins', date: '2025-10-18', station: '6', shift: 'B' },
];

async function insertBShiftHolds() {
  console.log('Starting B-Shift hold data insertion...\n');
  console.log('NOTE: Skipped Geurkink (incomplete date: 11/)\n');

  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];
  const missingFirefighters: string[] = [];

  for (const hold of bShiftHolds) {
    try {
      // Find the firefighter by last name and shift
      const { data: firefighter, error: ffError } = await supabase
        .from('firefighters')
        .select('id, name, shift, fire_station')
        .ilike('name', `%${hold.name}%`)
        .eq('shift', 'B')
        .maybeSingle();

      if (ffError) {
        errors.push(`Error finding ${hold.name} (B): ${ffError.message}`);
        continue;
      }

      if (!firefighter) {
        missingFirefighters.push(hold.name);
        errors.push(`Firefighter not found: ${hold.name} (Shift B)`);
        continue;
      }

      // Use hold station if provided, otherwise use firefighter's default station
      const stationToUse = hold.station || firefighter.fire_station;

      // Insert the hold record
      const { error: insertError } = await supabase
        .from('scheduled_holds')
        .insert({
          firefighter_id: firefighter.id,
          firefighter_name: firefighter.name,
          hold_date: hold.date,
          status: 'completed',
          shift: 'B',
          fire_station: stationToUse,
          completed_at: new Date(hold.date + 'T23:59:59Z').toISOString(),
        });

      if (insertError) {
        if (insertError.code === '23505') {
          skipped++;
          console.log(`⊘ Skipped ${hold.name} (${hold.date}) - already exists`);
        } else {
          errors.push(`Error inserting ${hold.name} (${hold.date}): ${insertError.message}`);
        }
      } else {
        inserted++;
        const stationInfo = stationToUse ? ` at Station ${stationToUse}` : ' (no station)';
        console.log(`✓ Inserted ${firefighter.name} (${hold.date})${stationInfo}`);
      }
    } catch (err) {
      errors.push(`Unexpected error for ${hold.name}: ${err}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`B-SHIFT SUMMARY:`);
  console.log(`  Total holds processed: ${bShiftHolds.length}`);
  console.log(`  Successfully inserted: ${inserted}`);
  console.log(`  Skipped (duplicates): ${skipped}`);
  console.log(`  Errors: ${errors.length}`);
  console.log(`  Skipped (incomplete data): 1 (Geurkink)`);
  console.log('='.repeat(60));

  if (missingFirefighters.length > 0) {
    console.log('\nMISSING FIREFIGHTERS (need to be added):');
    missingFirefighters.forEach(name => console.log(`  - ${name}`));
  }

  if (errors.length > 0 && errors.length <= 10) {
    console.log('\nERRORS:');
    errors.forEach(err => console.log(`  - ${err}`));
  }

  // Update last_hold_date for all affected firefighters
  if (inserted > 0) {
    console.log('\nUpdating last_hold_date for B-Shift firefighters...');

    const uniqueFirefighters = new Set(bShiftHolds.map(h => h.name));

    for (const name of uniqueFirefighters) {
      try {
        const { data: latestHold } = await supabase
          .from('scheduled_holds')
          .select('hold_date')
          .ilike('firefighter_name', `%${name}%`)
          .eq('shift', 'B')
          .eq('status', 'completed')
          .order('hold_date', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestHold) {
          await supabase
            .from('firefighters')
            .update({ last_hold_date: latestHold.hold_date })
            .ilike('name', `%${name}%`)
            .eq('shift', 'B');

          console.log(`  Updated last hold for ${name}: ${latestHold.hold_date}`);
        }
      } catch (err) {
        console.error(`  Error updating ${name}: ${err}`);
      }
    }
  }

  console.log('\n✓ B-Shift holds insertion complete!');
  console.log('Refresh your browser to see the holds on the calendar.');
}

insertBShiftHolds().catch(console.error);
