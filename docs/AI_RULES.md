# AI Agent Rules - FirefighterHub

**This document supersedes all previous design documents and is the single source of truth for AI agents working on this codebase.**

---

## 🎯 Core Principles

1. **shadcn/ui First** - Use `@/components/ui/*` primitives exclusively
2. **No Custom CSS** - Composition of shadcn + Tailwind only
3. **Full Viewport** - Use all available screen space (h-screen, min-h-screen)
4. **No Text Truncation** - All text must be fully visible (except brand text on tiny screens)
5. **One Line Per Row** - Tables, rosters, lists show full data on single lines
6. **CSS Variables Only** - No hardcoded colors except shift colors

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/          # shadcn/ui primitives (Button, Card, etc.)
│   ├── Header.tsx   # Main header component
│   ├── ShiftSelector.tsx
│   └── ...
├── lib/
│   └── utils.ts     # shadcn cn() helper
└── styles/          # CSS variables & tokens
```

**Path Alias:** Use `@/*` for all imports
```tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

---

## 🎨 Design System

### Colors (CSS Variables)

**Use ONLY these:**
```tsx
className="bg-background text-foreground"
className="bg-card text-card-foreground"  
className="bg-primary text-primary-foreground"
className="bg-secondary text-secondary-foreground"
className="bg-muted text-muted-foreground"
className="bg-destructive text-destructive-foreground"
className="border-border"
className="bg-accent text-accent-foreground"
```

**Shift Colors (ONLY Custom Colors Allowed):**
```tsx
// Shift A
className="bg-emerald-600 text-white"

// Shift B  
className="bg-blue-600 text-white"

// Shift C
className="bg-red-600 text-white"
```

**❌ NEVER use:**
- `bg-gray-*`, `bg-slate-*` (use CSS variables instead)
- Custom hex colors
- Opacity calculations in classes
- New gradient definitions

---

## 📐 Layout Patterns

### Full Viewport App Layout
```tsx
<div className="flex flex-col h-screen">
  <Header className="flex-shrink-0 h-16 border-b" />
  <main className="flex-1 overflow-auto">
    <div className="h-full w-full p-6">
      {children}
    </div>
  </main>
</div>
```

### Roster/Table (No Truncation)
```tsx
<div className="h-full flex flex-col">
  <div className="flex-shrink-0 mb-4">
    <h2 className="text-xl font-semibold">Title</h2>
  </div>
  <div className="flex-1 overflow-auto">
    <Table>
      <TableHeader className="sticky top-0 bg-background">
        <TableRow>
          <TableHead className="whitespace-nowrap">Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="whitespace-nowrap font-medium">
            Full Name Here
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</div>
```

### Calendar (Full Space Grid)
```tsx
<div className="h-full flex flex-col">
  <div className="flex-shrink-0 mb-4">
    {/* Navigation */}
  </div>
  <div className="flex-1 grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
    {days.map((day) => (
      <div key={day} className="bg-card p-2 min-h-0 flex flex-col">
        <div className="text-sm font-medium">{day}</div>
        <div className="flex-1 overflow-auto">
          {/* Events - NO truncation */}
          {events.map((event) => (
            <div className="text-xs whitespace-nowrap">{event.name}</div>
          ))}
        </div>
      </div>
    ))}
  </div>
</div>
```

---

## 📝 Typography Hierarchy

```tsx
// Page title
<h1 className="text-2xl font-bold">Page Title</h1>

// Section header
<h2 className="text-xl font-semibold">Section</h2>

// Subsection
<h3 className="text-lg font-medium">Subsection</h3>

// Body text
<p className="text-base">Content</p>

// Secondary/meta
<span className="text-sm text-muted-foreground">Metadata</span>

// Labels
<label className="text-xs text-muted-foreground">Label</label>
```

---

## 🚫 Text Truncation Rules

**❌ REMOVE these classes:**
- `truncate`
- `text-ellipsis`  
- `overflow-hidden` (on text containers)
- `line-clamp-1`, `line-clamp-2`, etc.
- `max-w-*` (on text elements)

**✅ USE instead:**
- `whitespace-nowrap` (for one-line display)
- `overflow-auto` (for scrollable containers)
- `flex-shrink-0` (prevent shrinking)

**Exception:** Brand text in header can use `whitespace-nowrap` with container overflow handling

---

## 🧩 Component Usage

### Buttons
```tsx
import { Button } from "@/components/ui/button"

<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Subtle</Button>
<Button size="lg">Large</Button>
<Button size="sm">Small</Button>
<Button size="icon"><Icon /></Button>
```

### Cards
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Badges
```tsx
import { Badge } from "@/components/ui/badge"

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Alert</Badge>
<Badge variant="outline">Outline</Badge>
```

### Tables
```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="whitespace-nowrap">Header</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="whitespace-nowrap">Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## ⚙️ Configuration Rules

### When Editing Code:

**DO:**
- ✅ Use shadcn/ui components from `@/components/ui/*`
- ✅ Compose with Tailwind utilities
- ✅ Use CSS variables for colors
- ✅ Ensure full viewport usage (h-screen patterns)
- ✅ Remove text truncation
- ✅ Add `whitespace-nowrap` to table cells
- ✅ Test dark/light mode compatibility

**DO NOT:**
- ❌ Touch build config (vite.config.ts, tsconfig) unless explicitly asked
- ❌ Re-run `shadcn init` unless config changed
- ❌ Create new design tokens outside this document
- ❌ Add custom CSS files
- ❌ Use hardcoded colors (except shift colors)
- ❌ Add max-width constraints on main content
- ❌ Create custom styled components

### Installing New Components:

```bash
# Always use shadcn CLI
npx shadcn@latest add <component-name>

# Never create custom versions
```

---

## 🎯 Specific Component Rules

### Calendar
- Full-width month grid
- Minimum cell size to show 3-4 event pills
- Events display full text (no truncation)
- Scrollable within cells if needed

### Roster
- One row per firefighter
- Single line per row (no text wrapping)
- All columns fully visible
- Horizontal scroll if needed
- Use Badge component for shift indicators

### Header
- Fixed height: `h-16`
- Full width, no max-width
- Use Button component for all actions
- Shift selector uses custom emerald/blue/red colors
- All other colors from CSS variables

---

## 🐛 Common Mistakes to Avoid

1. **Creating custom styled components** → Use shadcn primitives
2. **Using bg-gray-*** → Use CSS variables
3. **Adding truncate** → Use whitespace-nowrap + scrolling
4. **Fixed heights on content** → Use flex-1 and h-full patterns
5. **New color definitions** → Only shift colors allowed
6. **Reinventing button styles** → Use shadcn Button variants
7. **Custom shadows/borders** → Use shadcn defaults

---

## 📋 Pre-Commit Checklist

Before any commit, verify:

- [ ] No `truncate` or `line-clamp` on data cells
- [ ] No `bg-gray-*` colors (use CSS variables)
- [ ] All buttons use shadcn Button component
- [ ] Layout uses h-screen/flex patterns
- [ ] Shift colors correct (emerald/blue/red)
- [ ] No new CSS files added
- [ ] Imports use `@/*` paths
- [ ] Dark/light mode both work

---

## 🔍 Search & Replace Guide

**Find these and fix:**

```bash
# Colors
bg-gray- → bg-background, bg-card, etc.
text-gray- → text-foreground, text-muted-foreground
border-gray- → border-border

# Truncation
truncate → whitespace-nowrap (or remove)
line-clamp-* → Remove, use overflow-auto
max-w-* → Remove from text containers

# Components
<button> → <Button> (from shadcn)
<div className="card"> → <Card> (from shadcn)
```

---

## 📚 Reference Documents

**Primary:** This document (AI_RULES.md)
**Secondary:** DESIGN_GUIDE_V2.md (for context only)
**Archived:** All HEADER_REDESIGN_*.md files (outdated)

**When in doubt:** Follow shadcn/ui documentation and this document.

---

## 🤖 AI Agent Prompts

**Good prompts:**
- "Refactor the Roster component to use shadcn Table with no text truncation"
- "Add a new Card for Next Up section using shadcn Card component"
- "Fix calendar layout to use full viewport height"

**Bad prompts:**
- "Create a custom button component" (use shadcn Button)
- "Add some nice colors" (follow CSS variable system)
- "Make it look better" (too vague, specify what)

---

**Last Updated:** 2025-11-09
**Version:** 2.0 (shadcn/ui migration)
