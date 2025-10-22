# FirefighterHub

A comprehensive shift rotation and availability management system for fire departments.

## Features

- **Shift Management**: Manage firefighters across A, B, and C shifts
- **Availability Tracking**: Track firefighter availability and hold rotations
- **Apparatus Certifications**: Track certifications for ambulance, engine, truck, tanker, and more
- **Activity Logging**: Complete audit trail of all changes
- **Scheduled Holds**: Plan and track firefighter holds in advance
- **Fire Station Assignment**: Organize firefighters by station

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Quick Start

### Prerequisites

- Node.js 22.18.0+ (managed via mise)
- pnpm

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone https://github.com/DrunkOnJava/firefighterHub.git
   cd firefighterHub
   pnpm install
   ```

2. **Set up the database**:

   The project is already configured with Supabase. You just need to apply the schema:

   - Open the [Supabase SQL Editor](https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]/sql/new)
   - Copy the contents of [`supabase/migrations/20251022000000_initial_schema.sql`](supabase/migrations/20251022000000_initial_schema.sql)
   - Paste and run the query
   - (Optional) Run [`database/seed.sql`](database/seed.sql) for sample data

3. **Start the development server**:
   ```bash
   pnpm dev
   ```

   The app will be available at http://localhost:5173

## Project Structure

```
firefighterHub/
├── src/
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Supabase client and types
│   └── utils/             # Utility functions
├── supabase/
│   └── migrations/        # Database migrations
├── database/
│   ├── schema.sql         # Full database schema
│   ├── seed.sql           # Sample data
│   └── SETUP_INSTRUCTIONS.md
├── scripts/               # Utility scripts
└── public/                # Static assets
```

## Database Schema

### Tables

- **firefighters**: Core firefighter information, certifications, and availability
- **scheduled_holds**: Planned hold dates and tracking
- **activity_log**: Audit trail of all system changes

### Key Features

- Row Level Security (RLS) enabled
- Automatic timestamp updates
- Comprehensive indexes for performance
- Foreign key constraints for data integrity

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Lint code with ESLint
- `pnpm typecheck` - Type check with TypeScript

### Environment Variables

The `.env` file contains:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

See [`.env.example`](.env.example) for reference.

## Supabase Project Details

- **Project**: firefighter-hub
- **Dashboard**: https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]
- **Region**: us-east-1 (East US - North Virginia)
- **Database**: PostgreSQL 14

## Migration from Bolt.new

This project was migrated from Bolt.new with the following improvements:

1. ✅ Migrated to pnpm from npm
2. ✅ Set up dedicated Supabase project
3. ✅ Comprehensive database schema with proper RLS
4. ✅ Unified migration file (removed conflicting bolt.new migrations)
5. ✅ Added seed data for testing
6. ✅ Configured for local VS Code development

## Next Steps

1. Apply the database schema using the Supabase SQL Editor
2. (Optional) Run the seed script to add sample data
3. Start the development server with `pnpm dev`
4. Begin managing your firefighter shifts!

## Support

For issues or questions, see the documentation:
- [Supabase Dashboard](https://supabase.com/dashboard/project/[YOUR_PROJECT_ID])
- [Database Setup Instructions](database/SETUP_INSTRUCTIONS.md)

---

**Built with ❤️ for Firefighters**
