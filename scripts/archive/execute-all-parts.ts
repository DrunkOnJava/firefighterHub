import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeAllParts() {
  console.log('📦 Executing all SQL parts...\n');

  // Get all part files sorted
  const files = await glob('scripts/restore-part-*');
  const sortedFiles = files.sort();

  console.log(`Found ${sortedFiles.length} SQL parts to execute\n`);

  // Skip part-aa since we already executed the first firefighter
  let skippedFirst = false;

  for (const file of sortedFiles) {
    const partName = path.basename(file);
    console.log(`📄 Executing ${partName}...`);

    let sql = fs.readFileSync(file, 'utf-8');

    // Skip the first INSERT from part-aa since we already did it
    if (!skippedFirst && partName === 'restore-part-aa') {
      // Remove the first INSERT statement
      const firstInsertEnd = sql.indexOf(');') + 2;
      sql = sql.substring(firstInsertEnd);
      skippedFirst = true;
      console.log('   (Skipped first INSERT - already executed)');
    }

    // Skip empty SQL or just comments
    const trimmed = sql.trim().replace(/^--.*$/gm, '').trim();
    if (!trimmed || trimmed.length < 10) {
      console.log(`   ⏭️  Skipped (empty or comments only)\n`);
      continue;
    }

    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

      if (error) {
        // Fallback: Try direct SQL execution via PostgREST
        console.log('   Trying fallback method...');

        // Split into individual INSERT statements
        const statements = sql
          .split(');')
          .filter(stmt => stmt.trim().startsWith('INSERT'))
          .map(stmt => stmt.trim() + ');');

        let successCount = 0;
        let errorCount = 0;

        for (const stmt of statements) {
          try {
            const result = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
              },
              body: JSON.stringify({ sql_query: stmt }),
            });

            if (result.ok) {
              successCount++;
            } else {
              const errText = await result.text();
              console.error(`     ❌ Statement failed: ${errText.substring(0, 100)}`);
              errorCount++;
            }
          } catch (err: any) {
            console.error(`     ❌ Error: ${err.message}`);
            errorCount++;
          }

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        console.log(`   ✅ Fallback complete: ${successCount} succeeded, ${errorCount} failed`);
      } else {
        console.log(`   ✅ Executed successfully\n`);
      }
    } catch (err: any) {
      console.error(`   ❌ Error executing ${partName}:`, err.message);
      process.exit(1);
    }

    // Rate limiting between chunks
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n✨ All parts executed!');
}

executeAllParts()
  .then(() => {
    console.log('\n🎉 Database restore complete!');
    console.log('\nVerifying data...');
    return supabase.from('firefighters').select('count');
  })
  .then(({ data, error }) => {
    if (error) {
      console.error('Error counting firefighters:', error);
    } else {
      console.log(`✅ Firefighters in database: ${JSON.stringify(data)}`);
    }
  })
  .catch(err => {
    console.error('\n❌ Fatal error:', err);
    process.exit(1);
  });
