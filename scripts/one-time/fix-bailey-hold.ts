import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixBaileyHold() {
  console.log('Fixing Nick Bailey duplicate hold...\n');

  // Delete the 2024 hold (old/incorrect date)
  const { error } = await supabase
    .from('scheduled_holds')
    .delete()
    .eq('id', '2a4bb89d-b4cd-4aa5-a3ab-03830a45ab7f');

  if (error) {
    console.error('Error deleting 2024 hold:', error);
  } else {
    console.log('✓ Deleted 2024-10-19 hold (incorrect date)');
    console.log('✓ Kept 2025-10-19 hold (correct date)');
    console.log('\nNick Bailey now has 1 hold on 2025-10-19 at Station 10');
  }
}

fixBaileyHold().catch(console.error);
