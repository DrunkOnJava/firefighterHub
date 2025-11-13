import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addMissingFirefighters() {
  console.log('Step 1: Check if Willocks exists in C-Shift...\n');

  const { data: willocks } = await supabase
    .from('firefighters')
    .select('*')
    .ilike('name', '%willocks%')
    .eq('shift', 'C')
    .maybeSingle();

  if (willocks) {
    console.log(`Found: ${willocks.name} (ID: ${willocks.id})`);

    // Check if it needs correction (should be Wilocks with one 'l')
    if (willocks.name.includes('Willocks')) {
      console.log('Correcting spelling: Willocks → Wilocks');
      const { error } = await supabase
        .from('firefighters')
        .update({ name: willocks.name.replace('Willocks', 'Wilocks') })
        .eq('id', willocks.id);

      if (!error) {
        console.log('✓ Spelling corrected!\n');
      }
    }
  }

  console.log('Step 2: Add Catlett to A-Shift...\n');

  // Check if Catlett already exists
  const { data: existingCatlett } = await supabase
    .from('firefighters')
    .select('*')
    .ilike('name', '%catlett%')
    .eq('shift', 'A')
    .maybeSingle();

  if (existingCatlett) {
    console.log(`Catlett already exists: ${existingCatlett.name}\n`);
  } else {
    // Get the highest order_position for A-Shift
    const { data: aShiftFirefighters } = await supabase
      .from('firefighters')
      .select('order_position')
      .eq('shift', 'A')
      .eq('is_active', true)
      .order('order_position', { ascending: false })
      .limit(1);

    const nextPosition = aShiftFirefighters && aShiftFirefighters.length > 0
      ? aShiftFirefighters[0].order_position + 1
      : 1;

    const { error } = await supabase
      .from('firefighters')
      .insert({
        name: 'Catlett',
        shift: 'A',
        order_position: nextPosition,
        is_available: true,
        is_active: true,
        fire_station: '6',  // Based on hold data
      })
      .select()
      .single();

    if (error) {
      console.error(`Error adding Catlett: ${error.message}`);
    } else {
      console.log(`✓ Added Catlett to A-Shift (Position ${nextPosition})\n`);
    }
  }

  console.log('Step 3: Insert hold records for corrected firefighters...\n');

  // Insert Catlett's hold
  const { data: catlett } = await supabase
    .from('firefighters')
    .select('id, name')
    .ilike('name', '%catlett%')
    .eq('shift', 'A')
    .maybeSingle();

  if (catlett) {
    const { error } = await supabase
      .from('scheduled_holds')
      .insert({
        firefighter_id: catlett.id,
        firefighter_name: catlett.name,
        hold_date: '2025-09-27',
        status: 'completed',
        shift: 'A',
        fire_station: '6',
        completed_at: new Date('2025-09-27T23:59:59Z').toISOString(),
      });

    if (error && error.code !== '23505') {
      console.error(`Error inserting Catlett hold: ${error.message}`);
    } else {
      console.log(`✓ Inserted Catlett hold (2025-09-27) at Station 6`);

      // Update last_hold_date
      await supabase
        .from('firefighters')
        .update({ last_hold_date: '2025-09-27' })
        .eq('id', catlett.id);
    }
  }

  // Insert Wilocks' hold
  const { data: wilocks } = await supabase
    .from('firefighters')
    .select('id, name')
    .ilike('name', '%wilocks%')
    .eq('shift', 'C')
    .maybeSingle();

  if (wilocks) {
    const { error } = await supabase
      .from('scheduled_holds')
      .insert({
        firefighter_id: wilocks.id,
        firefighter_name: wilocks.name,
        hold_date: '2025-09-08',
        status: 'completed',
        shift: 'C',
        fire_station: '10',
        completed_at: new Date('2025-09-08T23:59:59Z').toISOString(),
      });

    if (error && error.code !== '23505') {
      console.error(`Error inserting Wilocks hold: ${error.message}`);
    } else {
      console.log(`✓ Inserted Wilocks hold (2025-09-08) at Station 10`);

      // Update last_hold_date
      await supabase
        .from('firefighters')
        .update({ last_hold_date: '2025-09-08' })
        .eq('id', wilocks.id);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('COMPLETE! All firefighters added and hold records inserted.');
  console.log('='.repeat(60));
  console.log('\nRefresh your browser to see all 34 holds on the calendar!');
}

addMissingFirefighters().catch(console.error);
