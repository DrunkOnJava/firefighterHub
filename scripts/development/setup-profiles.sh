#!/bin/bash

echo "================================================================"
echo "🔧 Create Profiles Table for User Authentication"
echo "================================================================"
echo ""
echo "⚠️  Copy and paste the following SQL into:"
echo "    https://supabase.com/dashboard/project/tjljndzodowpohusrwhs/sql/new"
echo ""
echo "================================================================"
echo ""

cat /Users/griffin/Projects/firefighterHub/supabase/migrations/20251029000002_create_profiles_table.sql

echo ""
echo "================================================================"
echo ""
echo "✅ After running the SQL, create your first admin user:"
echo ""
echo "   1. Sign up via your app (or Supabase Auth UI)"
echo "   2. Then run this SQL to make yourself admin:"
echo ""
echo "      UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';"
echo ""
echo "================================================================"
