import * as fs from 'fs';
import * as path from 'path';

// Read the SQL file
const sqlPath = path.join(process.cwd(), 'scripts/combined-restore.sql');
const sql = fs.readFileSync(sqlPath, 'utf-8');

// Split into individual INSERT statements
const statements = sql
  .split(/;\s*\n/)
  .filter(stmt => stmt.trim().length > 0)
  .map(stmt => stmt.trim() + ';');

console.log(`Found ${statements.length} SQL statements to execute\n`);

// Create batches
const BATCH_SIZE = 10;
const batches: string[][] = [];

for (let i = 0; i < statements.length; i += BATCH_SIZE) {
  batches.push(statements.slice(i, i + BATCH_SIZE));
}

console.log(`Created ${batches.length} batches of up to ${BATCH_SIZE} statements each\n`);

// Write each batch to a separate file
batches.forEach((batch, index) => {
  const batchSQL = batch.join('\n\n');
  const batchPath = path.join(process.cwd(), 'scripts', `batch-${String(index + 1).padStart(3, '0')}.sql`);
  fs.writeFileSync(batchPath, batchSQL);
  console.log(`Wrote batch ${index + 1}: ${batch.length} statements`);
});

console.log('\n✅ Batch files created successfully!');
console.log('\nNow execute each batch via Supabase MCP execute_sql tool');
