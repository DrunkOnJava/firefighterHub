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
  station: string;
  shift: 'A' | 'B' | 'C';
}

const aShiftHolds: HoldData[] = [
  { name: 'Hernandez', date: '2025-09-25', station: '1', shift: 'A' },
  { name: 'Catlett', date: '2025-09-27', station: '6', shift: 'A' },
  { name: 'Baldwin', date: '2025-09-27', station: '6', shift: 'A' },
  { name: 'Richardson', date: '2025-09-29', station: '10', shift: 'A' },
  { name: 'McCauley', date: '2025-10-04', station: '2', shift: 'A' },
  { name: 'Bryson', date: '2025-10-04', station: '2', shift: 'A' },
  { name: 'Feldhauser', date: '2025-10-06', station: '10', shift: 'A' },
  { name: 'Kennedy', date: '2025-10-06', station: '10', shift: 'A' },
  { name: 'Myers', date: '2025-10-08', station: '5', shift: 'A' },
  { name: 'Oliver', date: '2025-10-08', station: '8', shift: 'A' },
  { name: 'Levdahl', date: '2025-10-11', station: '8', shift: 'A' },
  { name: 'Biby', date: '2025-10-15', station: '3', shift: 'A' },
  { name: 'Pangle', date: '2025-10-15', station: '5', shift: 'A' },
  { name: 'Hammack', date: '2025-10-15', station: '5', shift: 'A' },
  { name: 'Fisher', date: '2025-10-15', station: '3', shift: 'A' },
  { name: 'Cucciardo', date: '2025-09-14', station: '1', shift: 'A' },
];

const cShiftHolds: HoldData[] = [
  { name: 'Lewis', date: '2025-09-06', station: '1', shift: 'C' },
  { name: 'Wilocks', date: '2025-09-08', station: '10', shift: 'C' },
  { name: 'Orebaugh', date: '2025-09-13', station: '3', shift: 'C' },
  { name: 'Maiatico', date: '2025-09-13', station: '3', shift: 'C' },
  { name: 'Gottholm', date: '2025-09-15', station: '4', shift: 'C' },
  { name: 'Gray', date: '2025-09-26', station: '6', shift: 'C' },
  { name: 'Settle', date: '2025-10-01', station: '8', shift: 'C' },
  { name: 'Birks', date: '2025-10-01', station: '8', shift: 'C' },
  { name: 'Khan', date: '2025-10-03', station: '1', shift: 'C' },
  { name: 'Udy', date: '2025-10-05', station: '6', shift: 'C' },
  { name: 'Jock', date: '2025-10-08', station: '5', shift: 'C' },
  { name: 'Tipeni', date: '2025-10-09', station: '8', shift: 'C' },
  { name: 'Smith', date: '2025-10-10', station: '6', shift: 'C' },
  { name: 'Stewart', date: '2025-10-10', station: '6', shift: 'C' },
  { name: 'Whitfield', date: '2025-10-10', station: '5', shift: 'C' },
  { name: 'Walker', date: '2025-10-12', station: '5', shift: 'C' },
  { name: 'Wilbanks', date: '2025-10-12', station: '4', shift: 'C' },
  { name: 'Bailey', date: '2025-10-19', station: '4', shift: 'C' },
];

async function insertHoldData() {
  console.log('Starting hold data insertion...\n');

  const allHolds = [...aShiftHolds, ...cShiftHolds];
  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const hold of allHolds) {
    try {
      // Find the firefighter by last name and shift (using ilike for case-insensitive partial match)
      const { data: firefighter, error: ffError } = await supabase
        .from('firefighters')
        .select('id, name, shift')
        .ilike('name', `%${hold.name}%`)
        .eq('shift', hold.shift)
        .maybeSingle();

      if (ffError) {
        errors.push(`Error finding ${hold.name} (${hold.shift}): ${ffError.message}`);
        continue;
      }

      if (!firefighter) {
        errors.push(`Firefighter not found: ${hold.name} (Shift ${hold.shift})`);
        continue;
      }

      // Insert the hold record
      const { error: insertError } = await supabase
        .from('scheduled_holds')
        .insert({
          firefighter_id: firefighter.id,
          firefighter_name: firefighter.name,
          hold_date: hold.date,
          status: 'completed',
          shift: hold.shift,
          fire_station: hold.station,
          completed_at: new Date(hold.date + 'T23:59:59Z').toISOString(),
        });

      if (insertError) {
        if (insertError.code === '23505') {
          // Unique constraint violation - record already exists
          skipped++;
          console.log(`⊘ Skipped ${hold.name} (${hold.date}) - already exists`);
        } else {
          errors.push(`Error inserting ${hold.name} (${hold.date}): ${insertError.message}`);
        }
      } else {
        inserted++;
        console.log(`✓ Inserted ${hold.name} (${hold.date}) at Station ${hold.station}`);
      }
    } catch (err) {
      errors.push(`Unexpected error for ${hold.name}: ${err}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`SUMMARY:`);
  console.log(`  Total holds processed: ${allHolds.length}`);
  console.log(`  Successfully inserted: ${inserted}`);
  console.log(`  Skipped (duplicates): ${skipped}`);
  console.log(`  Errors: ${errors.length}`);
  console.log('='.repeat(60));

  if (errors.length > 0) {
    console.log('\nERRORS:');
    errors.forEach(err => console.log(`  - ${err}`));
  }

  // Update last_hold_date for all affected firefighters
  if (inserted > 0) {
    console.log('\nUpdating last_hold_date for affected firefighters...');

    const uniqueFirefighters = new Set(allHolds.map(h => `${h.name}_${h.shift}`));

    for (const ff of uniqueFirefighters) {
      const [name, shift] = ff.split('_');

      try {
        // Get the most recent hold date for this firefighter
        const { data: latestHold } = await supabase
          .from('scheduled_holds')
          .select('hold_date')
          .eq('firefighter_name', name)
          .eq('shift', shift)
          .eq('status', 'completed')
          .order('hold_date', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestHold) {
          await supabase
            .from('firefighters')
            .update({ last_hold_date: latestHold.hold_date })
            .eq('name', name)
            .eq('shift', shift);

          console.log(`  Updated ${name} (${shift}) - last hold: ${latestHold.hold_date}`);
        }
      } catch (err) {
        console.error(`  Error updating ${name}: ${err}`);
      }
    }
  }

  console.log('\nDone! Refresh your browser to see the holds on the calendar.');
}

insertHoldData().catch(console.error);
