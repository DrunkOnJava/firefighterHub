#!/usr/bin/env tsx
/**
 * Apply database schema to Supabase
 * This script reads the migration file and applies it using the Supabase client
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  if (!supabaseUrl) console.error('  - VITE_SUPABASE_URL');
  if (!supabaseServiceKey) console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease add these to your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applySchema() {
  console.log('🔥 Applying FirefighterHub Database Schema');
  console.log('=========================================\n');

  // Read the migration file
  const migrationPath = join(process.cwd(), 'supabase', 'migrations', '20251022000000_initial_schema.sql');
  const sql = readFileSync(migrationPath, 'utf-8');

  console.log('📄 Migration file loaded');
  console.log(`   Path: ${migrationPath}`);
  console.log(`   Size: ${sql.length} characters\n`);

  console.log('📝 Note: Due to Supabase client limitations, please apply the schema manually:');
  console.log('   1. Open https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]/sql');
  console.log('   2. Create a new query');
  console.log('   3. Copy the contents of supabase/migrations/20251022000000_initial_schema.sql');
  console.log('   4. Run the query\n');

  console.log('✅ Alternatively, use the Supabase CLI:');
  console.log('   supabase db push\n');

  // Test connection
  console.log('🔌 Testing Supabase connection...');
  const { data, error } = await supabase.from('firefighters').select('count');

  if (error && error.message.includes('relation "public.firefighters" does not exist')) {
    console.log('⚠️  Tables not yet created - please apply the schema first');
  } else if (error) {
    console.log('❌ Error:', error.message);
  } else {
    console.log('✅ Connection successful!');
    console.log(`   Firefighters in database: ${data?.length || 0}`);
  }
}

applySchema().catch(console.error);
