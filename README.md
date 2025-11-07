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
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Supabase client and type definitions
│   └── utils/             # Utility functions (theme, calendar, export, etc.)
├── supabase/
│   ├── migrations/        # Database migrations
│   └── functions/         # Edge functions (calendar subscription)
├── database/
│   ├── schema.sql         # Full database schema
│   ├── seed.sql           # Sample data
│   └── SETUP_INSTRUCTIONS.md
├── scripts/               # Utility scripts for data management
└── public/                # Static assets (PWA manifests, service worker)
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
- `pnpm test` - Run tests in watch mode
- `pnpm test:run` - Run tests once
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:ui` - Open Vitest UI for interactive testing

## Testing

The project uses **Vitest** and **React Testing Library** for comprehensive automated testing.

### Running Tests

```bash
# Run tests in watch mode (great for development)
pnpm test

# Run tests once (for CI/CD)
pnpm test:run

# Generate coverage report
pnpm test:coverage

# Open interactive test UI
pnpm test:ui
```

### Test Coverage

Current test coverage focuses on critical business logic:

- **Rotation Logic** (`rotationLogic.ts`): 100% coverage
  - 30 tests covering sort, recalculate, moveToBottom functions
  - Ensures correct hold rotation order

- **Calendar Utilities** (`calendarUtils.ts`): 100% coverage
  - 41 tests covering date handling, scheduling, formatting
  - Prevents timezone bugs

**Overall Coverage**: 100% on critical utilities

### Test Structure

```
src/
├── test/
│   ├── setup.ts           # Test environment configuration
│   ├── mockData.ts        # Mock firefighters and test data
│   └── supabaseMock.ts    # Supabase client mocks
└── utils/
    ├── rotationLogic.test.ts      # Rotation logic tests
    └── calendarUtils.test.ts      # Calendar utility tests
```

### Writing Tests

Example test structure:

```typescript
import { describe, it, expect } from 'vitest';
import { sortFirefighters } from './rotationLogic';
import { createMockFirefighter } from '../test/mockData';

describe('rotationLogic', () => {
  it('sorts firefighters by order_position', () => {
    const firefighters = [
      createMockFirefighter({ order_position: 2 }),
      createMockFirefighter({ order_position: 0 }),
    ];

    const result = sortFirefighters(firefighters);

    expect(result[0].order_position).toBe(0);
    expect(result[1].order_position).toBe(1);
  });
});
```

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

## For AI Developers

This repository is configured for GitHub Copilot and other AI coding assistants:

- **Copilot Instructions**: See [`.github/copilot-instructions.md`](.github/copilot-instructions.md) for comprehensive project context, architecture patterns, and coding conventions
- **Custom Agents**: See [`.github/agents/`](.github/agents/) for specialized agents (UI/UX implementation specialist)
- **MCP Configuration**: See [`.github/mcp-config.json`](.github/mcp-config.json) for Model Context Protocol server setup

The Copilot instructions include critical patterns for shift-based data isolation, rotation logic, real-time sync, and more.

## Support

For issues or questions, see the documentation:
- [Supabase Dashboard](https://supabase.com/dashboard/project/[YOUR_PROJECT_ID])
- [Database Setup Instructions](database/SETUP_INSTRUCTIONS.md)

---

**Built with ❤️ for Firefighters**
