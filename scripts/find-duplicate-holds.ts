import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findDuplicateHolds() {
  console.log('Searching for duplicate holds for Nick Bailey...\n');

  // Find Nick Bailey's firefighter record
  const { data: bailey } = await supabase
    .from('firefighters')
    .select('id, name, shift')
    .ilike('name', '%Bailey%')
    .maybeSingle();

  if (!bailey) {
    console.log('Nick Bailey not found in database');
    return;
  }

  console.log(`Found: ${bailey.name} (Shift ${bailey.shift}, ID: ${bailey.id})\n`);

  // Find all holds for Nick Bailey
  const { data: holds } = await supabase
    .from('scheduled_holds')
    .select('*')
    .eq('firefighter_id', bailey.id)
    .order('hold_date', { ascending: true });

  console.log(`Total holds for ${bailey.name}: ${holds?.length || 0}\n`);

  if (holds && holds.length > 0) {
    console.log('All holds:');
    holds.forEach((hold, index) => {
      console.log(`  ${index + 1}. ${hold.hold_date} at Station ${hold.fire_station || 'N/A'} (${hold.status}) - ID: ${hold.id}`);
    });

    // Find duplicates by date
    const dateMap = new Map<string, typeof holds>();
    holds.forEach(hold => {
      const date = hold.hold_date;
      if (!dateMap.has(date)) {
        dateMap.set(date, []);
      }
      dateMap.get(date)!.push(hold);
    });

    const duplicates = Array.from(dateMap.entries()).filter(([_, holds]) => holds.length > 1);

    if (duplicates.length > 0) {
      console.log('\n' + '='.repeat(60));
      console.log('DUPLICATES FOUND:');
      duplicates.forEach(([date, dupeHolds]) => {
        console.log(`\nDate: ${date} (${dupeHolds.length} records)`);
        dupeHolds.forEach((hold, idx) => {
          console.log(`  ${idx + 1}. ID: ${hold.id}, Station: ${hold.fire_station}, Created: ${hold.created_at}`);
        });

        // Suggest which to delete (keep the older one, delete newer)
        if (dupeHolds.length === 2) {
          const [older, newer] = dupeHolds.sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          console.log(`  → KEEP: ${older.id} (created first)`);
          console.log(`  → DELETE: ${newer.id} (duplicate)`);
        }
      });
      console.log('='.repeat(60));
    } else {
      console.log('\nNo duplicates found.');
    }
  }
}

findDuplicateHolds().catch(console.error);
