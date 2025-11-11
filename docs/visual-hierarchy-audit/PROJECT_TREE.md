# FirefighterHub Project Structure

## Core Application
```
src/
├── App.tsx                          # Main app component with routing
├── main.tsx                         # Vite entry point
├── index.css                        # Global styles (Tailwind)
│
├── components/                      # React components
│   ├── ui/                          # shadcn/ui primitives
│   │   ├── button.tsx              ✅ shadcn
│   │   ├── card.tsx                ✅ shadcn
│   │   ├── dialog.tsx              ✅ shadcn
│   │   ├── dropdown-menu.tsx       ✅ shadcn
│   │   ├── input.tsx               ✅ shadcn
│   │   ├── label.tsx               ✅ shadcn
│   │   ├── select.tsx              ✅ shadcn
│   │   ├── separator.tsx           ✅ shadcn
│   │   ├── sheet.tsx               ✅ shadcn
│   │   ├── sonner.tsx              ✅ shadcn
│   │   ├── toast.tsx               ✅ shadcn
│   │   ├── toaster.tsx             ✅ shadcn
│   │   └── tooltip.tsx             ✅ shadcn
│   │
│   ├── Header.tsx                  🔄 Needs migration
│   ├── ShiftSelector.tsx           🔄 Needs migration
│   ├── MainCalendar.tsx            🔄 Needs migration
│   ├── CalendarDay.tsx             🔄 Needs migration
│   ├── FirefighterList.tsx         🔄 Needs migration
│   ├── FirefighterItem.tsx         🔄 Needs migration
│   └── [modals]/                   🔄 Multiple modals need migration
│
├── hooks/                           # Custom React hooks
│   ├── useFirefighters.ts          ✅ Business logic (no UI)
│   ├── useScheduledHolds.ts        ✅ Business logic (no UI)
│   ├── useDarkMode.ts              ✅ Business logic (no UI)
│   └── useKeyboardShortcuts.ts     ✅ Business logic (no UI)
│
├── utils/                           # Utility functions
│   ├── rotationLogic.ts            ✅ Pure functions
│   ├── calendarUtils.ts            ✅ Pure functions
│   ├── dateUtils.ts                ✅ Pure functions
│   └── validation.ts               ✅ Pure functions
│
└── lib/                             # External service integrations
    ├── supabase.ts                 ✅ Database client
    ├── database.types.ts           ✅ Generated types
    └── utils.ts                    ✅ shadcn cn() helper
```

## Configuration
```
/
├── components.json                 # shadcn/ui config
├── tailwind.config.js              # Tailwind + design tokens
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Build config
├── vitest.config.ts                # Test config
└── playwright.config.ts            # E2E test config
```

## Documentation
```
docs/
├── AI_RULES.md                     # AI agent instructions
├── DESIGN_GUIDE_V2.md              # Design system spec
├── SHADCN_MIGRATION_CHECKLIST.md   # Migration tracker
└── archive/                        # Old docs (deprecated)
```

## Testing
```
tests/
├── unit/                           # Component tests
├── integration/                    # Hook tests
└── e2e/                            # Playwright tests
```

## Database
```
supabase/
├── migrations/                     # SQL schema migrations
└── functions/                      # Edge functions
```

## Build Output (gitignored)
```
dist/                               # Production build
node_modules/                       # Dependencies
coverage/                           # Test coverage reports
```

Legend:
- ✅ = Complete / No migration needed
- 🔄 = Needs shadcn/ui migration
- ❌ = Obsolete / Delete
