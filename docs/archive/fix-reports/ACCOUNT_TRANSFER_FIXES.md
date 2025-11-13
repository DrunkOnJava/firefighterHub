# Account Transfer Configuration Fixes

## Date: October 22, 2025

## Summary
Successfully migrated project from old bolt.new account to new account. All configuration issues have been resolved and the application is now fully functional.

## Issues Fixed

### 1. npm Registry Configuration ✓
**Problem:** `.npmrc` file pointed to old account's local registry (http://localhost:9092/npm-registry) causing 401 authentication errors and preventing package installation.

**Solution:** Updated `.npmrc` to use the official npm registry (https://registry.npmjs.org/)

### 2. Node Modules Installation ✓
**Problem:** Corrupted or incomplete node_modules from failed installations.

**Solution:** 
- Removed old node_modules and package-lock.json
- Ran fresh npm install with corrected registry
- All 280 packages installed successfully

### 3. Database Schema ✓
**Problem:** 
- Missing `activity_log` and `scheduled_holds` tables
- Database had no migration history tracked
- Only `firefighters` table existed

**Solution:**
- Created `activity_log` table with proper schema and RLS policies
- Created `scheduled_holds` table with proper schema and RLS policies
- Both tables now support anonymous access via Supabase anon key

### 4. RLS Policy Mismatch ✓
**Problem:** Database policies required authenticated users but app uses anonymous access.

**Solution:**
- Dropped all "authenticated" policies on firefighters table
- Created new policies allowing anonymous (anon) access for all operations
- Applied anonymous access policies to all three tables consistently

### 5. Duplicate Migration Files ✓
**Problem:** 26 migration files with significant duplication from multiple migration attempts.

**Solution:**
- Removed all duplicate migrations from October 14, 18, and 21
- Kept only the two new migrations that created missing tables
- Clean migration folder with only relevant files

### 6. Service Worker Cache ✓
**Problem:** Stale cache from old account could cause issues.

**Solution:** Bumped cache version from 'hold-manager-v1' to 'hold-manager-v2'

## Current Database State

### Tables (3 total)
1. **firefighters** - 56 active records across shifts A, B, C
2. **activity_log** - Empty, ready for logging
3. **scheduled_holds** - Empty, ready for hold scheduling

### RLS Policies
All tables properly configured with anonymous access:
- `firefighters`: Full CRUD access for anon role
- `activity_log`: SELECT and INSERT access for anon role  
- `scheduled_holds`: Full CRUD access for anon role

### Data Integrity
- All 56 firefighter records intact with complete profiles
- Shifts: A, B, and C properly distributed
- Fire stations, certifications, and apparatus clearances preserved
- All order_position values maintained

## Supabase Connection
- URL: https://ulpvhjoxdwwbsnpnpbqh.supabase.co
- Connection: Active and verified
- JWT Token: Valid and properly configured
- Environment variables: Correctly set in .env file

## Build Status
✓ Project builds successfully with no errors
✓ All TypeScript compilation passed
✓ Production build: 445KB JavaScript, 59KB CSS

## Next Steps
The application is now ready to use. When you start the dev server, it will:
1. Connect to the Supabase database using the anon key
2. Load all 56 firefighters from the database
3. Support full CRUD operations for managing the hold rotation
4. Track all activities in the activity log
5. Allow scheduling and completing holds

## Files Modified
- `.npmrc` - Updated registry URL
- `public/service-worker.js` - Bumped cache version
- Database: Applied 2 new migrations

## Files Removed
- 24 duplicate migration files (October 14, 18, 21, 22)
- Old node_modules directory
- Old package-lock.json

---
All account transfer issues resolved. Application is fully configured for the new bolt.new account.
