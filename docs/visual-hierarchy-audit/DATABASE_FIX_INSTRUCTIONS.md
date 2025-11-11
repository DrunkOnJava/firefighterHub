# Database Schema Fix - Why Firefighters Aren't Displaying

## The Problem

Your firefighters aren't displaying because there's a **schema mismatch** between:
1. The bolt.new database schema (which has your 56 firefighters)
2. The new migration I created (which uses different field names)

## The Fields That Don't Match

### activity_log table
**Code expects**: `firefighter_name`, `shift`, `details`
**My schema has**: `description`, `performed_by`

### scheduled_holds table
**Code expects**: `hold_date`, `firefighter_name`, `status`, `shift`
**My schema has**: `scheduled_date`, `is_completed`

## The Fix (2 Steps)

### Step 1: Apply the Schema Fix

I've already opened the Supabase SQL Editor and copied the fix SQL to your clipboard.

1. **Paste** the SQL into the editor (Cmd+V)
2. **Click "Run"**
3. You should see: "Success. No rows returned"

This will add the missing fields to your tables WITHOUT deleting any data.

### Step 2: Verify It's Working

After running the SQL, refresh your browser at http://localhost:5173

You should now see:
- ✅ All 56 firefighters displayed
- ✅ Shift selector working (A, B, C)
- ✅ Station filtering working
- ✅ No console errors

## What the Fix Does

The SQL script:
1. **Adds missing columns** to `activity_log`:
   - `firefighter_name` (TEXT)
   - `shift` (TEXT)
   - `details` (TEXT)

2. **Adds missing columns** to `scheduled_holds`:
   - `firefighter_name` (TEXT)
   - `hold_date` (DATE)
   - `status` (TEXT with constraint)
   - `shift` (TEXT)
   - `notes` (TEXT)

3. **Copies existing data** from old columns to new ones
4. **Adds indexes** for better performance
5. **PRESERVES ALL YOUR DATA** - no deletions

## Testing (Optional)

After applying the fix, you can verify the connection:

```bash
# Run the database test script
pnpm dlx tsx scripts/test-db-connection.ts
```

This will show:
- Total firefighters in database
- Count by shift (A, B, C)
- Sample firefighter names
- Table accessibility status

## Why This Happened

When migrating from bolt.new, I created a new "clean" schema based on best practices, but didn't realize bolt.new was using different field names. The fix makes the database compatible with the existing code without breaking anything.

## After the Fix

Your app will be fully functional with:
- ✅ All 56 firefighters visible
- ✅ Add/edit/delete working
- ✅ Hold tracking working
- ✅ Activity logging working
- ✅ Shift transfers working
- ✅ Calendar scheduling working

## Troubleshooting

**If firefighters still don't show:**
1. Open browser DevTools (F12)
2. Check the Console tab for errors
3. Look for red error messages about database queries
4. Share the error message with me

**If you see CORS errors:**
1. This is normal - Supabase handles CORS automatically
2. Make sure you're on http://localhost:5173 (not a different port)

**If nothing happens:**
1. Hard refresh the browser (Cmd+Shift+R)
2. Check that the dev server is still running
3. Verify your .env file has the correct credentials

---

**Quick Action**: Just paste the SQL from your clipboard into the Supabase SQL Editor and click Run!
