#!/usr/bin/env tsx
/**
 * Test database connection and verify firefighters are loading
 */

import { createClient } from '@supabase/supabase-js';

// Load from environment
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://[YOUR_PROJECT_ID].supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '[YOUR_SUPABASE_ANON_KEY]';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔥 FirefighterHub Database Connection Test\n');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey.substring(0, 20) + '...\n');

  try {
    // Test 1: Count all firefighters
    console.log('Test 1: Counting all firefighters...');
    const { data: allData, error: allError, count } = await supabase
      .from('firefighters')
      .select('*', { count: 'exact' });

    if (allError) {
      console.error('❌ Error:', allError.message);
      console.error('   Code:', allError.code);
      console.error('   Details:', allError.details);
      return;
    }

    console.log(`✅ Total firefighters in database: ${count || allData?.length || 0}\n`);

    // Test 2: Count by shift
    console.log('Test 2: Counting firefighters by shift...');
    for (const shift of ['A', 'B', 'C']) {
      const { data, error, count: shiftCount } = await supabase
        .from('firefighters')
        .select('*', { count: 'exact' })
        .eq('shift', shift)
        .eq('is_active', true);

      if (error) {
        console.error(`❌ Error loading Shift ${shift}:`, error.message);
      } else {
        console.log(`✅ Shift ${shift}: ${shiftCount || data?.length || 0} active firefighters`);
      }
    }

    // Test 3: Sample a few firefighters
    console.log('\nTest 3: Sample firefighters from Shift C...');
    const { data: sampleData, error: sampleError } = await supabase
      .from('firefighters')
      .select('id, name, shift, fire_station, is_active')
      .eq('shift', 'C')
      .eq('is_active', true)
      .limit(5);

    if (sampleError) {
      console.error('❌ Error:', sampleError.message);
    } else if (sampleData && sampleData.length > 0) {
      console.log('✅ Sample data:');
      sampleData.forEach((ff, i) => {
        console.log(`   ${i + 1}. ${ff.name} (Station ${ff.fire_station || 'N/A'})`);
      });
    } else {
      console.log('⚠️  No data returned');
    }

    // Test 4: Check table structure
    console.log('\nTest 4: Checking activity_log table structure...');
    const { data: logTest, error: logError } = await supabase
      .from('activity_log')
      .select('*')
      .limit(1);

    if (logError) {
      console.error('❌ activity_log error:', logError.message);
      console.log('   This might be why the app isn\'t working!');
      console.log('   Please run the schema fix SQL in Supabase SQL Editor');
    } else {
      console.log('✅ activity_log table accessible');
    }

    // Test 5: Check scheduled_holds
    console.log('\nTest 5: Checking scheduled_holds table...');
    const { data: holdsTest, error: holdsError } = await supabase
      .from('scheduled_holds')
      .select('*')
      .limit(1);

    if (holdsError) {
      console.error('❌ scheduled_holds error:', holdsError.message);
      console.log('   Please run the schema fix SQL in Supabase SQL Editor');
    } else {
      console.log('✅ scheduled_holds table accessible');
    }

    console.log('\n' + '='.repeat(60));
    console.log('Summary:');
    if (!allError && !sampleError) {
      console.log('✅ Database connection is working!');
      console.log(`✅ Found ${count} firefighters`);
      if (logError || holdsError) {
        console.log('⚠️  Schema needs fixing - run the SQL fix in Supabase');
      } else {
        console.log('✅ All tables are accessible');
      }
    } else {
      console.log('❌ Database connection issues detected');
    }

  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message || error);
  }
}

testConnection();
