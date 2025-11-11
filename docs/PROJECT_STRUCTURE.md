# FirefighterHub - Core Project Structure

```
firefighterHub/
│
├── 📋 CORE DOCUMENTATION
│   ├── AI_RULES.md                        ← Binding AI/agent instructions
│   ├── DESIGN_GUIDE_V2.md                 ← Primary design specification
│   ├── DEPLOYMENT_FINAL_STATUS.md         ← Deployment readiness report
│   ├── SHADCN_MCP_SETUP.md                ← MCP server setup guide
│   ├── README.md                           ← Project overview
│   └── CLAUDE.md                           ← Claude-specific guidance
│
├── ⚙️  CONFIGURATION
│   ├── package.json                        ← Dependencies & scripts
│   ├── tsconfig.json                       ← TypeScript config (strict mode)
│   ├── vite.config.ts                      ← Build tool config
│   ├── tailwind.config.js                  ← Tailwind CSS config
│   ├── playwright.config.ts                ← E2E test config
│   ├── vitest.config.ts                    ← Unit test config
│   ├── components.json                     ← shadcn/ui registry config
│   ├── vercel.json                         ← Deployment config
│   └── .vscode/
│       └── mcp.json                        ← MCP servers (GitHub, Playwright, shadcn)
│
├── 📦 SOURCE CODE
│   └── src/
│       ├── App.tsx                         ← Main app component (388 lines)
│       ├── index.css                       ← Global styles + CSS Grid
│       │
│       ├── components/                     ← React components
│       │   ├── Header.tsx                  ← Main header
│       │   ├── ShiftSelector.tsx           ← Shift A/B/C selector (locked config)
│       │   ├── FirefighterList.tsx         ← Roster component (400 lines)
│       │   ├── AddFirefighterForm.tsx      ← Add new firefighter
│       │   ├── CompleteHoldModal.tsx       ← Complete hold workflow
│       │   ├── TransferShiftModal.tsx      ← Transfer between shifts
│       │   ├── BattalionChiefLogin.tsx     ← Admin authentication
│       │   │
│       │   ├── calendar/                   ← Calendar components
│       │   │   ├── MainCalendar.tsx        ← FullCalendar integration
│       │   │   ├── DayCell.tsx             ← Calendar day cell
│       │   │   ├── DayScheduleModal.tsx    ← Day detail view
│       │   │   └── CalendarLegend.tsx      ← Color legend
│       │   │
│       │   ├── mobile/                     ← Mobile-specific components
│       │   │   ├── FirefighterCard.tsx     ← Mobile roster card
│       │   │   ├── BottomNav.tsx           ← Bottom navigation
│       │   │   └── BottomSheet.tsx         ← Mobile drawer
│       │   │
│       │   ├── roster/                     ← Roster sub-components
│       │   │   ├── RosterHeader.tsx        ← Roster header
│       │   │   ├── BulkActions.tsx         ← Bulk operations
│       │   │   └── ExportMenu.tsx          ← Export functionality
│       │   │
│       │   └── ui/                         ← shadcn/ui components
│       │       ├── badge.tsx               ← Badge component
│       │       ├── card.tsx                ← Card component
│       │       ├── separator.tsx           ← Separator
│       │       ├── table.tsx               ← Table component
│       │       └── tooltip.tsx             ← Tooltip component
│       │
│       ├── hooks/                          ← Custom React hooks
│       │   ├── useFirefighters.ts          ← Firefighter CRUD + real-time (845 lines)
│       │   ├── useScheduledHolds.ts        ← Hold management (477 lines)
│       │   ├── useToast.ts                 ← Toast notifications
│       │   ├── useDarkMode.ts              ← Dark mode state
│       │   ├── useDevice.ts                ← Responsive breakpoints
│       │   ├── useKeyboardShortcuts.ts     ← Keyboard shortcuts
│       │   └── useAnnounce.ts              ← Screen reader announcements
│       │
│       ├── lib/                            ← Core libraries
│       │   ├── supabase.ts                 ← Supabase client + types
│       │   ├── database.types.ts           ← Auto-generated DB types
│       │   └── utils.ts                    ← shadcn/ui utilities (cn)
│       │
│       ├── styles/                         ← Design system
│       │   ├── index.ts                    ← Main export
│       │   ├── colorSystem.ts              ← Color palette (slate + shifts)
│       │   ├── tokens.ts                   ← Design tokens
│       │   ├── gridSystem.ts               ← Responsive grid
│       │   └── visualHeadings.ts           ← Typography helpers
│       │
│       ├── utils/                          ← Utility functions
│       │   ├── rotationLogic.ts            ← Hold rotation algorithm (100% coverage)
│       │   ├── calendarUtils.ts            ← Calendar helpers (100% coverage)
│       │   ├── dateUtils.ts                ← UTC date formatting
│       │   ├── validation.ts               ← Input validation (100% coverage)
│       │   └── exportUtils.ts              ← CSV/JSON export
│       │
│       └── test/                           ← Test utilities
│           ├── mockData.ts                 ← Factory functions
│           ├── setup.ts                    ← Vitest config
│           └── supabaseMock.ts             ← Supabase mock client
│
├── 🗄️  DATABASE
│   └── supabase/
│       ├── migrations/                     ← Database schema evolution
│       │   ├── 20251022000000_initial_schema.sql
│       │   ├── 20251028_add_lent_to_shift.sql
│       │   ├── 20251102_add_duration_start_time.sql
│       │   ├── 20251107_add_voluntary_holds.sql
│       │   └── [18 total migrations]
│       │
│       └── functions/                      ← Supabase Edge Functions
│           ├── hold-schedule-calendar/     ← iCal subscription
│           └── schedule-hold/              ← Schedule validation
│
├── 🧪 TESTS
│   └── tests/
│       └── ui/
│           └── layout-snapshot.spec.ts     ← Visual regression tests
│
├── 🔧 SCRIPTS
│   └── scripts/
│       └── [utility scripts for data management]
│
└── 📝 REFERENCE DOCUMENTATION (Archive)
    ├── CALENDAR_REFINEMENT_COMPLETE.md
    ├── FULLCALENDAR_MIGRATION_COMPLETE.md
    ├── GRID_SYSTEM_COMPLETE.md
    ├── TOUCH_TARGET_MIGRATION_COMPLETE.md
    ├── VISUAL_HIERARCHY_AUDIT_COMPLETE.md
    └── [60+ historical documentation files]
```

## Key Files

### Critical Path (Required for Core Functionality)
- `src/App.tsx` - Main application shell
- `src/hooks/useFirefighters.ts` - Roster state management
- `src/hooks/useScheduledHolds.ts` - Hold scheduling
- `src/utils/rotationLogic.ts` - Rotation algorithm (100% tested)
- `src/lib/supabase.ts` - Database client
- `src/index.css` - CSS Grid layout + global styles

### Design System (Agent-Proof)
- `AI_RULES.md` - Binding instructions for AI agents
- `DESIGN_GUIDE_V2.md` - Visual specification
- `src/styles/colorSystem.ts` - Color palette (slate + emergency colors)
- `src/styles/tokens.ts` - Design tokens
- `components.json` - shadcn/ui registry

### Testing Infrastructure
- `playwright.config.ts` - E2E test configuration
- `vitest.config.ts` - Unit test configuration
- `tests/ui/layout-snapshot.spec.ts` - Visual regression tests
- `src/utils/*.test.ts` - Unit tests (100% coverage on critical paths)

### Configuration
- `package.json` - 319 dependencies installed
- `tsconfig.json` - Strict TypeScript mode
- `.vscode/mcp.json` - 3 MCP servers (GitHub, Playwright, shadcn)

## File Counts

| Category | Count |
|----------|-------|
| Total Files | 585 |
| Source Files (src/) | ~200 |
| Components | ~60 |
| Hooks | 25 |
| Utils | 20 |
| Tests | 12 unit + 1 E2E |
| Migrations | 18 |
| Documentation | 60+ |

## Storage

| Directory | Size |
|-----------|------|
| node_modules | ~350MB |
| src/ | ~2MB |
| supabase/migrations | ~100KB |
| Documentation | ~500KB |

## Architecture Highlights

**Frontend:**
- React 18 + TypeScript (strict mode)
- Tailwind CSS + shadcn/ui components
- FullCalendar for scheduling
- Real-time updates via Supabase subscriptions

**Backend:**
- Supabase (PostgreSQL + Real-time + Edge Functions)
- Row-Level Security (RLS) policies
- 18 schema migrations tracked

**Testing:**
- Vitest (unit tests) - 100% coverage on rotation logic
- Playwright (E2E tests) - Layout snapshots
- React Testing Library (component tests)

**Deployment:**
- Vercel (production hosting)
- Environment-based configuration
- PWA-ready (service worker + manifest)

---

**Last Updated:** 2025-11-09  
**Status:** 🟢 Production Ready (pending TypeScript fixes)
