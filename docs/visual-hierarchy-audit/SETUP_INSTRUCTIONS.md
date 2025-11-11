# FirefighterHub Database Setup Instructions

## Quick Setup (Recommended)

Your Supabase project has been created and configured:

- **Project URL**: https://[YOUR_PROJECT_ID].supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]
- **Region**: us-east-1

### Step 1: Apply Database Schema

1. Open the Supabase Dashboard: https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy and paste the contents of `supabase/migrations/20251022000000_initial_schema.sql`
5. Click "Run" to execute the migration

### Step 2: Verify Schema

After running the migration, verify that the following tables were created:
- `firefighters`
- `scheduled_holds`
- `activity_log`

### Step 3: (Optional) Add Sample Data

If you want to test with sample data, run the seed script in the SQL Editor:

```sql
-- See database/seed.sql for sample data
```

## Environment Variables

Your `.env` file has been created with:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Next Steps

1. Run `pnpm dev` to start the development server
2. The application should connect to your Supabase database automatically
3. Start adding firefighters through the UI

## Troubleshooting

If you encounter connection issues:
1. Verify the API keys in `.env` match the ones in the Supabase dashboard
2. Check that Row Level Security policies are applied (they're in the migration)
3. Ensure you're using the correct project reference ID

## Migration from Bolt.new

The old bolt.new migrations have been removed. The new comprehensive schema includes:
- All firefighter fields and apparatus certifications
- Scheduled holds system
- Activity logging
- Proper indexes and RLS policies
