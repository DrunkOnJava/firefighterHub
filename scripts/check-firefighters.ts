import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFirefighters() {
  console.log('Checking A-Shift firefighters:');
  const { data: aShift } = await supabase
    .from('firefighters')
    .select('name, shift')
    .eq('shift', 'A')
    .order('name');

  console.log(aShift?.map(f => f.name).join(', '));

  console.log('\n\nChecking C-Shift firefighters:');
  const { data: cShift } = await supabase
    .from('firefighters')
    .select('name, shift')
    .eq('shift', 'C')
    .order('name');

  console.log(cShift?.map(f => f.name).join(', '));
}

checkFirefighters();
