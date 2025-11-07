# Runbook: Database Migrations

## Overview

This runbook provides step-by-step instructions for safely creating and applying database migrations in the FirefighterHub project using Supabase.

## Database Setup

**Platform**: Supabase (PostgreSQL 14)
**Project**: firefighter-hub
**Region**: us-east-1 (East US - North Virginia)

## Migration Files Location

```
supabase/migrations/
├── 20251022000000_initial_schema.sql
├── 20251107000000_add_apparatus_certification.sql
└── 20251108000000_your_migration.sql
```

## Migration File Naming

**Format**: `YYYYMMDDHHMMSS_description.sql`

**Examples**:
```
20251107120000_add_certification_table.sql
20251107120100_add_station_index.sql
20251107120200_update_rls_policies.sql
```

**Rules**:
- Use UTC timestamp
- Use snake_case for description
- Be descriptive but concise
- Unique timestamps (no conflicts)

## Creating a Migration

### Step 1: Plan the Migration

Before writing SQL, answer:

- [ ] What tables/columns are being added/modified?
- [ ] What indexes are needed?
- [ ] What RLS policies are affected?
- [ ] What data needs to be migrated?
- [ ] Is this change backward compatible?
- [ ] What's the rollback plan?

### Step 2: Create Migration File

```bash
# Generate timestamp
date -u +%Y%m%d%H%M%S

# Create file
touch supabase/migrations/$(date -u +%Y%m%d%H%M%S)_add_apparatus_certification.sql
```

### Step 3: Write Migration SQL

**Template**:
```sql
-- Migration: Add apparatus certification tracking
-- Created: 2025-11-07
-- Author: Your Name

-- DESCRIPTION
-- Adds apparatus_certifications column to firefighters table
-- to track which apparatus each firefighter is certified for

-- UP MIGRATION

-- Add column
ALTER TABLE firefighters
ADD COLUMN apparatus_certifications TEXT[] DEFAULT '{}';

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_firefighters_apparatus_certifications
ON firefighters USING GIN (apparatus_certifications);

-- Update RLS policy if needed
-- (None needed for this change)

-- ROLLBACK INSTRUCTIONS
-- To rollback this migration:
-- ALTER TABLE firefighters DROP COLUMN apparatus_certifications;
-- DROP INDEX IF EXISTS idx_firefighters_apparatus_certifications;

-- TESTING
-- Verify column exists:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'firefighters' AND column_name = 'apparatus_certifications';
```

## Migration Best Practices

### Idempotent Migrations

**Always use** `IF NOT EXISTS` and `IF EXISTS`:

```sql
-- ✅ GOOD - Idempotent (can run multiple times safely)
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL
);

ALTER TABLE firefighters
ADD COLUMN IF NOT EXISTS certification_id UUID
REFERENCES certifications(id);

CREATE INDEX IF NOT EXISTS idx_firefighters_certification
ON firefighters(certification_id);

-- ❌ BAD - Will fail if run twice
CREATE TABLE certifications (...);
ALTER TABLE firefighters ADD COLUMN certification_id UUID;
CREATE INDEX idx_firefighters_certification ON firefighters(certification_id);
```

### Backward Compatibility

**Prefer additive changes**:

```sql
-- ✅ GOOD - Additive (doesn't break existing code)
ALTER TABLE firefighters
ADD COLUMN IF NOT EXISTS email TEXT;

-- ⚠️ RISKY - Removes column (breaks existing code)
ALTER TABLE firefighters
DROP COLUMN phone_number;

-- ✅ BETTER - Deprecate first, remove later
-- Migration 1: Add new column
ALTER TABLE firefighters
ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- Migration 2 (later): Remove old column
-- After code is updated to use contact_email
ALTER TABLE firefighters
DROP COLUMN IF EXISTS email;
```

### Data Migrations

**Always preserve data**:

```sql
-- Example: Rename column with data preservation

-- Step 1: Add new column
ALTER TABLE firefighters
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Step 2: Copy data
UPDATE firefighters
SET full_name = name
WHERE full_name IS NULL;

-- Step 3: Make new column required
ALTER TABLE firefighters
ALTER COLUMN full_name SET NOT NULL;

-- Step 4 (later migration): Drop old column
-- ALTER TABLE firefighters DROP COLUMN IF EXISTS name;
```

## Applying Migrations

### Method 1: Supabase SQL Editor (Recommended)

**When to use**: Always, for all migrations

**Steps**:

1. **Open SQL Editor**:
   ```
   https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
   ```

2. **Copy migration content**:
   ```bash
   cat supabase/migrations/20251107120000_add_certification.sql
   ```

3. **Paste into SQL Editor**

4. **Review SQL** (double-check):
   - [ ] Uses IF NOT EXISTS / IF EXISTS
   - [ ] Has rollback instructions in comments
   - [ ] No destructive operations
   - [ ] Indexes created for new columns

5. **Run migration** (click "Run" button)

6. **Verify success**:
   ```sql
   -- Check if column was added
   SELECT column_name, data_type, is_nullable
   FROM information_schema.columns
   WHERE table_name = 'firefighters'
   AND column_name = 'apparatus_certifications';
   
   -- Check if index was created
   SELECT indexname, indexdef
   FROM pg_indexes
   WHERE tablename = 'firefighters'
   AND indexname = 'idx_firefighters_apparatus_certifications';
   ```

7. **Document in PR**:
   ```markdown
   ## Database Migration Applied
   
   - Migration file: `supabase/migrations/20251107120000_add_certification.sql`
   - Applied: 2025-11-07 12:30 UTC
   - Verified: Column and index created successfully
   ```

### Method 2: Supabase CLI (For Local Development)

**When to use**: Testing migrations locally

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Link to project
supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations
supabase db push

# Or reset and apply all migrations
supabase db reset
```

## Rolling Back Migrations

### Rollback via SQL Editor

**Use the rollback instructions from the migration file**:

```sql
-- From migration file comments:
-- ROLLBACK INSTRUCTIONS
-- ALTER TABLE firefighters DROP COLUMN apparatus_certifications;
-- DROP INDEX IF EXISTS idx_firefighters_apparatus_certifications;

-- Execute rollback
ALTER TABLE firefighters DROP COLUMN apparatus_certifications;
DROP INDEX IF EXISTS idx_firefighters_apparatus_certifications;
```

### Verify Rollback

```sql
-- Verify column is gone
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'firefighters'
AND column_name = 'apparatus_certifications';
-- Should return 0 rows

-- Verify index is gone
SELECT indexname
FROM pg_indexes
WHERE tablename = 'firefighters'
AND indexname = 'idx_firefighters_apparatus_certifications';
-- Should return 0 rows
```

## Common Migration Patterns

### Pattern 1: Add New Table

```sql
-- Create table
CREATE TABLE IF NOT EXISTS apparatus_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firefighter_id UUID NOT NULL REFERENCES firefighters(id) ON DELETE CASCADE,
  apparatus_type TEXT NOT NULL,
  certified_date DATE NOT NULL,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_apparatus_certifications_firefighter
ON apparatus_certifications(firefighter_id);

CREATE INDEX IF NOT EXISTS idx_apparatus_certifications_apparatus_type
ON apparatus_certifications(apparatus_type);

-- Add RLS policies
ALTER TABLE apparatus_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON apparatus_certifications
FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON apparatus_certifications
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON apparatus_certifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### Pattern 2: Add Column with Default

```sql
-- Add column with default
ALTER TABLE firefighters
ADD COLUMN IF NOT EXISTS is_certified BOOLEAN DEFAULT false;

-- Backfill data (if needed)
UPDATE firefighters
SET is_certified = true
WHERE id IN (
  SELECT firefighter_id FROM apparatus_certifications
);

-- Add index if needed
CREATE INDEX IF NOT EXISTS idx_firefighters_is_certified
ON firefighters(is_certified)
WHERE is_certified = true;  -- Partial index for certified firefighters only
```

### Pattern 3: Add Foreign Key

```sql
-- Add column
ALTER TABLE scheduled_holds
ADD COLUMN IF NOT EXISTS fire_station_id UUID;

-- Add foreign key constraint
ALTER TABLE scheduled_holds
ADD CONSTRAINT fk_scheduled_holds_fire_station
FOREIGN KEY (fire_station_id)
REFERENCES fire_stations(id)
ON DELETE SET NULL;

-- Add index
CREATE INDEX IF NOT EXISTS idx_scheduled_holds_fire_station
ON scheduled_holds(fire_station_id);
```

### Pattern 4: Modify Column Type

```sql
-- Safe way to change column type

-- Step 1: Add new column with new type
ALTER TABLE firefighters
ADD COLUMN IF NOT EXISTS order_position_new INTEGER;

-- Step 2: Migrate data
UPDATE firefighters
SET order_position_new = CAST(order_position AS INTEGER)
WHERE order_position_new IS NULL;

-- Step 3: Make new column NOT NULL
ALTER TABLE firefighters
ALTER COLUMN order_position_new SET NOT NULL;

-- Step 4: Drop old column (in later migration, after code is updated)
-- ALTER TABLE firefighters DROP COLUMN IF EXISTS order_position;

-- Step 5: Rename new column (in same later migration)
-- ALTER TABLE firefighters RENAME COLUMN order_position_new TO order_position;
```

### Pattern 5: Add Index

```sql
-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_firefighters_shift_station
ON firefighters(shift, fire_station)
WHERE is_active = true;  -- Partial index for active firefighters only

-- For text search
CREATE INDEX IF NOT EXISTS idx_firefighters_name_gin
ON firefighters USING GIN (to_tsvector('english', name));

-- For array columns
CREATE INDEX IF NOT EXISTS idx_firefighters_apparatus_gin
ON firefighters USING GIN (apparatus_certifications);
```

### Pattern 6: Update RLS Policies

```sql
-- Drop old policy
DROP POLICY IF EXISTS "old_policy_name" ON firefighters;

-- Create new policy
CREATE POLICY "Enable read for same shift only" ON firefighters
FOR SELECT USING (
  shift = current_setting('app.current_shift', true)
);

-- Test policy
SELECT * FROM firefighters;  -- Should only show current shift
```

## Testing Migrations

### Before Applying to Production

1. **Test locally** (if using Supabase CLI):
   ```bash
   supabase db reset  # Reset local DB
   supabase db push   # Apply migrations
   ```

2. **Test with application**:
   ```bash
   pnpm dev
   # Test affected features
   ```

3. **Verify data integrity**:
   ```sql
   -- Check row counts
   SELECT COUNT(*) FROM firefighters;
   
   -- Check for NULL values where not expected
   SELECT * FROM firefighters WHERE name IS NULL;
   
   -- Check foreign keys
   SELECT * FROM scheduled_holds
   WHERE firefighter_id NOT IN (SELECT id FROM firefighters);
   ```

### After Applying to Production

1. **Verify migration applied**:
   ```sql
   -- Check migration in migrations table (if using Supabase CLI)
   SELECT * FROM supabase_migrations.schema_migrations
   ORDER BY version DESC LIMIT 5;
   ```

2. **Check application logs**:
   ```bash
   # Check browser console for errors
   # Check Supabase logs for failed queries
   ```

3. **Test critical paths**:
   - Create firefighter
   - Update firefighter
   - Complete hold
   - View calendar
   - Switch shifts

## Updating TypeScript Types

After any migration, regenerate TypeScript types:

```bash
# If using Supabase CLI
supabase gen types typescript --local > src/lib/database.types.ts

# Or manually via Supabase Dashboard
# 1. Go to Settings → API
# 2. Copy TypeScript types
# 3. Paste into src/lib/database.types.ts
```

**Verify types**:
```bash
pnpm typecheck
```

**Update code**:
```typescript
// src/lib/supabase.ts
import { Database } from './database.types';

// Types are now auto-generated from your schema
export type Firefighter = Database['public']['Tables']['firefighters']['Row'];
```

## Troubleshooting

### Issue 1: Migration Fails Due to Existing Data

**Error**: `column "name" contains null values`

**Solution**:
```sql
-- First, fix existing data
UPDATE firefighters
SET name = 'Unknown'
WHERE name IS NULL;

-- Then apply constraint
ALTER TABLE firefighters
ALTER COLUMN name SET NOT NULL;
```

### Issue 2: Foreign Key Violation

**Error**: `violates foreign key constraint`

**Solution**:
```sql
-- Check orphaned records
SELECT * FROM scheduled_holds
WHERE firefighter_id NOT IN (SELECT id FROM firefighters);

-- Option 1: Fix data
UPDATE scheduled_holds
SET firefighter_id = NULL
WHERE firefighter_id NOT IN (SELECT id FROM firefighters);

-- Option 2: Delete orphaned records
DELETE FROM scheduled_holds
WHERE firefighter_id NOT IN (SELECT id FROM firefighters);

-- Then add foreign key
ALTER TABLE scheduled_holds
ADD CONSTRAINT fk_scheduled_holds_firefighter
FOREIGN KEY (firefighter_id) REFERENCES firefighters(id);
```

### Issue 3: Index Creation Timeout

**Error**: `timeout while creating index`

**Solution**:
```sql
-- Create index concurrently (doesn't lock table)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_firefighters_name
ON firefighters(name);

-- Note: Can't use CONCURRENTLY in transaction blocks
-- Run this statement alone, not in a migration with other statements
```

### Issue 4: RLS Policy Blocks Query

**Error**: `new row violates row-level security policy`

**Solution**:
```sql
-- Temporarily disable RLS (for testing only)
ALTER TABLE firefighters DISABLE ROW LEVEL SECURITY;

-- Debug which policy is blocking
SELECT * FROM firefighters;  -- Does this work now?

-- Re-enable RLS
ALTER TABLE firefighters ENABLE ROW LEVEL SECURITY;

-- Fix the policy
DROP POLICY "problematic_policy" ON firefighters;
CREATE POLICY "fixed_policy" ON firefighters
FOR INSERT WITH CHECK (true);  -- Adjust as needed
```

## Emergency Procedures

### Production Database Issue

**If migration causes production issues**:

1. **Immediate rollback**:
   ```sql
   -- Execute rollback SQL from migration file
   -- (see ROLLBACK INSTRUCTIONS in migration comments)
   ```

2. **Notify team**:
   - Post in team chat
   - Update status page (if applicable)

3. **Investigate**:
   ```sql
   -- Check recent changes
   SELECT * FROM supabase_migrations.schema_migrations
   ORDER BY version DESC LIMIT 10;
   
   -- Check for errors in logs
   -- (Supabase Dashboard → Logs)
   ```

4. **Fix and redeploy**:
   - Create new migration with fix
   - Test locally first
   - Apply to production
   - Verify fix

## Checklist

Before creating migration:
- [ ] Migration plan documented
- [ ] Rollback plan documented
- [ ] SQL is idempotent (uses IF NOT EXISTS/EXISTS)
- [ ] Backward compatible (if possible)
- [ ] Data preservation considered
- [ ] Indexes added for new columns
- [ ] RLS policies updated (if needed)

Before applying migration:
- [ ] Tested locally (if possible)
- [ ] Reviewed by another developer
- [ ] Rollback instructions ready
- [ ] Backup taken (if large changes)
- [ ] Team notified

After applying migration:
- [ ] Migration verified in database
- [ ] Application tested
- [ ] TypeScript types updated
- [ ] Code changes merged (if any)
- [ ] Documentation updated

## Best Practices Summary

### Do's ✅

- Use descriptive migration names
- Write idempotent SQL
- Include rollback instructions
- Test locally before production
- Document breaking changes
- Update TypeScript types
- Add indexes for new columns
- Preserve existing data

### Don'ts ❌

- Don't skip testing
- Don't delete data without backup
- Don't make breaking changes without notice
- Don't forget IF NOT EXISTS/IF EXISTS
- Don't apply untested migrations to production
- Don't modify migration files after applying
- Don't use SELECT * in migrations (use explicit columns)

## Resources

- [Supabase SQL Editor](https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/14/)
- [Supabase Migrations Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)

---

**Related Documentation**:
- [CONTRIBUTING.md](../../../CONTRIBUTING.md)
- [Dependency Updates Runbook](./dependency-updates.md)
- [Merge Conflicts Runbook](./merge-conflicts.md)

**Last Updated**: November 7, 2025
