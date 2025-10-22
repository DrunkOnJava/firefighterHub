#!/usr/bin/env bash
# Setup FirefighterHub database on Raspberry Pi PostgreSQL

set -e

# Configuration
DB_HOST="${DB_HOST:-192.168.1.179}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-griffin}"
DB_PASSWORD="${DB_PASSWORD:-development}"
DB_NAME="firefighters"

echo "🔥 FirefighterHub Database Setup"
echo "================================="
echo "Host: $DB_HOST:$DB_PORT"
echo "Database: $DB_NAME"
echo ""

# Check if PostgreSQL is accessible
echo "📡 Checking PostgreSQL connection..."
if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Cannot connect to PostgreSQL at $DB_HOST:$DB_PORT"
    echo "Please ensure:"
    echo "  1. PostgreSQL is running on your Raspberry Pi"
    echo "  2. You can connect from this machine"
    echo "  3. Credentials are correct"
    exit 1
fi
echo "✅ PostgreSQL connection successful"

# Create database if it doesn't exist
echo ""
echo "📦 Creating database '$DB_NAME'..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres << EOF
SELECT 'CREATE DATABASE $DB_NAME'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec
EOF
echo "✅ Database ready"

# Run schema migration
echo ""
echo "🏗️  Creating database schema..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" < "$(dirname "$0")/schema.sql"
echo "✅ Schema created successfully"

# Create .env file
echo ""
echo "📝 Creating .env file..."
cat > "$(dirname "$0")/../.env" << EOF
# Database Configuration - Raspberry Pi PostgreSQL
VITE_DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME

# Note: This project is configured for Supabase.
# To use direct PostgreSQL, you'll need to modify src/lib/supabase.ts
# See database/direct-postgres-adapter.ts for an example
EOF
echo "✅ .env file created"

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "Next steps:"
echo "  1. Review the .env file"
echo "  2. Decide if you want to use Supabase or direct PostgreSQL"
echo "  3. If using direct PostgreSQL, implement the adapter (see database/direct-postgres-adapter.ts)"
echo "  4. Run 'pnpm dev' to start the development server"
